// src/components/chat/ChatInput.tsx
import React, { KeyboardEvent } from 'react';
import { 
  Box, 
  IconButton, 
  InputBase, 
  Paper, 
  Fab,
  styled
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

// Custom styled textarea component
const StyledTextarea = styled(InputBase)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 2),
  maxHeight: '120px',
  overflowY: 'auto',
  fontSize: '1rem',
  lineHeight: '1.5',
  '& .MuiInputBase-input': {
    padding: 0,
    height: 'auto',
    maxHeight: '120px',
    overflow: 'auto',
    '&::placeholder': {
      opacity: 0.7,
    },
  },
}));

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend }) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  const isMessageEmpty = !value.trim();
  
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <IconButton 
          size="small" 
          sx={{ p: 1.5, color: 'action.active' }}
        >
          <AttachFileIcon fontSize="small" />
        </IconButton>
        
        <StyledTextarea
          multiline
          maxRows={4}
          placeholder="Your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flexGrow: 1 }}
        />
        
        <Fab
          color="primary"
          size="small"
          disabled={isMessageEmpty}
          onClick={onSend}
          sx={{ 
            m: 1,
            boxShadow: 'none',
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            }
          }}
        >
          <SendIcon fontSize="small" />
        </Fab>
      </Paper>
    </Box>
  );
};

export default ChatInput;