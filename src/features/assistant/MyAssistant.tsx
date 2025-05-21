import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { MessageList } from "./components/MessageList";
import { ChatInput } from "./components/ChatInput";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import { Sidebar } from "./components/Sidebar";
import { AttachmentModal } from "./components/AttachmentModal";
import {
  addConversation,
  selectConversation,
  renameConversation,
  deleteConversation,
  setConversations,
} from "../../store/assistantSlice";
import {
  saveConversationsToStorage,
  loadConversationsFromStorage,
} from "../../services/assistantService";
import { AiConversationType } from "../../types/chat";
import { EmptyMessagesState } from "../../components/common/EmptyMessagesState";

const MSG_KEY_PREFIX = "assistant_messages_";

const getMessagesFromStorage = (
  conversationId: string
): AiConversationType[] => {
  try {
    const data = localStorage.getItem(`${MSG_KEY_PREFIX}${conversationId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveMessagesToStorage = (
  conversationId: string,
  messages: AiConversationType[]
) => {
  localStorage.setItem(
    `${MSG_KEY_PREFIX}${conversationId}`,
    JSON.stringify(messages)
  );
};

const MyAssistant = () => {
  const dispatch = useDispatch();
  const conversations = useSelector(
    (state: any) => state.assistant.conversations
  );
  const activeId = useSelector((state: any) => state.assistant.activeId);

  // --- Per-conversation messages state ---
  const [messagesMap, setMessagesMap] = useState<{
    [id: string]: AiConversationType[];
  }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);

  // --- Load conversations and messages from localStorage on mount ---
  useEffect(() => {
    const loaded = loadConversationsFromStorage();
    dispatch(setConversations(loaded));
    // Load all messages for each conversation
    const map: { [id: string]: AiConversationType[] } = {};
    loaded.forEach((conv) => {
      map[conv.id] = getMessagesFromStorage(conv.id);
    });
    setMessagesMap(map);
  }, [dispatch]);

  // --- Save conversations to localStorage on change ---
  useEffect(() => {
    saveConversationsToStorage(conversations);
  }, [conversations]);

  // --- Save messages to localStorage on change ---
  useEffect(() => {
    Object.entries(messagesMap).forEach(([id, msgs]) => {
      saveMessagesToStorage(id, msgs);
    });
  }, [messagesMap]);

  // --- Conversation Handlers ---
  const handleSelect = (id: string) => dispatch(selectConversation(id));

  const handleAdd = (name = `Chat ${conversations.length + 1}`): string => {
    const now = Date.now();
    const newId = now.toString();
    dispatch(
      addConversation({
        id: newId,
        name,
        messages: [],
        createdAt: now,
        updatedAt: now,
      })
    );
    setMessagesMap((prev) => ({ ...prev, [newId]: [] }));
    return newId;
  };

  const handleRename = (id: string, newName: string) => {
    dispatch(
      renameConversation({
        id,
        name: newName,
        updatedAt: Date.now(),
      })
    );
  };

  const handleDelete = (id: string) => {
    dispatch(deleteConversation(id));
    setMessagesMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });

    localStorage.removeItem(`${MSG_KEY_PREFIX}${id}`);
  };

  const currentMessages = messagesMap[activeId] || [];

  // --- Message Handlers ---
  const sendMessage = async (content: string, files?: File[]) => {
    let currentActiveId = activeId;

    const trimmed = content.trim();
    const snippet =
      trimmed
        .split(/\s+/)
        .slice(0, 4)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") || "Chat";

    if (!currentActiveId) {
      currentActiveId = handleAdd(snippet);
      if (!currentActiveId) {
        console.error("Failed to create new conversation");
        return;
      }
    } else {
      const isFirstMessage = (messagesMap[currentActiveId]?.length || 0) === 0;
      if (isFirstMessage) {
        handleRename(currentActiveId, snippet);
      }
    }

    const fileAttachments = (files || []).map((f) => ({
      name: f.name,
      size: f.size.toString(),
      type: f.type,
    }));

    const newMessage: AiConversationType = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
      files: fileAttachments,
    };

    setMessagesMap((prev) => {
      const arr = prev[currentActiveId] || [];
      return { ...prev, [currentActiveId]: [...arr, newMessage] };
    });

    dispatch({
      type: "assistant/updateConversationTimestamp",
      payload: { id: currentActiveId, updatedAt: Date.now() },
    });

    setIsTyping(true);
    setAttachments([]);

    // Simulated AI response
    setTimeout(() => {
      const aiResponse: AiConversationType = {
        id: Date.now().toString(),
        type: "ai",
        content: "This is a simulated AI response",
        timestamp: new Date(),
        references: [{ id: "1", name: "Document.pdf", type: "pdf" }],
        quickReplies: ["Tell me more", "Not now"],
      };

      setMessagesMap((prev) => {
        const arr = prev[currentActiveId] || [];
        return { ...prev, [currentActiveId]: [...arr, aiResponse] };
      });

      setIsTyping(false);
    }, 1200);
  };

  // --- Theme/Responsive ---
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100vh - ${isMobile ? "58px" : "66px"})`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onAdd={handleAdd}
          onRename={handleRename}
          onDelete={handleDelete}
        />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flex: 1, overflow: "auto", px: 2 }}>
            {currentMessages.length > 0 ? (
              <MessageList messages={currentMessages} isTyping={isTyping} />
            ) : (
              <EmptyMessagesState
                title="No conversations found"
                description="Start a new conversation by sending a message or asking a question"
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: "80%", lg: "70%" },
                  }}
                >
                  <ChatInput
                    onSend={sendMessage}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    onOpenAttachmentModal={() => setAttachmentModalOpen(true)}
                  />
                </Box>
              </EmptyMessagesState>
            )}
          </Box>
          {currentMessages.length > 0 && (
            <Box sx={{ px: 2, pb: 2 }}>
              <ChatInput
                onSend={sendMessage}
                attachments={attachments}
                setAttachments={setAttachments}
                onOpenAttachmentModal={() => setAttachmentModalOpen(true)}
              />
            </Box>
          )}
        </Box>

        <AttachmentModal
          open={attachmentModalOpen}
          onClose={() => setAttachmentModalOpen(false)}
          onFilesSelected={(files) =>
            setAttachments((prev) => [...prev, ...files])
          }
        />
      </Box>
    </Box>
  );
};

export default MyAssistant;
