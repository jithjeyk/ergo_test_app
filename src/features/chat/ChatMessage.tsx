// src/components/chat/ChatMessage.tsx
import React from 'react';
import { Message } from '../../types/chat';
import { formatTime } from '../../utils/dateUtils';
import { Box, Typography, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ChatMessageProps {
  message: Message;
  isOutgoing: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOutgoing }) => {
  // Determine message status icon
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <AccessTimeIcon fontSize="inherit" />;
      case 'sent':
        return <DoneIcon fontSize="inherit" />;
      case 'delivered':
        return <DoneAllIcon fontSize="inherit" color="inherit" />;
      case 'read':
        return <DoneAllIcon fontSize="inherit" color="primary" />;
      case 'failed':
        return <ErrorOutlineIcon fontSize="inherit" color="error" />;
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ display: 'flex', justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
      <Box
        sx={{
          maxWidth: { xs: '80%', md: '60%' },
          borderRadius: 2,
          py: 1.5,
          px: 2,
          bgcolor: isOutgoing ? 'background.darker' : 'background.paper',
          color: 'text.primary',
          border: isOutgoing ? 'none' : 1,
          borderColor: 'divider',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
      >
        <Typography variant="body2">{message.content}</Typography>
        <Stack 
          direction="row" 
          spacing={0.5} 
          alignItems="center" 
          justifyContent={isOutgoing ? 'flex-end' : 'flex-start'}
          sx={{ 
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'text.secondary'
          }}
        >
          <Typography variant="caption">
            {formatTime(message.timestamp)}
          </Typography>
          {isOutgoing && (
            <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', lineHeight: 1 }}>
              {getStatusIcon()}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatMessage;