import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { SingleAddForm } from './SingleAddForm';
import { BulkImportForm } from './BulkImportForm';
import { ApiImportForm } from './ApiImportForm';
import { AddUserMethod } from '../../../../types/teamMembers';

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (method: AddUserMethod, data: any) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ 
  open, 
  onClose, 
  onSubmit 
}) => {
  const [activeMethod, setActiveMethod] = useState<AddUserMethod>('single');
  const [formData, setFormData] = useState<any>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: AddUserMethod) => {
    setActiveMethod(newValue);
  };

  const handleFormSubmit = () => {
    onSubmit(activeMethod, formData);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>Add New Team Member</DialogTitle>
      
      <Tabs 
        value={activeMethod} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ px: 3 }}
      >
        <Tab label="Single Entry" value="single" />
        <Tab label="Bulk Import" value="bulk" />
        <Tab label="API Integration" value="api" />
      </Tabs>
      
      <Divider />
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {activeMethod === 'single' && (
            <SingleAddForm 
              onChange={(data) => setFormData(data)} 
            />
          )}
          {activeMethod === 'bulk' && (
            <BulkImportForm 
              onChange={(data) => setFormData(data)} 
            />
          )}
          {activeMethod === 'api' && (
            <ApiImportForm 
              onChange={(data) => setFormData(data)} 
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleFormSubmit}
          disabled={!formData}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};