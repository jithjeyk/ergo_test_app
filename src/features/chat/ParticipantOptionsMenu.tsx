// src/components/chat/ParticipantOptionsMenu.tsx
import React from "react";
import { useDispatch } from "react-redux";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Participant, GroupMemberOperation } from "../../types/chat";
import { User } from "../../types/types";
import { UUID } from "../../types/document";
import { updateMemberRole, removeGroupMember } from "../../store/chatSlice";

interface ParticipantOptionsMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  targetParticipant: Participant | null;
  conversationId: UUID;
  currentUser: User;
  isCurrentUserAdmin: boolean;
  isCurrentUserOwner: boolean;
  isTargetOwner: boolean;
  participantCount: number; // To check for last owner
}

const ParticipantOptionsMenu: React.FC<ParticipantOptionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  targetParticipant,
  conversationId,
  currentUser,
  isCurrentUserAdmin,
  isCurrentUserOwner,
  isTargetOwner,
  participantCount
}) => {
  const dispatch = useDispatch();

  if (!targetParticipant) return null;

  const canMakeAdmin = isCurrentUserOwner && targetParticipant.role === 'member';
  const canDismissAdmin = isCurrentUserOwner && targetParticipant.role === 'admin';
  // Owners can remove anyone (except last owner). Admins can remove members.
  const canRemove = (isCurrentUserOwner && (!isTargetOwner || participantCount > 1)) ||
                    (isCurrentUserAdmin && targetParticipant.role === 'member');

  const handleUpdateRole = (role: 'admin' | 'member') => {
    const operation: GroupMemberOperation = {
        conversationId,
        userId: targetParticipant.id,
        role: role
    };
    dispatch(updateMemberRole({ operation, currentUser }));
    onClose();
  };

  const handleRemoveMember = () => {
     // Add confirmation dialog here in production
     const operation: GroupMemberOperation = {
         conversationId,
         userId: targetParticipant.id,
     };
     dispatch(removeGroupMember({ operation, currentUser }));
     onClose();
  };


  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ 'aria-labelledby': `participant-options-button-${targetParticipant.id}` }}
      PaperProps={{
         elevation: 1,
         sx: { minWidth: 180 },
      }}
    >
      {canMakeAdmin && (
        <MenuItem onClick={() => handleUpdateRole('admin')}>
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Admin</ListItemText>
        </MenuItem>
      )}
      {canDismissAdmin && (
        <MenuItem onClick={() => handleUpdateRole('member')}>
          <ListItemIcon>
            <RemoveCircleOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dismiss as Admin</ListItemText>
        </MenuItem>
      )}
      {canRemove && (
        <MenuItem onClick={handleRemoveMember} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <PersonRemoveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Remove</ListItemText>
        </MenuItem>
      )}
       {/* Show message if no actions available */}
       {!canMakeAdmin && !canDismissAdmin && !canRemove && (
           <MenuItem disabled>No actions available</MenuItem>
       )}
    </Menu>
  );
};

export default ParticipantOptionsMenu;