// components/UI/FilePreview.tsx
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { FileAttachment } from '../../../types/chat';

interface FilePreviewProps {
  file: File | FileAttachment;
  onRemove?: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  // Helper function to get display size
  const getDisplaySize = (file: File | FileAttachment) => {
    if (file instanceof File) {
      return `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }
    return file.size;
  };

  // Helper function to get file extension
  const getFileType = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : 'file';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        pr: 0.5,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        '&:hover': {
          boxShadow: 1,
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.2s ease',
        maxWidth: 200,
        minWidth: 120
      }}
    >
      <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
        <InsertDriveFileOutlinedIcon 
          type={getFileType(file.name)} 
          sx={{ fontSize: 20 }} 
        />
      </Box>
      
      <Box sx={{ minWidth: 0, mr: 1, overflow: 'hidden' }}>
        <Typography variant="body2" noWrap>
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {getDisplaySize(file)}
        </Typography>
      </Box>
      
      {onRemove && (
        <IconButton 
          size="small" 
          onClick={onRemove}
          aria-label="Remove file"
          sx={{ ml: 'auto' }}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </Paper>
  );
};