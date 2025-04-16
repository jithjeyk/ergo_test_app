import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'; // For Move To
import ShareIcon from '@mui/icons-material/Share';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';

// *** Import types from src-new ***
import { File } from '../../../types/document'; // Adjust path

interface DocumentMenuProps {
  anchorEl: HTMLElement | null;
  document: File | null; // Use File
  open: boolean;
  onClose: () => void;
  // --- Updated Actions ---
  onRename: (item: File) => void; // Pass item back
  onMove: (item: File) => void; // Add Move action
  onDelete: (item: File) => void; // Pass item back
  onDownload?: (item: File) => void; // Optional for now
  onShare?: (item: File) => void; // Optional
  onToggleStar?: (item: File) => void; // Optional
  onGetInfo?: (item: File) => void; // Optional
}

const DocumentMenu: React.FC<DocumentMenuProps> = ({
  anchorEl,
  document,
  open,
  onClose,
  onRename,
  onMove,
  onDelete,
  onDownload,
  onShare,
  onToggleStar,
  onGetInfo,
}) => {
  if (!document) return null;

  const { t } = useTranslation(); // Translation hook

  const handleRenameClick = () => {
    onRename(document);
    onClose();
  };

   const handleMoveClick = () => {
    onMove(document); // Trigger move handler
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(document);
    onClose();
  };

  const handleDownloadClick = () => {
    onDownload?.(document);
    onClose();
  };

  const handleShareClick = () => {
    onShare?.(document);
    onClose();
  }

  const handleToggleStarClick = () => {
    onToggleStar?.(document);
    onClose();
  }

   const handleGetInfoClick = () => {
     onGetInfo?.(document);
     onClose();
  }


  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{ elevation: 3, sx: { width: 280, maxWidth: '100%', mt: 1 } }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
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
            <ListItemText>{document.isStarred ? t("fileManager.removeFromStarred"): t("fileManager.addToStarred")}</ListItemText>
        </MenuItem>
         <MenuItem onClick={handleGetInfoClick} disabled={!onGetInfo}>
            <ListItemIcon><InfoOutlinedIcon fontSize="small" /></ListItemIcon>
            <ListItemText>{t("fileManager.fileInformation")}</ListItemText>
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
  );
};

export default DocumentMenu;