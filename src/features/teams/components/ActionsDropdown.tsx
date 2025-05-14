import React from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon
} from '@mui/icons-material';

interface ActionsDropdownProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs?: () => void;
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  anchorEl,
  open,
  onClose,
  onViewDetails,
  onEdit,
  onDelete,
  onViewLogs
}) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        elevation: 3,
        sx: {
          mt: 1,
          minWidth: 180,
          borderRadius: 1,
          overflow: 'visible',
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
    >
      <MenuItem onClick={() => handleAction(onViewDetails)}>
        <ListItemIcon>
          <ViewIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>View Details</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => handleAction(onEdit)}>
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Edit</ListItemText>
      </MenuItem>
      <Box sx={{
        '& .MuiMenuItem-root': {
          '&:hover': {
            backgroundColor: 'error.light',
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
              color: 'error.contrastText',
            },
          },
        },
      }}>
        <MenuItem onClick={() => handleAction(onDelete)}>
          <ListItemIcon>
            <DeleteIcon fontSize="small"/>
          </ListItemIcon>
          <ListItemText>
            Delete
          </ListItemText>
        </MenuItem>
      </Box>
      {onViewLogs && (
        <MenuItem onClick={() => handleAction(onViewLogs)}>
          <ListItemIcon>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Logs</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};