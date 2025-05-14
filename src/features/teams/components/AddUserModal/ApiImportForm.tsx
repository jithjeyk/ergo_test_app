import React, { useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  FormHelperText,
  Chip,
  useMediaQuery,
  useTheme,
  Collapse,
  Alert,
  Button,
} from "@mui/material";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import ApiIcon from "@mui/icons-material/Api";
import HttpIcon from "@mui/icons-material/Http";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SettingsIcon from "@mui/icons-material/Settings";

// Define strong TypeScript interface for form data
interface ApiImportFormData {
  source: string;
  endpoint: string;
  apiKey: string;
  secret: string;
  importActive: boolean;
  importPhotos: boolean;
  syncRegularly: boolean;
  syncFrequency: "daily" | "weekly" | "monthly";
}

interface ApiImportFormProps {
  onChange: (data: ApiImportFormData) => void;
}

export const ApiImportForm: React.FC<ApiImportFormProps> = ({ onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<ApiImportFormData>({
    source: "",
    endpoint: "",
    apiKey: "",
    secret: "",
    importActive: true,
    importPhotos: false,
    syncRegularly: false,
    syncFrequency: "daily",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ApiImportFormData, string>>
  >({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<
    "error" | "warning" | "info" | "success"
  >("error");

  // Validation function for fields
  const validateField = (
    field: keyof ApiImportFormData,
    value: any
  ): string => {
    switch (field) {
      case "source":
        return value === "" ? "API source is required" : "";
      case "endpoint":
        // Basic URL validation
        if (value === "") return "API endpoint is required";
        try {
          new URL(value);
          return "";
        } catch (e) {
          return "Please enter a valid URL";
        }
      case "apiKey":
        return value === "" ? "API key is required" : "";
      default:
        return "";
    }
  };

  const handleChange = (field: keyof ApiImportFormData, value: any) => {
    const validationError = validateField(field, value);
    const newErrors = { ...errors, [field]: validationError };
    const newData = { ...formData, [field]: value };

    setFormData(newData);
    setErrors(newErrors);

    // Only trigger onChange if there are no errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      onChange(newData);
    }
  };

  const testConnection = () => {
    // Validate all required fields first
    const requiredFields: (keyof ApiImportFormData)[] = [
      "source",
      "endpoint",
      "apiKey",
    ];
    const newErrors: Partial<Record<keyof ApiImportFormData, string>> = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setAlertMessage("Please fill in all required fields correctly");
      setAlertSeverity("error");
      setShowAlert(true);
      return;
    }

    // Mock API test connection
    setAlertMessage("Connection successful! API credentials verified.");
    setAlertSeverity("success");
    setShowAlert(true);

    // Auto-hide the alert after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "google":
        return "G";
      case "microsoft":
        return "M";
      case "slack":
        return "S";
      case "okta":
        return "O";
      case "custom":
        return "C";
      default:
        return "?";
    }
  };

  return (
    <Box>
      <Collapse in={showAlert}>
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {/* API Connection Section */}
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
            <ApiIcon sx={{ mr: 1 }} /> API Connection
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small" error={!!errors.source}>
            <InputLabel id="api-source-label">API Source</InputLabel>
            <Select
              labelId="api-source-label"
              value={formData.source}
              label="API Source"
              onChange={(e) => handleChange("source", e.target.value)}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={getSourceIcon(selected)}
                    size="small"
                    color={selected ? "primary" : "default"}
                    sx={{ width: 24, height: 24, borderRadius: "50%" }}
                  />
                  {selected === "google"
                    ? "Google Workspace"
                    : selected === "microsoft"
                    ? "Microsoft 365"
                    : selected === "slack"
                    ? "Slack"
                    : selected === "okta"
                    ? "Okta"
                    : selected === "custom"
                    ? "Custom API"
                    : "Select an integration"}
                </Box>
              )}
              startAdornment={
                <InputAdornment position="start">
                  <CloudSyncIcon color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="">Select an integration</MenuItem>
              <MenuItem value="google">Google Workspace</MenuItem>
              <MenuItem value="microsoft">Microsoft 365</MenuItem>
              <MenuItem value="slack">Slack</MenuItem>
              <MenuItem value="okta">Okta</MenuItem>
              <MenuItem value="custom">Custom API</MenuItem>
            </Select>
            {errors.source && <FormHelperText>{errors.source}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="API Endpoint"
            size="small"
            placeholder="https://api.example.com/users"
            value={formData.endpoint}
            onChange={(e) => handleChange("endpoint", e.target.value)}
            error={!!errors.endpoint}
            helperText={errors.endpoint}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HttpIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Authentication Section */}
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
            <VpnKeyIcon sx={{ mr: 1 }} /> Authentication
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            label="API Key"
            type="password"
            size="small"
            value={formData.apiKey}
            onChange={(e) => handleChange("apiKey", e.target.value)}
            error={!!errors.apiKey}
            helperText={errors.apiKey}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Secret"
            type="password"
            size="small"
            value={formData.secret}
            onChange={(e) => handleChange("secret", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <FormHelperText>Optional for some integrations</FormHelperText>
        </Grid>

        {/* Import Settings Section */}
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
            <SettingsIcon sx={{ mr: 1 }} /> Import Settings
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.importActive}
                      onChange={(e) =>
                        handleChange("importActive", e.target.checked)
                      }
                    />
                  }
                  label="Only import active users"
                />
                <FormHelperText sx={{ ml: 4 }}>
                  Skip disabled or inactive accounts
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.importPhotos}
                      onChange={(e) =>
                        handleChange("importPhotos", e.target.checked)
                      }
                    />
                  }
                  label="Import profile photos"
                />
                <FormHelperText sx={{ ml: 4 }}>
                  Will download profile pictures if available
                </FormHelperText>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.syncRegularly}
                      onChange={(e) =>
                        handleChange("syncRegularly", e.target.checked)
                      }
                    />
                  }
                  label="Sync regularly"
                />
                {formData.syncRegularly && (
                  <FormControl
                    size="small"
                    sx={{
                      ml: 4,
                      width: isMobile ? "100%" : "auto",
                      mt: isMobile ? 1 : 0,
                    }}
                  >
                    <InputLabel id="sync-frequency-label">Frequency</InputLabel>
                    <Select
                      labelId="sync-frequency-label"
                      value={formData.syncFrequency}
                      label="Frequency"
                      onChange={(e) =>
                        handleChange("syncFrequency", e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={testConnection}
            startIcon={<CloudSyncIcon />}
            size={isMobile ? "small" : "medium"}
          >
            Test Connection
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
