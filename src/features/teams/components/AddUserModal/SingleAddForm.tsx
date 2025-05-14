import React, { useState, useRef } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Button,
  Box,
  Typography,
  Chip,
  FormHelperText,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  // Card,
  // Tooltip,
  Collapse,
  Alert,
  Paper,
  // Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PhoneIcon from "@mui/icons-material/Phone";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddUserFormData } from "../../../../types/teamMembers";

interface SingleAddFormProps {
  onChange: (data: AddUserFormData) => void;
}

export const SingleAddForm: React.FC<SingleAddFormProps> = ({ onChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState<AddUserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    phone: "",
    userType: "user",
    role: "developer",
    status: "pending",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AddUserFormData, string>>
  >({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAlert, setShowAlert] = useState(false);

  const validateField = (field: keyof AddUserFormData, value: string) => {
    switch (field) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
          ? ""
          : "Please enter a valid email address";
      case "firstName":
      case "lastName":
        return value.trim() === ""
          ? `${field === "firstName" ? "First" : "Last"} name is required`
          : "";
      case "phone":
        const phoneRegex = /^\+?[0-9]{10,15}$/;
        return value === "" || phoneRegex.test(value)
          ? ""
          : "Please enter a valid phone number";
      default:
        return "";
    }
  };

  const handleChange = (field: keyof AddUserFormData, value: string) => {
    const validationError = validateField(field, value);
    const newErrors = { ...errors, [field]: validationError };
    const newData = { ...formData, [field]: value };

    setFormData(newData);
    setErrors(newErrors);

    // Only trigger onChange if there are no errors
    const hasErrors = Object.values(newErrors).some((error) => error !== "");
    if (!hasErrors) {
      onChange(newData);
    } else {
      // onChange({});
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setShowAlert(true);
        return;
      }

      setAvatarFile(file);
      console.log("avatarFile", avatarFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getUserTypeColor = (type: string) => {
    return type === "admin" ? "error" : "primary";
  };

  const getUserStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "registered":
        return "success";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Collapse in={showAlert}>
        <Alert
          severity="error"
          onClose={() => setShowAlert(false)}
          sx={{ mb: 2 }}
        >
          File size too large. Please upload an image smaller than 5MB.
        </Alert>
      </Collapse>

      <Grid container spacing={3}>
        {/* Personal Information Section */}
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
            <PersonIcon sx={{ mr: 1 }} /> Personal Information
          </Typography>
        </Grid>

        {/* Avatar Upload */}
        <Grid item xs={12} sm={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleAvatarUpload}
            />

            {avatarPreview ? (
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={avatarPreview}
                  sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    boxShadow: 2,
                  }}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    bgcolor: "background.paper",
                    boxShadow: 1,
                  }}
                  size="small"
                  onClick={removeAvatar}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  mb: 2,
                  bgcolor: "action.selected",
                }}
              >
                <PersonIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />
              </Avatar>
            )}

            <Button
              variant="outlined"
              startIcon={<AddAPhotoIcon />}
              onClick={() => fileInputRef.current?.click()}
              size={isMobile ? "small" : "medium"}
              sx={{ width: "100%" }}
            >
              Upload Photo
            </Button>
            <FormHelperText sx={{ textAlign: "center", mt: 1 }}>
              Recommended: Square JPG or PNG, max 5MB
            </FormHelperText>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                size="small"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                size="small"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                size="small"
                value={formData.position}
                onChange={(e) => handleChange("position", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Email"
                size="small"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Contact & Position Section */}
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
            <BusinessIcon sx={{ mr: 1 }} /> Role & Contact Information
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={formData.role}
              label="Role"
              onChange={(e) => handleChange("role", e.target.value as string)}
            >
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="account">Account</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            size="small"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Permissions Section */}
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
              <path d="M7 10h10"></path>
              <path d="M7 14h10"></path>
              <circle cx="9" cy="10" r="2"></circle>
              <circle cx="15" cy="14" r="2"></circle>
              <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z"></path>
            </svg>
            Permissions & Status
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="user-type-label">User Type</InputLabel>
            <Select
              labelId="user-type-label"
              value={formData.userType}
              label="User Type"
              onChange={(e) =>
                handleChange("userType", e.target.value as string)
              }
              renderValue={(selected) => (
                <Chip
                  label={selected === "admin" ? "Admin" : "Standard User"}
                  size="small"
                  color={getUserTypeColor(selected)}
                />
              )}
            >
              <MenuItem value="user">Standard User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            <FormHelperText>
              {formData.userType === "admin"
                ? "Full system access"
                : "Limited access"}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status}
              label="Status"
              onChange={(e) => handleChange("status", e.target.value as string)}
              renderValue={(selected) => (
                <Chip
                  label={selected.charAt(0).toUpperCase() + selected.slice(1)}
                  size="small"
                  color={getUserStatusColor(selected)}
                />
              )}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="registered">Registered</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
