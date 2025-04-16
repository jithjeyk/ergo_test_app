import { Theme } from '@mui/material/styles';
import { CSSProperties } from 'react';

export const useStyles = () => {
  return {
    drawer: {
      width: 240,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: 240,
      transition: (theme: Theme) => theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: (theme: Theme): CSSProperties => ({
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: (theme: Theme) => theme.spacing(0, 1),
      ...((theme: Theme) => theme.mixins.toolbar),
      borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    },
    active: {
      backgroundColor: (theme: Theme) => 
        theme.palette.mode === 'dark' 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(66, 133, 244, 0.08)',
      '&:hover': {
        backgroundColor: (theme: Theme) => 
          theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.12)'
            : 'rgba(66, 133, 244, 0.12)',
      },
      '& .MuiListItemIcon-root': {
        color: (theme: Theme) => theme.palette.primary.main,
      },
      '& .MuiListItemText-primary': {
        color: (theme: Theme) => theme.palette.primary.main,
        fontWeight: 600,
      },
    },
    listItem: {
      borderRadius: (theme: Theme) => theme.shape.borderRadius,
      '&:hover': {
        backgroundColor: (theme: Theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.04)',
      },
    },
    listItemIcon: {
      minWidth: 40,
      color: 'inherit',
    },
  };
};