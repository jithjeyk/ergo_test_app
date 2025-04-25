// src/components/chat/ChatWindow.tsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMessagesForCurrentConversation,
  submitMessage,
  loadMessagesForConversation,
  selectTypingUsersInCurrentConversation,
  updateTypingIndicator,
} from "../../store/chatSlice";
import { User } from "../../types/types";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import { Box, Typography, Stack } from "@mui/material";

interface ChatWindowProps {
  conversationId: string;
  currentUser: User | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  currentUser,
}) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessagesForCurrentConversation);
  const typingUsers = useSelector(selectTypingUsersInCurrentConversation);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages for this conversation if needed
  useEffect(() => {
    dispatch(loadMessagesForConversation(conversationId));
  }, [conversationId, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentUser) return;

    dispatch(
      submitMessage({
        conversationId,
        content: messageText,
        currentUser,
      })
    );

    setMessageText("");

    // Clear typing indicator when sending
    dispatch(
      updateTypingIndicator({
        conversationId,
        userId: currentUser.id,
        isTyping: false,
      })
    );
  };

  const handleTyping = (text: string) => {
    setMessageText(text);

    if (!currentUser) return;

    // Update typing indicator based on text content
    dispatch(
      updateTypingIndicator({
        conversationId,
        userId: currentUser.id,
        isTyping: text.length > 0,
      })
    );
  };

  return (
    <Stack
      sx={{
        height: "calc(100vh - 66px)", // Use viewport height to ensure full screen coverage
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent Stack from scrolling
      }}
    >
      <ChatHeader conversationId={conversationId} />
      <Box
        sx={{
          flexGrow: 1,
          position: "relative", // Establish positioning context
          overflowY: "auto",
          overflowX: "hidden",
          p: 2,
          // Firefox scrollbar styling
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
          // Webkit browsers
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      >
        <ChatMessageList
          messages={messages}
          currentUserId={currentUser?.id || ""}
        />
        <div ref={messagesEndRef} />
        {typingUsers.length > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, ml: 1 }}
          >
            Someone is typing...
          </Typography>
        )}
      </Box>
      <ChatInput
        value={messageText}
        onChange={handleTyping}
        onSend={handleSendMessage}
      />
    </Stack>
  );
};

export default ChatWindow;
