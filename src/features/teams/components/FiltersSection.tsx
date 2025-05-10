import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Paper
} from '@mui/material';
import { TeamMembersFilters } from '../../../types/teamMembers';

interface FiltersSectionProps {
  filters: TeamMembersFilters;
  onFilterChange: (name: keyof TeamMembersFilters, value: string) => void;
  onSearch: (searchTerm: string) => void;
  onReset: () => void;
}

export const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset
}) => {
  return (
    <Paper sx={{ p: 3, mb: 3 }} variant="outlined">
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            placeholder="Name, email..."
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => onFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="registered">Registered</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => onFilterChange('role', e.target.value)}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="account">Account</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select
              value={filters.userType}
              label="User Type"
              onChange={(e) => onFilterChange('userType', e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">Standard User</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button variant="outlined" onClick={onReset}>
          Reset
        </Button>
        <Button variant="contained">
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};