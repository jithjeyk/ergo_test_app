import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  LinearProgress,
  Typography
} from '@mui/material';
import { TeamMember } from '../../../types/teamMembers';
import { TeamTableRow } from './TeamTableRow';

interface TeamTableProps {
  members: TeamMember[];
  loading: boolean;
  onRowClick: (member: TeamMember) => void;
}

export const TeamTable: React.FC<TeamTableProps> = ({ members, loading, onRowClick }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      {loading && <LinearProgress />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Full Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>User Type</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.length > 0 ? (
            members.map((member) => (
              <TeamTableRow 
                key={member.id} 
                member={member} 
                onRowClick={onRowClick} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Typography variant="body2" color="textSecondary">
                  {loading ? 'Loading...' : 'No team members found'}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};