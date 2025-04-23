// src/features/chat/ChatLayout.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllConversations,
  selectCurrentConversationId,
  setCurrentConversation,
} from "../../store/chatSlice";
import ChatSidebar from "./ChatSidebar";
import ChatAppBar from "./ChatAppBar";
import ChatWindow from "./ChatWindow";
import EmptyChatState from "./EmptyChatState";
import ChatDataInitializer from "./ChatDataInitializer";
import { User } from "../../types/types";
import { Box, CircularProgress, Stack } from "@mui/material";

interface ChatLayoutProps {
  currentUser: User | null;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ currentUser }) => {
  const dispatch = useDispatch();
  const conversations = useSelector(selectAllConversations);
  const currentConversationId = useSelector(selectCurrentConversationId);

  // Auto-select first conversation if none is selected
  useEffect(() => {
    console.log("conversations", conversations);

    if (!currentConversationId && conversations.length > 0) {
      dispatch(setCurrentConversation(conversations[0].id));
    }
  }, [conversations, currentConversationId, dispatch]);

  return (
    <>
      {/* Invisible component that initializes our sample data if needed */}
      <ChatDataInitializer currentUser={currentUser} />

      <Box
        sx={{
          display: "flex",
          // height: '100%',
          bgcolor: "background.default", // Use theme background color
          overflow: "hidden", // Prevent scrolling of the entire layout
        }}
      >
        <ChatAppBar />

        {/* Sidebar for conversations */}
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          currentUser={currentUser}
        />

        <Stack
          sx={{
            flexGrow: 1,
            position: "relative", // For loading indicator positioning
            overflow: "hidden", // Prevent content overflow
          }}
        >
          {conversations.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CircularProgress size={40} color="primary" />
            </Box>
          ) : currentConversationId ? (
            <ChatWindow
              conversationId={currentConversationId}
              currentUser={currentUser}
            />
          ) : (
            <EmptyChatState />
          )}
        </Stack>
      </Box>
    </>
  );
};

export default React.memo(ChatLayout);
