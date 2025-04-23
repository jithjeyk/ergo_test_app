// src/components/chat/ChatHeader.tsx
import React from "react";
import { useSelector } from "react-redux";
import { selectChatState } from "../../store/chatSlice";
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

interface ChatHeaderProps {
  conversationId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversationId }) => {
  const { conversations } = useSelector(selectChatState);
  const conversation = conversations[conversationId];

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
              ? `Last seen ${participant.lastSeen}`
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
