// components/Chat/TypingIndicator.tsx
import { Box, Paper, Avatar } from '@mui/material';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';

export const TypingIndicator = () => {
  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        my: 2,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2
      }}
    >
      <Avatar sx={{ bgcolor: 'primary.light' }}>
        <SmartToyOutlinedIcon />
      </Avatar>
      
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: '4px 16px 16px 16px'
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {[0.2, 0.4, 0.6].map((delay) => (
            <Box
              key={delay}
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'text.secondary',
                animation: 'bounce 1.4s infinite ease-in-out',
                animationDelay: `${delay}s`,
                '@keyframes bounce': {
                  '0%, 60%, 100%': { transform: 'translateY(0)' },
                  '30%': { transform: 'translateY(-5px)' }
                }
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};