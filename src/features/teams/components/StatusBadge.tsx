import React from 'react';
import { Chip } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

const badgeStyles: Record<string, SxProps<Theme>> = {
  // User Type styles
  admin: {
    bgcolor: 'primary.light',
    color: 'primary.dark',
  },
  user: {
    bgcolor: 'grey.100',
    color: 'grey.800',
  },
  // Role styles
  manager: {
    bgcolor: 'info.light',
    color: 'info.dark',
  },
  hr: {
    bgcolor: 'warning.light',
    color: 'warning.dark',
  },
  // Status styles
  pending: {
    bgcolor: 'warning.light',
    color: 'warning.dark',
  },
  registered: {
    bgcolor: 'success.light',
    color: 'success.dark',
  },
  rejected: {
    bgcolor: 'error.light',
    color: 'error.dark',
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
        fontSize: '0.75rem',
        height: 24,
      }}
    />
  );
};