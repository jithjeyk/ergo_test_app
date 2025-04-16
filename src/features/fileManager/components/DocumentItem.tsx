import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Document } from '../../../types/types'; // Adjust path
import { getIconForItem } from '../utils/getIconForItem'; // Adjust path

interface DocumentItemProps {
  document: Document;
  onDocumentClick: (document: Document) => void;
  onMoreClick?: (event: React.MouseEvent, document: Document) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDocumentClick, onMoreClick }) => {
  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoreClick) {
      onMoreClick(e, document);
    }
  };

  return (
    <ListItem 
      disablePadding
      secondaryAction={
        <IconButton edge="end" aria-label="more" onClick={handleMoreClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      }
    >
      <ListItemButton onClick={() => onDocumentClick(document)}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          {/* {getIconForItem(document)} */}
        </ListItemIcon>
        <ListItemText
          primary={document.name}
          secondary={document.size || document.time}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default DocumentItem;