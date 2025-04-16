import React, { useRef, useState } from "react"; // Added useState import
import {
  Box,
  // Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderIcon from "@mui/icons-material/Folder";
// import CloseIcon from "@mui/icons-material/Close";
// import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";

interface ActionFabProps {
  onCreateFolder: () => void;
  onFileUpload: (files: File[]) => Promise<void>;
  // *** UPDATED prop signature ***
  onFolderUpload: (files: File[], paths: string[]) => Promise<void>;
  isProcessing?: boolean;
}

export const ActionFab: React.FC<ActionFabProps> = ({
  onCreateFolder,
  onFileUpload,
  onFolderUpload,
  isProcessing = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false); // Corrected React.useState to useState

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { t } = useTranslation(); // Translation hook

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files.length > 0) {
      const filesArray = Array.from(target.files);
      // Call the callback (which is likely async)
      onFileUpload(filesArray)
        .catch((err) => console.error("File upload callback error:", err)) // Optional: Add basic catch here
        .finally(() => {
          // Reset input value AFTER the callback promise resolves/rejects
          // to prevent potential race conditions if callback needs the value
          if (target) target.value = "";
        });
    } else {
      // Ensure value is cleared even if no files selected
      if (target) target.value = "";
    }
  };

  // *** UPDATED handler to extract paths ***
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.files && target.files.length > 0) {
      const filesArray: File[] = [];
      const pathsArray: string[] = [];

      Array.from(target.files).forEach((file) => {
        // The 'webkitRelativePath' property contains the path relative to the selected folder
        const path = (file as any).webkitRelativePath || file.name; // Fallback to name if somehow missing
        filesArray.push(file);
        pathsArray.push(path);
      });

      // Call the updated callback with files and paths
      onFolderUpload(filesArray, pathsArray)
        .catch((err) => console.error("Folder upload callback error:", err)) // Optional: Add basic catch here
        .finally(() => {
          if (target) target.value = "";
        });
    } else {
      if (target) target.value = "";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 70, sm: 120 },
        right: { sm: 20, md: 50 },
        zIndex: (theme) => theme.zIndex.speedDial,
      }}
    >
      {" "}
      {/* Ensure zIndex */}
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={handleFileSelect}
        // Add accept attribute for better UX (optional)
        // accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" // Example
        data-testid="file-input"
      />
      <input
        ref={folderInputRef}
        type="file"
        // Standard attributes for folder selection
        webkitdirectory="true" // Chrome support
        // mozdirectory  // Firefox support
        // directory // Standard but less supported currently
        hidden
        onChange={handleFolderSelect}
        data-testid="folder-input"
      />
      {/* SpeedDial */}
      <Tooltip title={isProcessing ? t("buttons.uploadInProgress") : ""}>
        {/* Wrap SpeedDial in span for Tooltip when disabled */}
        <span>
          <SpeedDial
            ariaLabel="Add document or folder actions"
            // *** SIMPLIFIED processing icon ***
            icon={
              isProcessing ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <SpeedDialIcon />
              )
            }
            onClose={handleClose}
            onOpen={handleOpen}
            open={open && !isProcessing} // Prevent open when processing
            direction="up" // Standard direction
            // Disable the entire component when processing
            // disabled={isProcessing}
            FabProps={{
              // Ensure FAB itself also looks disabled
              sx: {
                ...(isProcessing && {
                  cursor: "not-allowed",
                  boxShadow: "none",
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                }),
              },
            }}
          >
            {/* Actions - Order matters */}
            <SpeedDialAction
              key="create-folder"
              icon={<CreateNewFolderIcon />}
              tooltipTitle={t("buttons.createFolder")}
              // tooltipOpen
              onClick={() => {
                handleClose();
                onCreateFolder();
              }}
              // slotProps={{
              //   tooltip: {
              //     sx: {
              //       width: "max-content",
              //     },
              //   },
              //   staticTooltipLabel: {
              //     sx: {
              //       whiteSpace: "nowrap",
              //     },
              //   },
              // }}
              // Disable individual actions too for clarity? Redundant if SpeedDial disabled.
              // disabled={isProcessing}
            />
            <SpeedDialAction
              key="upload-folder" // Changed order? Typically file then folder.
              icon={<FolderIcon />}
              tooltipTitle={t("buttons.uploadFolder")}
              // tooltipOpen
              onClick={() => {
                handleClose();
                folderInputRef.current?.click();
              }}
              // slotProps={{
              //   tooltip: {
              //     sx: {
              //       width: "max-content",
              //     },
              //   },
              //   staticTooltipLabel: {
              //     sx: {
              //       whiteSpace: "nowrap",
              //     },
              //   },
              // }}
              // disabled={isProcessing}
            />
            <SpeedDialAction
              key="upload-files"
              icon={<UploadFileIcon />}
              tooltipTitle={t("buttons.uploadFiles")}
              // tooltipOpen
              onClick={() => {
                handleClose();
                fileInputRef.current?.click();
              }}
              // slotProps={{
              //   tooltip: {
              //     sx: {
              //       width: "max-content",
              //     },
              //   },
              //   staticTooltipLabel: {
              //     sx: {
              //       whiteSpace: "nowrap",
              //     },
              //   },
              // }}
              // disabled={isProcessing}
            />
          </SpeedDial>
        </span>
      </Tooltip>
    </Box>
  );
};
