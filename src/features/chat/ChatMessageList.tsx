// src/components/chat/ChatMessageList.tsx
import React from 'react';
import { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';
import { Box, Typography, Chip, Stack } from '@mui/material';

interface ChatMessageListProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUserId }) => {
  // Group messages by date for date separators
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    console.log("messages", messages);
    
    msgs.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate(messages);
  
  return (
    <Stack spacing={3}>
      {Object.entries(messageGroups).map(([date, msgs]) => (
        <Box key={date}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Chip 
              label={date}
              size="small"
              variant="outlined"
              sx={{ 
              bgcolor: 'background.darker', 
              color: 'text.primary',
              fontSize: '0.75rem',
              height: 24
              }}
            />
            </Box>
          
          <Stack spacing={1.5}>
            {msgs.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                isOutgoing={message.senderId === currentUserId}
              />
            ))}
          </Stack>
        </Box>
      ))}
      
      {messages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No messages yet. Start the conversation!
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default ChatMessageList;