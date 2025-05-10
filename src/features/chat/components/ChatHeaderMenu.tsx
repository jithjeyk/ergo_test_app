// src/components/chat/ChatHeaderMenu.tsx
import React from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import {
  Menu,
  MenuItem,
  // Box,
  // Typography,
  Divider
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { leaveGroupChat } from "../../../store/chatSlice"; // Import leaveGroupChat action
import { User } from "../../../types/types"; // Import User type
import { UUID } from "../../../types/document"; // Import UUID type

interface ChatHeaderMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  isGroup: boolean;
  onOpenGroupInfo?: () => void;
  conversationId: UUID | null; // Add conversationId
  currentUser: User | null; // Add currentUser
}

const ChatHeaderMenu: React.FC<ChatHeaderMenuProps> = ({
  anchorEl,
  open,
  onClose,
  isGroup,
  onOpenGroupInfo,
  conversationId, // Destructure props
  currentUser, // Destructure props
}) => {
  const dispatch = useDispatch();

  const handleGroupInfo = () => {
    if (onOpenGroupInfo) {
      onOpenGroupInfo();
    }
    onClose();
  };

  const handleExitGroup = () => {
    if (isGroup && conversationId && currentUser) {
      // Confirmation dialog is recommended here in a real app
      dispatch(leaveGroupChat({ conversationId, currentUser }));
    }
    onClose();
  };

  // --- Placeholder Handlers for other actions ---
  const handleSelectMessages = () => onClose();
  const handleMute = () => onClose();
  const handleDisappearing = () => onClose();
  const handleAddToFavourites = () => onClose();
  const handleCloseChat = () => onClose(); // Note: Closing might mean clearing currentConversationId
  const handleClearChat = () => onClose(); // Needs implementation (clear messages)


  return (
    <Menu
      id="chat-header-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      // Removed onClick={onClose} from Menu itself
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
          mt: 1.5,
          width: 240, // Slightly wider for clarity
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.2, // Adjust padding
            fontSize: '0.9rem', // Slightly larger text
             '& .MuiSvgIcon-root': { // Style icons in menu items
               mr: 1.5,
               color: 'text.secondary',
               fontSize: '1.25rem' // Slightly larger icons
            }
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {/* Group Specific Option */}
      {isGroup && (
        <MenuItem onClick={handleGroupInfo}>
          <InfoOutlinedIcon fontSize="small" />
          Group info
        </MenuItem>
      )}
       {/* Add Person Specific Option ? */}
       {/* {!isGroup && (
        <MenuItem onClick={handleViewContact}>
          <PersonOutlineIcon fontSize="small" />
          View contact
        </MenuItem>
       )} */}

      <MenuItem onClick={handleSelectMessages}>
        <CheckBoxOutlinedIcon fontSize="small" />
        Select messages
      </MenuItem>

      <MenuItem onClick={handleMute}>
        <NotificationsOffOutlinedIcon fontSize="small" />
        Mute notifications
      </MenuItem>

      <MenuItem onClick={handleDisappearing}>
        <TimerOutlinedIcon fontSize="small" />
        Disappearing messages
      </MenuItem>

      <MenuItem onClick={handleAddToFavourites}>
        <FavoriteBorderOutlinedIcon fontSize="small" />
        Add to favourites
      </MenuItem>

      <Divider sx={{ my: 0.5 }} /> {/* Reduced Divider margin */}

      <MenuItem onClick={handleCloseChat}>
        <CloseOutlinedIcon fontSize="small" />
        Close chat
      </MenuItem>

      <MenuItem onClick={handleClearChat}>
        <DeleteOutlineOutlinedIcon fontSize="small" />
        Clear chat
      </MenuItem>

      {/* Group Specific Exit Option */}
      {isGroup && (
        <MenuItem onClick={handleExitGroup} sx={{ color: 'error.main' }}> {/* Style exit option */}
            <LogoutOutlinedIcon fontSize="small" />
            Exit group
        </MenuItem>
      )}
       {/* Person Specific Block Option ? */}
       {/* {!isGroup && (
         <MenuItem onClick={handleBlockContact} sx={{ color: 'error.main' }}>
            <BlockIcon fontSize="small" />
            Block contact
         </MenuItem>
       )} */}
    </Menu>
  );
};

export default ChatHeaderMenu;