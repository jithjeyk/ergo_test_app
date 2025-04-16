import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  LinearProgress, 
  styled 
} from '@mui/material';

interface LoadingProps {
  variant?: 'circular' | 'linear' | 'fullscreen';
  message?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  size?: number;
}

const FullScreenContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  zIndex: theme.zIndex.modal + 1,
}));

const Loading: React.FC<LoadingProps> = ({
  variant = 'circular',
  message = 'Loading...',
  color = 'primary',
  size = 40
}) => {
  switch (variant) {
    case 'circular':
      return (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center"
          gap={2}
        >
          <CircularProgress color={color} size={size} />
          {message && (
            <Typography variant="body2" color="textSecondary">
              {message}
            </Typography>
          )}
        </Box>
      );
    
    case 'linear':
      return (
        <Box sx={{ width: '100%' }}>
          <LinearProgress color={color} />
          {message && (
            <Typography 
              variant="body2" 
              color="textSecondary" 
              align="center" 
              sx={{ mt: 1 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      );
    
    case 'fullscreen':
      return (
        <FullScreenContainer>
          <CircularProgress color={color} size={size} />
          {message && (
            <Typography 
              variant="h6" 
              color="textSecondary" 
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </FullScreenContainer>
      );
  }
};

export default Loading;

//Example Usage:
// Circular Loading (default)
{/* <Loading />

// With custom message
<Loading message="Preparing your dashboard..." />

// Linear Loading
<Loading variant="linear" message="Syncing data..." />

// Fullscreen Loading
<Loading 
  variant="fullscreen" 
  message="Please wait while we initialize..." 
  color="secondary"
/> */}