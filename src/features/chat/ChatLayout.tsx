import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllConversations,
  selectCurrentConversationId,
  setCurrentConversation,
  selectIsMobile,
  selectShowChat,
  setIsMobile,
  setShowChat,
} from "../../store/chatSlice";
import ChatSidebar from "./components/ChatSidebar";
import ChatWindow from "./components/ChatWindow";
import EmptyChatState from "./components/EmptyChatState";
import ChatDataInitializer from "./components/ChatDataInitializer";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  CircularProgress,
  Stack,
  useTheme,
} from "@mui/material";

const ChatLayout: React.FC = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const conversations = useSelector(selectAllConversations);
  const currentConversationId = useSelector(selectCurrentConversationId);
  const theme = useTheme();
  const isMobile = useSelector(selectIsMobile);
  const showChat = useSelector(selectShowChat);

  // Update the media query effect to dispatch to store
  useEffect(() => {
    const handleResize = () => {
      const mobileView = !!(
        window.matchMedia &&
        window.matchMedia(theme.breakpoints.down("sm").replace("@media ", ""))
          .matches
      );
      dispatch(setIsMobile(mobileView));
    };

    // Initialize on mount
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, theme.breakpoints]);

  // Handle responsive behavior
  useEffect(() => {
    if (!isMobile) {
      // On larger screens, always show chat if one is selected
      if (currentConversationId) {
        dispatch(setShowChat(true));
      }
    } else {
      // On mobile, only show chat if conversation is selected
      dispatch(setShowChat(!!currentConversationId));
    }
  }, [isMobile, currentConversationId, dispatch]);

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    dispatch(setCurrentConversation(conversationId));
  };

  return (
    <>
      {/* Pass the user from context to initializer */}
      <ChatDataInitializer currentUser={user} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          // height: "100%",
          bgcolor: "background.default",
          overflow: "hidden",
        }}
      >
        {/* Sidebar for conversations - hide on mobile when chat is shown */}
        <Box
          sx={{
            // On mobile: hide sidebar when showing chat
            // On tablet/desktop: always show sidebar
            display: isMobile && showChat ? "none" : "block",
            maxWidth: { sm: "320px", md: "380px" },
            borderRight: `1px solid ${theme.palette.divider}`,
            height: `calc(100vh - ${isMobile ? "58px" : "66px"})`,
            overflow: "auto",
          }}
        >
          <ChatSidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            currentUser={user}
            onSelectConversation={handleConversationSelect}
          />
        </Box>

        {/* Chat window area */}
        <Stack
          sx={{
            flexGrow: 1,
            position: "relative",
            overflow: "hidden",
            // On mobile: show chat window only when a conversation is selected and showChat is true
            // On tablet/desktop: always show chat window area
            display: isMobile ? (showChat ? "flex" : "none") : "flex",
          }}
        >
          {conversations.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", // Added to center the loading spinner vertically
              }}
            >
              <CircularProgress size={40} color="primary" />
            </Box>
          ) : currentConversationId ? (
            <ChatWindow
              conversationId={currentConversationId}
              currentUser={user}
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