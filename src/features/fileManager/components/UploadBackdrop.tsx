import React, { useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  // CircularProgress, // Removed for simplification, LinearProgress is sufficient
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import { formatBytes } from "../../../utils/formatting"; // Adjust path as necessary
import { useTranslation } from "react-i18next";

interface UploadBackdropProps {
  isDragging: boolean;
  isProcessing?: boolean;
  progress?: { loaded: number; total: number };
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClose: () => void; // Callback to signal closing intention
}

// Utility function for formatting bytes
// const formatBytes = (bytes: number, decimals = 2): string => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   // Ensure index is within bounds
//   const sizeIndex = Math.min(i, sizes.length - 1);

//   return `${parseFloat((bytes / Math.pow(k, sizeIndex)).toFixed(dm))} ${sizes[sizeIndex]}`;
// };

export const UploadBackdrop: React.FC<UploadBackdropProps> = ({
  isDragging,
  isProcessing = false,
  progress = { loaded: 0, total: 1 }, // Default total=1 avoids NaN
  onDragOver,
  onDragLeave,
  onDrop,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation(); // Translation hook
  const paperRef = useRef<HTMLDivElement>(null); // Ref for focus management

  // Effect for Keyboard Dismissal (Escape key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close only if Escape is pressed and we are not processing
      if (event.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    if (isDragging || isProcessing) {
      document.addEventListener("keydown", handleKeyDown);
      // Basic focus management: focus the paper element when backdrop appears
      paperRef.current?.focus();
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Cleanup listener on unmount or when backdrop hides
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDragging, isProcessing, onClose]); // Re-run if state changes

  // Don't render if not dragging or processing
  if (!isDragging && !isProcessing) return null;

  // Ensure total is not zero for calculation, use default if necessary
  const currentTotal = progress.total > 0 ? progress.total : 1;
  const progressPercentage = Math.min(
    100,
    Math.round((progress.loaded / currentTotal) * 100)
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: theme.zIndex.modal, // Use standard modal zIndex
        backgroundColor: alpha(theme.palette.background.default, 0.85), // Slightly adjust opacity/color if needed
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Prevent background click closing - rely on explicit button/Escape key
        // onClick={isProcessing ? undefined : onClose} // REMOVED
      }}
      // These handlers allow the backdrop itself to be the drop target
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Paper
        ref={paperRef} // Assign ref
        elevation={8}
        sx={{
          p: { xs: 2, sm: 4 }, // Responsive padding
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 450, // Slightly wider?
          width: "90%", // Use percentage for responsiveness
          backgroundColor: theme.palette.background.paper, // Use paper background
          borderRadius: theme.shape.borderRadius * 2, // Consistent border radius
          position: "relative", // For positioning the close button
          outline: "none", // Remove default focus outline if focus is managed visually
          tabIndex: -1, // Make it focusable programmatically
        }}
        // Accessibility attributes for Dialog role
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-backdrop-title"
        aria-describedby={
          isProcessing
            ? "upload-backdrop-processing-desc"
            : "upload-backdrop-drag-desc"
        }
      >
        {/* Close Button - Only show when NOT processing */}
        {!isProcessing && (
          <IconButton
            aria-label="Close upload overlay"
            onClick={onClose}
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              right: theme.spacing(1),
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {isProcessing ? (
          // --- Processing State UI ---
          <>
            {/* <CircularProgress size={60} ... /> REMOVED */}
            <Typography
              id="upload-backdrop-title"
              variant="h6"
              component="h2"
              gutterBottom
              align="center"
              sx={{ mt: 2 }}
            >
              {" "}
              {/* Title */}
              {t("fileManager.processingUpload")}
            </Typography>
            <Typography
              id="upload-backdrop-processing-desc"
              variant="body1"
              align="center"
              gutterBottom
            >
              {" "}
              {/* Description */}
              {t("common.pleaseWait")}...
            </Typography>
            <Box sx={{ width: "100%", my: 2 }}>
              <LinearProgress
                aria-label="Upload progress" // Accessibility label
                variant="determinate"
                value={progressPercentage}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              aria-live="polite"
            >
              {" "}
              {/* Announce progress changes */}
              {formatBytes(progress.loaded)} / {formatBytes(currentTotal)} (
              {progressPercentage}%)
            </Typography>
          </>
        ) : (
          // --- Drag State UI ---
          <>
            <Box sx={{ display: "flex", mb: 2, color: "primary.main" }}>
              {" "}
              {/* Use theme color */}
              <UploadFileIcon sx={{ fontSize: 50, mr: 1 }} />
              <FolderIcon sx={{ fontSize: 50, ml: 1 }} />
            </Box>
            <Typography
              id="upload-backdrop-title"
              variant="h5"
              component="h2"
              gutterBottom
              align="center"
            >
              {" "}
              {/* Title */}
              {t("fileManager.dropToUpload")}
            </Typography>
            <Typography
              id="upload-backdrop-drag-desc"
              variant="body1"
              align="center"
            >
              {" "}
              {/* Description */}
              {t("fileManager.releaseDocuments")}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};
