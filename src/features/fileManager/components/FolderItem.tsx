import React from 'react';
import { Box, Typography, IconButton, Card, CardContent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Folder } from '../../../types/types'; // Adjust path
import { getIconForItem } from '../utils/getIconForItem'; // Adjust path

interface FolderItemProps {
  folder: Folder;
  onFolderClick: (folder: Folder) => void;
  onMoreClick: (event: React.MouseEvent, folder: Folder) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ folder, onFolderClick, onMoreClick }) => {
  return (
    <Card 
      sx={{ 
        position: 'relative',
        cursor: 'pointer',
        height: '100%',
        borderLeft: `4px solid ${folder.iconColor || '#1976d2'}`
      }}
      onClick={() => onFolderClick(folder)}
    >
      <IconButton 
        size="small" 
        sx={{ position: 'absolute', top: 5, right: 5 }}
        onClick={(e) => onMoreClick(e, folder)}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      
      <CardContent sx={{ pt: 4, pb: 2, px: 2 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* {getIconForItem(folder)} */}
          <Typography variant="body2" align="center" sx={{ mt: 1, wordBreak: 'break-word' }}>
            {folder.name}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FolderItem;