// src/components/chat/ChatHeader.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChatState,
  selectIsMobile,
  selectShowChat,
  setShowChat,
} from "../../store/chatSlice";
import Avatar from "../../components/common/Avatar";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
// import PhoneIcon from '@mui/icons-material/Phone';
// import VideocamIcon from '@mui/icons-material/Videocam';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatTimeAgo } from "../../utils/dateUtils";

interface ChatHeaderProps {
  conversationId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversationId }) => {
  const dispatch = useDispatch();
  const { conversations } = useSelector(selectChatState);
  const conversation = conversations[conversationId];
  const isMobile = useSelector(selectIsMobile);
  const showChat = useSelector(selectShowChat);

  const handleBackToList = () => {
    dispatch(setShowChat(false));
  };

  if (!conversation) {
    return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 64 }}>
          <Typography>Loading...</Typography>
        </Toolbar>
      </AppBar>
    );
  }

  // In a real app, you would filter out the current user and show the other participants
  const participant = conversation.participants[0]; // Simplified for demo

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ p: 0.3, borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 64 }}>
        {/* Mobile back button */}
        {isMobile && showChat && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={handleBackToList}
              aria-label="Back to conversations"
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
        )}
        <Avatar
          src={participant.avatar || ""}
          alt={participant.name}
          size="md"
          status={participant.isOnline ? "online" : undefined}
        />

        <Box sx={{ ml: 2 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            {participant.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {participant.isOnline
              ? "Online"
              : participant.lastSeen
              ? `Last seen ${formatTimeAgo(participant.lastSeen)}`
              : "Offline"}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          {/* <IconButton size="small">
            <PhoneIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <VideocamIcon fontSize="small" />
          </IconButton> */}
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;
