import React from 'react';
import { Chip } from '@mui/material';
import { SxProps, Theme, alpha } from '@mui/material/styles';

const badgeStyles: Record<string, SxProps<Theme>> = {
  // User Type styles
  admin: {
    bgcolor: (theme) => alpha(theme.palette.primary.light, 0.7),
    color: 'text.primary',
  },
  user: {
    bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.7),
    color: 'text.primary',
  },
  // Role styles
  manager: {
    bgcolor: (theme) => alpha(theme.palette.info.light, 0.7),
    color: 'text.primary',
  },
  hr: {
    bgcolor: (theme) => alpha(theme.palette.warning.light, 0.7),
    color: 'text.primary',
  },
  // Status styles
  pending: {
    bgcolor: (theme) => alpha(theme.palette.warning.light, 0.7),
    color: 'text.primary',
  },
  registered: {
    bgcolor: (theme) => alpha(theme.palette.success.light, 0.7),
    color: 'text.primary',
  },
  rejected: {
    bgcolor: (theme) => alpha(theme.palette.error.light, 0.7),
    color: 'text.primary',
  },
};

interface StatusBadgeProps {
  type: 'userType' | 'role' | 'status';
  value: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getLabel = () => {
    if (type === 'userType') {
      return value === 'admin' ? 'Admin' : 'User';
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <Chip
      label={getLabel()}
      size="small"
      sx={{
        ...badgeStyles[value],
        fontSize: '0.85rem',
        height: 24,
        borderRadius: 12,
        minWidth: 60,
      }}
    />
  );
};