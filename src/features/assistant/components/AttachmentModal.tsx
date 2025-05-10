// components/Modals/AttachmentModal.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

interface AttachmentModalProps {
  open: boolean;
  onClose: () => void;
  onFilesSelected: (files: File[]) => void;
}

export const AttachmentModal = ({
  open,
  onClose,
  onFilesSelected,
}: AttachmentModalProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files));
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Attach Files</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: "center",
            borderStyle: "dashed",
            cursor: "pointer",
            "&:hover": { borderColor: "primary.main" },
          }}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <CloudUpload fontSize="large" color="primary" />
          <Typography variant="body1" mt={1}>
            Click to browse or drag and drop files
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Supports PDF, DOCX, PPTX, XLSX, TXT (Max 20MB each)
          </Typography>
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Paper>

        <Grid container spacing={2} mt={2}>
          {[
            {
              icon: <StorageOutlinedIcon type="drive" />,
              label: "My Knowledge Base",
            },
            { icon: <FolderOutlinedIcon type="localStorage" />, label: "Local storage" },
          ].map((item) => (
            <Grid item xs={6} key={item.label}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Box fontSize="32px" mb={1}>
                  {item.icon}
                </Box>
                <Typography variant="body2">{item.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Attach Files
        </Button>
      </DialogActions>
    </Dialog>
  );
};
