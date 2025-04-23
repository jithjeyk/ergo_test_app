import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import ChatLayout from "./ChatLayout";
// import IconButton from "@mui/material/IconButton";
// import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../../context/AuthContext";

import "./chatStyle.css";

interface SidebarChatProps {
  open: boolean;
  onDrawerClose?: () => void;
}

const SidebarChat: React.FC<SidebarChatProps> = ({ open, onDrawerClose }) => {
  const { user } = useContext(AuthContext);
  // Prevent body scrolling when chat is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Overlay background when chat is open */}
      {open && <div className="chat-overlay" onClick={onDrawerClose} />}

      {/* Chat sidebar using the CSS classes */}
      <Box
        sx={{
          bgcolor: "background.default", // Use theme background color
        }}
        className={`chat-sidebar ${open ? "shown" : ""}`}
      >
        {open && (
          <>
            {/* <Box className="chat-header">
              <IconButton
                className="chat-close-btn"
                onClick={onDrawerClose}
                aria-label="Close chat"
              >
                <CloseIcon />
              </IconButton>
            </Box> */}

            <Box sx={{ mt: 6 }}>
              <ChatLayout currentUser={user} />
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default SidebarChat;
