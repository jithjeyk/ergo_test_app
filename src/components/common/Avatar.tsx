// src/components/common/Avatar.tsx
import React from 'react';
import { Box, Badge, Avatar as MuiAvatar } from '@mui/material';
import { styled } from '@mui/material/styles';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'busy' | 'offline';
}

// Custom styled badge for status indicators
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    minWidth: 'auto',
    height: 'auto',
    borderRadius: '50%',
    padding: 0
  },
}));

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt, 
  size = 'md',
  status 
}) => {
  // Size mapping in pixels
  const sizeMapping = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  };
  
  // Status color mapping
  const statusColors = {
    online: 'success.main',
    away: 'warning.main',
    busy: 'error.main',
    offline: 'text.disabled'
  };
  
  // Status dot size based on avatar size
  const getStatusSize = () => {
    switch (size) {
      case 'xs': return 6;
      case 'sm': return 8;
      case 'md': return 10;
      case 'lg': return 12;
      case 'xl': return 14;
      default: return 8;
    }
  };
  
  // Render avatar with status if provided
  if (status) {
    return (
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Box 
            sx={{
              width: getStatusSize(),
              height: getStatusSize(),
              borderRadius: '50%',
              bgcolor: statusColors[status] || 'grey.400',
            }}
          />
        }
      >
        <MuiAvatar
          src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`}
          alt={alt}
          sx={{ 
            width: sizeMapping[size],
            height: sizeMapping[size]
          }}
        />
      </StyledBadge>
    );
  }
  
  // Render avatar without status
  return (
    <MuiAvatar
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random`}
      alt={alt}
      sx={{ 
        width: sizeMapping[size],
        height: sizeMapping[size]
      }}
    />
  );
};

export default Avatar;