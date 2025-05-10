// components/Chat/ChatInput.tsx
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Send, AttachFile, AutoFixHigh } from "@mui/icons-material";
import { useState, useRef, KeyboardEvent } from "react";
import { FilePreview } from "./FilePreview";
import { AttachmentModal } from "./AttachmentModal";

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
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
          sx: { borderRadius: 6, bgcolor: "background.paper" },
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                edge="start"
                onClick={() => setAttachmentModalOpen(true)}
              >
                <AttachFile />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end">
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

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        mt={1}
        color="text.secondary"
      >
        AI Assistant may produce inaccurate information. Consider verifying
        important information.
      </Typography>

      <AttachmentModal
        open={attachmentModalOpen}
        onClose={() => setAttachmentModalOpen(false)}
        onFilesSelected={handleFileSelect}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        multiple
        onChange={(e) =>
          e.target.files && handleFileSelect(Array.from(e.target.files))
        }
      />
    </Box>
  );
};
