import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  LinearProgress
} from '@mui/material';

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<boolean>; // Returns true on success
  parentId: string | null; // Just for context in title, maybe
}

const CreateFolderDialog: React.FC<CreateFolderDialogProps> = ({ open, onClose, onCreate, parentId }) => {
  console.log(parentId);
  
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
        setError('Folder name cannot be empty.');
        return;
    }
    setIsCreating(true);
    setError('');
    const success = await onCreate(name);
    setIsCreating(false);
    if (success) {
        handleClose();
    } else {
        // Error message should be set by the onCreate function via setError in useFileManager hook
        // Or pass setError down if needed. For now, we assume parent handles error display.
        setError('Failed to create folder. Please try again.'); // Generic fallback
    }
  };

  const handleClose = () => {
    if (isCreating) return; // Prevent closing while creating
    setName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
       {isCreating && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />}
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Folder Name"
          type="text"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isCreating}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isCreating}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isCreating || !name.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFolderDialog;
