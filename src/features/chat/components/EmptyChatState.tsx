// src/components/chat/EmptyChatState.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const EmptyChatState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        bgcolor: 'grey.50',
        textAlign: 'center',
        p: 3,
      }}
    >
      <ChatBubbleOutlineIcon 
        sx={{ 
          fontSize: 80, 
          color: 'text.disabled',
          mb: 2
        }} 
      />
      <Typography variant="h5" fontWeight="medium" color="text.primary" gutterBottom>
        No conversation selected
      </Typography>
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ maxWidth: 'md' }}
      >
        Select a conversation from the sidebar or start a new one to begin chatting.
      </Typography>
    </Box>
  );
};

export default EmptyChatState;