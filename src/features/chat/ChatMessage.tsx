// src/components/chat/ChatMessage.tsx
import React from "react";
import { Message, Participant } from "../../types/chat"; // Import Participant
import { formatTime } from "../../utils/dateUtils"; // Ensure correct path
import { Box, Typography, Stack, Tooltip } from "@mui/material"; // Added Tooltip
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon for delivered
// import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon for read

interface ChatMessageProps {
  message: Message;
  isOutgoing: boolean;
  sender: Participant | undefined; // Add sender prop
  conversationType: "one-to-one" | "group"; // Add conversation type
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOutgoing,
  sender,
  conversationType,
}) => {
  // Improved status icons using theme colors better
  const getStatusIcon = () => {
    let icon = null;
    let title = "";
    let color: "inherit" | "primary" | "disabled" | "error" = "inherit";

    switch (message.status) {
      case "sending":
        icon = <AccessTimeIcon fontSize="inherit" />;
        title = "Sending...";
        color = "disabled";
        break;
      case "sent":
        icon = <DoneIcon fontSize="inherit" />; // Single tick for sent
        title = "Sent";
        color = "inherit"; // Use secondary text color often
        break;
      case "delivered":
        // Using DoneAllIcon for delivered, could use a different one
        icon = <DoneAllIcon fontSize="inherit" />;
        title = "Delivered";
        color = "inherit"; // Use secondary text color often
        break;
      case "read":
        icon = <DoneAllIcon fontSize="inherit" />; // Using DoneAllIcon for read
        title = "Read";
        color = "primary"; // Use primary theme color for read
        break;
      case "failed":
        icon = <ErrorOutlineIcon fontSize="inherit" />;
        title = "Failed to send";
        color = "error";
        break;
      default:
        return null;
    }
    // Wrap icon in Tooltip for accessibility and info
    return (
      <Tooltip title={title} placement="top" arrow>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "inherit",
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Tooltip>
    );
  };

  const showSenderName = !isOutgoing && conversationType === "group" && sender;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOutgoing ? "flex-end" : "flex-start",
        // Optional: Add margin bottom if Stack spacing isn't enough
        // mb: 1,
      }}
    >
      {/* Optional: Add Avatar for incoming messages */}
      {/* {!isOutgoing && sender && (
           <Avatar src={sender.avatar} alt={sender.name} size="sm" sx={{ mr: 1, alignSelf: 'flex-end' }}/>
        )} */}

      {/* Message Bubble */}
      <Box
        sx={{
          maxWidth: { xs: "80%", md: "60%" },
          borderRadius: 2,
          py: 1.5,
          px: 2,
          bgcolor: isOutgoing ? "background.darker" : "background.paper",
          color: "text.primary",
          border: isOutgoing ? "none" : 1,
          borderColor: "divider",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {/* Display sender name for incoming group messages */}
        {showSenderName && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              mb: 0.5, // Margin below name
              ml: '4px', // Align with message padding
            }}
          >
            {sender?.name}
          </Typography>
        )}
        {/* Message Content */}
        <Typography variant="body2" component="div">
          {" "}
          {/* Use div for block display */}
          {message.content}
        </Typography>

        {/* Timestamp and Status */}
        <Stack
          direction="row" 
          spacing={0.5} 
          alignItems="center" 
          justifyContent='flex-end'
          sx={{ 
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}
        >
          <Typography variant="caption" component="span">
            {" "}
            {/* Use span */}
            {formatTime(message.timestamp)}
          </Typography>
          {isOutgoing && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "inherit",
                lineHeight: 1,
              }}
            >
              {getStatusIcon()}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatMessage;
