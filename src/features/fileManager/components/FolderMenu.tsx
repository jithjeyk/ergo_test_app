import React, { useState } from 'react';
import {
  Menu, MenuItem, ListItemIcon, ListItemText, Divider, Popover, Box, Typography
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
// import SummarizeIcon from '@mui/icons-material/Summarize'; // Remove Summarize for now unless needed
import ShareIcon from '@mui/icons-material/Share';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'; // For Move To
import FolderIcon from '@mui/icons-material/Folder';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
// import KeyboardAltOutlinedIcon from '@mui/icons-material/KeyboardAltOutlined'; // Remove Shortcut for now
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'; // Remove Report Suggestion

// *** Import types from src-new ***
import { Folder } from '../../../types/document'; // Adjust path
import { folderColors } from './FolderGrid'; // Assuming FolderGrid defines/exports this

import { useTranslation } from 'react-i18next';

interface FolderMenuProps {
  anchorEl: HTMLElement | null;
  folder: Folder | null; // Use Folder
  open: boolean;
  onClose: () => void;
  // --- Updated Actions ---
  onRename: (item: Folder) => void; // Pass item back
  onMove: (item: Folder) => void; // Add Move action
  onDelete: (item: Folder) => void; // Pass item back
  onDownload?: (item: Folder) => void; // Optional for now
  onShare?: (item: Folder) => void; // Optional for now
  onToggleStar?: (item: Folder) => void; // Optional for now
  onGetInfo?: (item: Folder) => void; // Optional for now
  onColorChange?: (item: Folder, color: string) => void; // Optional for now
}

const FolderMenu: React.FC<FolderMenuProps> = ({
  anchorEl,
  folder,
  open,
  onClose,
  onRename,
  onMove, // Add handler
  onDelete, // Add handler
  onDownload,
  onShare,
  onToggleStar,
  onGetInfo,
  onColorChange,
}) => {
  const [colorPopoverAnchor, setColorPopoverAnchor] = useState<HTMLElement | null>(null);

  if (!folder) return null;

  const { t } = useTranslation(); // Translation hook

  const handleRenameClick = () => {
    onRename(folder);
    onClose();
  };

  const handleMoveClick = () => {
    onMove(folder); // Trigger move handler (likely opens a move dialog)
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(folder);
    onClose();
  };

  const handleDownloadClick = () => {
    onDownload?.(folder);
    onClose();
  };

  const handleShareClick = () => {
    onShare?.(folder);
    onClose();
  }

  const handleToggleStarClick = () => {
    onToggleStar?.(folder);
    onClose();
  }

  const handleGetInfoClick = () => {
     onGetInfo?.(folder);
     onClose();
  }

  const handleColorSelect = (color: string) => {
    onColorChange?.(folder, color);
    setColorPopoverAnchor(null);
    onClose();
  };

  const handleOpenColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setColorPopoverAnchor(event.currentTarget);
    // Keep main menu open? Or close it? Closing for simplicity.
    // onClose(); // Optional: close main menu when color picker opens
  };

  const handleCloseColorPicker = () => {
    setColorPopoverAnchor(null);
     // Need to close main menu too if it wasn't closed before
    onClose();
  };

  const colorPopoverOpen = Boolean(colorPopoverAnchor);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={open && !colorPopoverOpen} // Keep main menu closed if color picker is open
        onClose={onClose}
        PaperProps={{ elevation: 3, sx: { width: 280, maxWidth: '100%', mt: 1 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* Add more actions as needed */}
         <MenuItem onClick={handleShareClick} disabled={!onShare}>
          <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{t("fileManager.share")}</ListItemText>
        </MenuItem>
         <MenuItem onClick={handleRenameClick}>
          <ListItemIcon><DriveFileRenameOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{t("fileManager.rename")}</ListItemText>
        </MenuItem>
         <MenuItem onClick={handleMoveClick}>
            <ListItemIcon><CreateNewFolderIcon fontSize="small" /></ListItemIcon> {/* Using CreateNewFolder as move icon */}
            <ListItemText>{t("fileManager.moveTo")}</ListItemText>
        </MenuItem>
         <MenuItem onClick={handleToggleStarClick} disabled={!onToggleStar}>
            <ListItemIcon><StarBorderIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{folder.isStarred ? t("fileManager.removeFromStarred"): t("fileManager.addToStarred")}</ListItemText>
        </MenuItem>
         <MenuItem onClick={handleOpenColorPicker} disabled={!onColorChange}>
            <ListItemIcon><FolderIcon fontSize="small" sx={{ color: folder.color || 'inherit' }} /></ListItemIcon>
            <ListItemText>{t("fileManager.folderColor")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleGetInfoClick} disabled={!onGetInfo}>
            <ListItemIcon><InfoOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{t("fileManager.folderInformation")}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDownloadClick} disabled={!onDownload}>
          <ListItemIcon><FileDownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{t("common.download")}</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'inherit' }}><DeleteOutlineIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{t("fileManager.moveToTrash")}</ListItemText>
        </MenuItem>
      </Menu>

      {/* Color Picker Popover */}
      <Popover
        open={colorPopoverOpen}
        anchorEl={colorPopoverAnchor}
        onClose={handleCloseColorPicker}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Folder color</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 1 }}>
            {folderColors.map((color, index) => (
              <Box
                key={index}
                onClick={() => handleColorSelect(color)}
                sx={{ /* (Existing styles) */
                    width: 24, height: 24, backgroundColor: color, borderRadius: '50%', cursor: 'pointer',
                    border: folder?.color === color ? '2px solid #1a73e8' : 'none', // Use folder?.color
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    '&:hover': { boxShadow: '0 0 0 2px rgba(26, 115, 232, 0.5)' }
                }}
              >
                 {folder?.color === color && <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fff' }}/>}
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default FolderMenu;