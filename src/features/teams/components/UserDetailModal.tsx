import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Box,
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid
} from '@mui/material';
import { TeamMember } from '../../../types/teamMembers';
import { StatusBadge } from './StatusBadge';

interface UserDetailModalProps {
  member: TeamMember | null;
  open: boolean;
  onClose: () => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  member,
  open,
  onClose,
  onEdit,
//   onDelete
}) => {
  if (!member) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
          <Box flexShrink={0}>
            <Avatar
              src={member.avatarUrl}
              sx={{ width: 120, height: 120 }}
            />
          </Box>
          <Box flexGrow={1}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {member.firstName} {member.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.position}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <StatusBadge type="userType" value={member.userType} />
                <StatusBadge type="status" value={member.status} />
              </Box>
            </Box>

            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography>{member.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography>{member.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Role
                </Typography>
                <Box>
                  <StatusBadge type="role" value={member.role} />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography>{member.department || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Additional Information
        </Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Employee ID
            </Typography>
            <Typography>EMP-{member.id.padStart(4, '0')}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Hire Date
            </Typography>
            <Typography>{member.hireDate || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Location
            </Typography>
            <Typography>New York Office</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="caption" color="text.secondary">
              Last Active
            </Typography>
            <Typography>{member.lastActive || 'N/A'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          Permissions
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Project Management"
              secondary="Create, edit and delete projects"
            />
            <Chip label="Full Access" color="success" size="small" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Team Management"
              secondary="Add or remove team members"
            />
            <Chip label="Full Access" color="success" size="small" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Financial Data"
              secondary="View and edit financial information"
            />
            <Chip label="View Only" color="warning" size="small" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="HR Records"
              secondary="Access to sensitive HR data"
            />
            <Chip label="No Access" color="error" size="small" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => onEdit(member)}
        >
          Edit Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};