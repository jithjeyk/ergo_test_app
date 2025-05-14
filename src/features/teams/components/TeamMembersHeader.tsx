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
        pb: 3
      }}
    >
      <Box>
        <Typography variant="h4">
          Team Members
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
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