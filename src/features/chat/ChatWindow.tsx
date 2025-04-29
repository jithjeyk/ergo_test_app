// src/components/chat/ChatWindow.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMessagesForCurrentConversation,
  submitMessage,
  loadMessagesForConversation,
  selectTypingUsersInCurrentConversation,
  updateTypingIndicator,
  selectCurrentConversation,
  selectParticipantsForCurrentConversation,
} from "../../store/chatSlice";
import { User } from "../../types/types";
// import { Participant } from "../../types/chat";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import GroupInfoDialog from "./GroupInfoDialog";
import {
  Box,
  Typography,
  // Stack,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface ChatWindowProps {
  conversationId: string;
  currentUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  currentUser,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // Selectors
  const conversation = useSelector(selectCurrentConversation);
  const messages = useSelector(selectMessagesForCurrentConversation);
  const typingUserIds = useSelector(selectTypingUsersInCurrentConversation);
  const participants = useSelector(selectParticipantsForCurrentConversation);

  // State
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (conversationId) {
      dispatch(loadMessagesForConversation(conversationId));
    }
  }, [conversationId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversationId]);

  // Handlers
  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser || !conversation) return;

    dispatch(
      submitMessage({
        conversationId: conversation.id,
        content: messageText,
        currentUser,
      })
    );

    setMessageText("");

    dispatch(
      updateTypingIndicator({
        conversationId: conversation.id,
        userId: currentUser.id,
        isTyping: false,
      })
    );
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (!currentUser || !conversation) return;

    dispatch(
      updateTypingIndicator({
        conversationId: conversation.id,
        userId: currentUser.id,
        isTyping: text.length > 0,
      })
    );
  };

  // Group info handlers
  const handleOpenGroupInfo = () => {
    setGroupInfoOpen(true);
  };

  const handleCloseGroupInfo = () => {
    setGroupInfoOpen(false);
  };

  // Memoized calculation for typing indicator text
  const typingIndicatorText = useMemo(() => {
    if (!currentUser || !participants || typingUserIds.length === 0)
      return null;

    const typingNames = typingUserIds
      .filter((id) => id !== currentUser.id)
      .map((id) => participants.find((p) => p.id === id)?.name?.split(" ")[0])
      .filter((name) => !!name);

    if (typingNames.length === 0) return null;
    if (typingNames.length === 1) return `${typingNames[0]} is typing...`;
    if (typingNames.length === 2)
      return `${typingNames[0]} and ${typingNames[1]} are typing...`;
    return `${typingNames[0]}, ${typingNames[1]} and others are typing...`;
  }, [typingUserIds, participants, currentUser]);

  // Loading state
  if (!conversation || !currentUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "row", // Explicitly set to row
        overflow: "hidden", // Prevent horizontal scrolling
      }}
    >
      {/* Main chat content that will shrink when sidebar is open */}
      <Box
        sx={{
          height: "calc(100vh - 66px)",
          // flexGrow: 1,
          width: groupInfoOpen && isDesktop ? "55%" : "100%",
          minWidth: 0, // Important for flex items to shrink properly
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Pass the custom onOpenGroupInfo prop to ChatHeader */}
        <ChatHeader
          conversation={conversation}
          currentUser={currentUser}
          onOpenGroupInfo={handleOpenGroupInfo}
        />

        <Box
          sx={{
            flexGrow: 1,
            position: "relative",
            overflowY: "auto",
            overflowX: "hidden",
            p: 2,
            bgcolor: "background.default",
            scrollbarWidth: "thin",
            scrollbarColor: (theme) =>
              `${theme.palette.action.selected} transparent`,
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-track": { background: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: (theme) => theme.palette.action.selected,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            },
          }}
        >
          <ChatMessageList
            messages={messages}
            currentUserId={currentUser.id}
            participants={participants}
            conversationType={conversation.type}
          />
          <div ref={messagesEndRef} />

          {typingIndicatorText && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, ml: 1, fontStyle: "italic" }}
            >
              {typingIndicatorText}
            </Typography>
          )}
        </Box>
        <ChatInput
          value={messageText}
          onChange={handleTyping}
          onSend={handleSendMessage}
        />
      </Box>

      {/* Group Info Sidebar */}
      <GroupInfoDialog
        open={groupInfoOpen}
        onClose={handleCloseGroupInfo}
        conversation={conversation}
        currentUser={currentUser}
      />
    </Box>
  );
};

export default React.memo(ChatWindow);
