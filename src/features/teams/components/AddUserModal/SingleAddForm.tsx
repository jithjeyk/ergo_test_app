import React from 'react';
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Button,
  Box
} from '@mui/material';
import { AddUserFormData } from '../../../../types/teamMembers';

interface SingleAddFormProps {
  onChange: (data: AddUserFormData) => void;
}

export const SingleAddForm: React.FC<SingleAddFormProps> = ({ onChange }) => {
  const [formData, setFormData] = React.useState<AddUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    phone: '',
    userType: 'user',
    role: 'developer',
    status: 'pending'
  });

  const handleChange = (field: keyof AddUserFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange(newData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Position"
          value={formData.position}
          onChange={(e) => handleChange('position', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>User Type</InputLabel>
          <Select
            value={formData.userType}
            label="User Type"
            onChange={(e) => handleChange('userType', e.target.value as string)}
          >
            <MenuItem value="user">Standard User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={formData.role}
            label="Role"
            onChange={(e) => handleChange('role', e.target.value as string)}
          >
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="account">Account</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={(e) => handleChange('status', e.target.value as string)}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="registered">Registered</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" alignItems="center">
          <Avatar sx={{ width: 56, height: 56 }} />
          <Button sx={{ ml: 2 }} variant="outlined">
            Upload Photo
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};