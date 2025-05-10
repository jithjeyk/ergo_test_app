// src/components/chat/ChatHeader.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsMobile,
  selectShowChat,
  setShowChat,
  setCurrentConversation,
} from "../../../store/chatSlice"; // Ensure correct path
import { Conversation } from "../../../types/chat"; // Ensure correct path
import { User } from "../../../types/types"; // Ensure correct path
import Avatar from "../../../components/common/Avatar"; // Ensure correct path
import ChatHeaderMenu from "./ChatHeaderMenu"; // Ensure correct path
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Stack,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GroupIcon from "@mui/icons-material/Group"; // For group avatar fallback
import { formatTimeAgo } from "../../../utils/dateUtils"; // Ensure correct path
import MuiAvatar from "@mui/material/Avatar"; // Import MuiAvatar for placeholder GroupAvatar

interface ChatHeaderProps {
  conversation: Conversation | null;
  currentUser: User | null;
  onOpenGroupInfo: () => void; // Prop to open the info sidebar/dialog
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  currentUser,
  onOpenGroupInfo
}) => {
  // --- Hooks ---
  const dispatch = useDispatch();
  const isMobile = useSelector(selectIsMobile);
  const showChat = useSelector(selectShowChat); // To manage back button visibility on mobile

  // --- State ---
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  // --- Handlers ---
  const handleBackToList = () => {
    // Clear the current conversation when going back on mobile
    dispatch(setCurrentConversation(null));
    dispatch(setShowChat(false));
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  // --- Loading / Error State ---
  // Render a basic header if conversation or user data is missing
  if (!conversation || !currentUser) {
    return (
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 64 }}>
          {isMobile && showChat && (
            <IconButton onClick={handleBackToList} aria-label="Back">
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography sx={{ ml: isMobile && showChat ? 1 : 0 }}>
            Loading Chat...
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  // --- Derived Data for Display ---
  const isGroup = conversation.type === "group";
  let headerTitle = "";
  let headerSubtitle = "";
  let avatarSrc = "";
  let avatarStatus: "online" | undefined = undefined;

  if (isGroup) {
    headerTitle = conversation.name || "Unnamed Group";
    headerSubtitle = `${conversation.participants.length} members`;
    avatarSrc = conversation.avatar || "";
  } else {
    // Find the other participant in a one-to-one chat
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    if (otherParticipant) {
      headerTitle = otherParticipant.name;
      headerSubtitle = otherParticipant.isOnline
        ? "Online"
        : otherParticipant.lastSeen
        ? `Last seen ${formatTimeAgo(otherParticipant.lastSeen)}`
        : "Offline";
      avatarSrc = otherParticipant.avatar || "";
      avatarStatus = otherParticipant.isOnline ? "online" : undefined;
    } else {
      // Fallback if participant data is somehow missing (shouldn't happen ideally)
      headerTitle = "Chat";
      headerSubtitle = "Details unavailable";
    }
  }

  // --- Render ---
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 64, px: { xs: 1, sm: 2 } }}>
        {/* Mobile back button */}
        {isMobile && showChat && (
          <IconButton onClick={handleBackToList} aria-label="Back to conversations" sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Avatar Section */}
        {isGroup ? (
          // Use GroupAvatar component or fallback
          <GroupAvatar src={avatarSrc} alt={headerTitle} size="md" />
        ) : (
          <Avatar src={avatarSrc} alt={headerTitle} size="md" status={avatarStatus} />
        )}

        {/* Title and Subtitle Section */}
        <Box sx={{ ml: 1.5, flexGrow: 1, overflow: "hidden" }}>
          <Typography variant="subtitle1" fontWeight="medium" noWrap>
            {headerTitle}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {headerSubtitle}
          </Typography>
        </Box>

        {/* Action Icons Section */}
        <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
          {/* More Options Button */}
          <IconButton size="small" aria-label="More options" onClick={handleOpenMenu}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>

      {/* Header Menu Component */}
      <ChatHeaderMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        isGroup={isGroup} // Pass whether it's a group
        onOpenGroupInfo={onOpenGroupInfo} // Pass handler to open group info
        conversationId={conversation.id} // Pass conversation ID
        currentUser={currentUser} // Pass current user object
      />
    </AppBar>
  );
};

// Placeholder GroupAvatar component (replace with your actual implementation if needed)
const GroupAvatar: React.FC<{ src?: string; alt: string; size: "sm" | "md" | "lg"; }> = ({ src, alt, size }) => {
  const sizeMap = { sm: 32, md: 40, lg: 56 };
  return (
    <MuiAvatar src={src} alt={alt} sx={{ width: sizeMap[size], height: sizeMap[size] }}>
      {!src && <GroupIcon />} {/* Fallback icon */}
    </MuiAvatar>
  );
};

export default React.memo(ChatHeader);
