// components/Chat/ChatInput.tsx
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  // Typography,
} from "@mui/material";
import { Send, AttachFile, AutoFixHigh } from "@mui/icons-material";
import React, { useState, KeyboardEvent } from "react";
import { FilePreview } from "./FilePreview";

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  attachments: File[];
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
  onOpenAttachmentModal: () => void;
}

export const ChatInput = ({
  onSend,
  attachments,
  setAttachments,
  onOpenAttachmentModal,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSend(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* File preview row */}
      {attachments.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 1,
            mb: 1,
            "&::-webkit-scrollbar": {
              height: "4px",
            },
          }}
        >
          {attachments.map((file, index) => (
            <FilePreview
              key={`${file.name}-${index}`}
              file={file}
              onRemove={() => removeAttachment(index)}
            />
          ))}
        </Box>
      )}

      {/* Input field */}
      <TextField
        fullWidth
        multiline
        maxRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the AI anything..."
        InputProps={{
          sx: { borderRadius: 6, bgcolor: "background.paper", px: 3, py: 2},
          startAdornment: (
            <InputAdornment position="start">
              <IconButton edge="start" onClick={onOpenAttachmentModal}>
                <AttachFile />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" sx={{mr: 0.5}}>
                <AutoFixHigh />
              </IconButton>
              <IconButton
                edge="end"
                color="primary"
                disabled={!message.trim() && attachments.length === 0}
                onClick={handleSend}
              >
                <Send />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={1}
        color="text.secondary"
      >
        Press Enter to send, Shift+Enter for new line
      </Typography> */}
    </Box>
  );
};
