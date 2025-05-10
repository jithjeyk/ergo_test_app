import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TeamMembersHeaderProps {
  onAddMember: () => void;
}

export const TeamMembersHeader: React.FC<TeamMembersHeaderProps> = ({ onAddMember }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold">
          Team Members
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage all your team members in one place
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddMember}
      >
        Add Member
      </Button>
    </Box>
  );
};