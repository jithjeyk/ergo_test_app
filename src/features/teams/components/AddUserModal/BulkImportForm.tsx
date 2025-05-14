import React, { useState, useRef } from "react";
import {
  Box,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Paper,
  Button,
  Chip,
  Alert,
  Collapse,
  FormHelperText,
  // IconButton,
  useMediaQuery,
  useTheme,
  // Tooltip,
  // Stack,
  CircularProgress,
} from "@mui/material";
import {
  UploadFile,
  FilePresent,
  Download,
  DeleteOutline,
  CheckCircleOutline,
  ErrorOutline,
  HelpOutline,
} from "@mui/icons-material";

// Define proper TypeScript interfaces
interface CSVSettings {
  delimiter: string;
  hasHeader: boolean;
  encoding: string;
  skipEmptyRows: boolean;
}

interface FileInfo {
  name: string;
  size: number;
  type: string;
}

interface BulkImportData {
  file: File | null;
  fileInfo: FileInfo | null;
  settings: CSVSettings;
  status: "idle" | "validating" | "valid" | "error";
}

interface BulkImportFormProps {
  onChange: (data: BulkImportData) => void;
  downloadTemplate?: () => void;
  maxFileSizeMB?: number;
}

export const BulkImportForm: React.FC<BulkImportFormProps> = ({
  onChange,
  downloadTemplate,
  maxFileSizeMB = 10,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importData, setImportData] = useState<BulkImportData>({
    file: null,
    fileInfo: null,
    settings: {
      delimiter: ",",
      hasHeader: true,
      encoding: "utf8",
      skipEmptyRows: true,
    },
    status: "idle",
  });

  const [alertInfo, setAlertInfo] = useState<{
    show: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({
    show: false,
    message: "",
    severity: "error",
  });

  const handleSettingsChange = (field: keyof CSVSettings, value: any) => {
    const newSettings = { ...importData.settings, [field]: value };
    const newData = { ...importData, settings: newSettings };

    setImportData(newData);
    onChange(newData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Reset alerts
    setAlertInfo({ show: false, message: "", severity: "error" });

    if (file) {
      // Validate file type
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setAlertInfo({
          show: true,
          message: "Please upload a CSV file.",
          severity: "error",
        });
        return;
      }

      // Validate file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setAlertInfo({
          show: true,
          message: `File size too large. Please upload a CSV smaller than ${maxFileSizeMB}MB.`,
          severity: "error",
        });
        return;
      }

      // Set file information
      const fileInfo: FileInfo = {
        name: file.name,
        size: file.size,
        type: file.type,
      };

      // Update state to "validating"
      const updatedData = {
        ...importData,
        file,
        fileInfo,
        status: "validating" as const,
      };

      setImportData(updatedData);

      // Simulate validation (in a real app, you'd actually validate the CSV content)
      setTimeout(() => {
        const validatedData = {
          ...updatedData,
          status: "valid" as const,
        };
        setImportData(validatedData);
        onChange(validatedData);

        setAlertInfo({
          show: true,
          message: "File validated successfully!",
          severity: "success",
        });
      }, 1000);
    }
  };

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    const resetData = {
      ...importData,
      file: null,
      fileInfo: null,
      status: "idle" as const,
    };

    setImportData(resetData);
    onChange(resetData);
    setAlertInfo({ show: false, message: "", severity: "error" });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      // Create a new DataTransfer
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      // Set the files property of the input element
      fileInputRef.current.files = dataTransfer.files;

      // Trigger change event manually
      const changeEvent = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  // Determine the upload area color based on status
  const getUploadAreaColor = () => {
    switch (importData.status) {
      case "valid":
        return theme.palette.success.light;
      case "error":
        return theme.palette.error.light;
      case "validating":
        return theme.palette.info.light;
      default:
        return "transparent";
    }
  };

  // Determine status chip color and label
  const getStatusChip = () => {
    switch (importData.status) {
      case "valid":
        return (
          <Chip
            icon={<CheckCircleOutline />}
            label="Valid CSV"
            color="success"
            size="small"
          />
        );
      case "error":
        return (
          <Chip
            icon={<ErrorOutline />}
            label="Invalid Format"
            color="error"
            size="small"
          />
        );
      case "validating":
        return (
          <Chip
            icon={<CircularProgress size={16} />}
            label="Validating..."
            color="info"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Collapse in={alertInfo.show}>
        <Alert
          severity={alertInfo.severity}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          sx={{ mb: 2 }}
        >
          {alertInfo.message}
        </Alert>
      </Collapse>

      {/* File Upload Section */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            <UploadFile sx={{ mr: 1 }} /> CSV File Upload
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              borderStyle: "dashed",
              cursor: "pointer",
              borderColor: importData.file ? getUploadAreaColor() : "divider",
              borderWidth: importData.file ? 2 : 1,
              bgcolor: importData.file
                ? `${getUploadAreaColor()}10` // Add slight transparency
                : "background.paper",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: importData.file
                  ? getUploadAreaColor()
                  : "primary.main",
                bgcolor: importData.file
                  ? `${getUploadAreaColor()}20`
                  : "action.hover",
              },
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              id="csv-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              aria-label="Upload CSV file"
            />

            {importData.file ? (
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <FilePresent
                    fontSize="large"
                    color="primary"
                    sx={{ mr: 1, fontSize: 40 }}
                  />
                  {getStatusChip()}
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  {importData.fileInfo?.name}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {importData.fileInfo?.size &&
                    formatFileSize(importData.fileInfo.size)}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteOutline />}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    Remove File
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <UploadFile
                  fontSize="large"
                  color="primary"
                  sx={{ fontSize: { xs: 50, sm: 60 }, mb: 2, opacity: 0.8 }}
                />
                <Typography variant="h6" gutterBottom>
                  Click to browse or drag and drop CSV file
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Supported format: CSV (max {maxFileSizeMB}MB)
                </Typography>

                {downloadTemplate && (
                  <Button
                    variant="text"
                    color="primary"
                    startIcon={<Download />}
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadTemplate();
                    }}
                    size={isMobile ? "small" : "medium"}
                    sx={{ mt: 2 }}
                  >
                    Download Template
                  </Button>
                )}
              </>
            )}
          </Paper>
        </Grid>

        {/* CSV Import Settings Section */}
        <Grid item xs={12}>
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            CSV Import Settings
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="delimiter-label">Delimiter</InputLabel>
            <Select
              labelId="delimiter-label"
              value={importData.settings.delimiter}
              label="Delimiter"
              onChange={(e) =>
                handleSettingsChange("delimiter", e.target.value)
              }
            >
              <MenuItem value=",">Comma (,)</MenuItem>
              <MenuItem value=";">Semicolon (;)</MenuItem>
              <MenuItem value="\t">Tab</MenuItem>
              <MenuItem value="|">Pipe (|)</MenuItem>
            </Select>
            <FormHelperText>Character separating values</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="header-label">Header Row</InputLabel>
            <Select
              labelId="header-label"
              value={importData.settings.hasHeader}
              label="Header Row"
              onChange={(e) =>
                handleSettingsChange("hasHeader", e.target.value === "true")
              }
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
            <FormHelperText>First row contains column names</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="encoding-label">Encoding</InputLabel>
            <Select
              labelId="encoding-label"
              value={importData.settings.encoding}
              label="Encoding"
              onChange={(e) =>
                handleSettingsChange("encoding", e.target.value as string)
              }
            >
              <MenuItem value="utf8">UTF-8</MenuItem>
              <MenuItem value="iso-8859-1">ISO-8859-1</MenuItem>
              <MenuItem value="windows-1252">Windows-1252</MenuItem>
            </Select>
            <FormHelperText>Character encoding format</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="skip-empty-label">Skip Empty Rows</InputLabel>
            <Select
              labelId="skip-empty-label"
              value={importData.settings.skipEmptyRows}
              label="Skip Empty Rows"
              onChange={(e) =>
                handleSettingsChange("skipEmptyRows", e.target.value === "true")
              }
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
            <FormHelperText>Ignore rows with no values</FormHelperText>
          </FormControl>
        </Grid>

        {/* Help Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 2,
              bgcolor: "info.main",
              color: "info.contrastText",
              borderRadius: 1,
              display: "flex",
              alignItems: "flex-start",
            }}
          >
            <HelpOutline sx={{ mr: 1, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Tips for successful import:
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  <li>Make sure your CSV file has all required columns</li>
                  <li>Use the template file to ensure proper formatting</li>
                  <li>Non-UTF8 characters may cause unexpected errors</li>
                  <li>The system will validate all rows before importing</li>
                </ul>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
