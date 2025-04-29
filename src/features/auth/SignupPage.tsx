import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Grid,
  // Paper,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Facebook,
  Google as GoogleIcon,
  Instagram,
  LinkedIn,
  Microsoft as MicrosoftIcon,
  Twitter,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Define animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 0.9,
    transition: { duration: 2, ease: "easeInOut" },
  },
};

const SignupPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    organization: "",
    username: "",
    password: "",
  });

  // Error state for validation
  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    organization: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const theme = useTheme();

  // Responsive breakpoints
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  // Basic form validation
  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      isValid = false;
    }
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }
    if (!formData.organization) {
      newErrors.organization = "Organization is required";
      isValid = false;
    }
    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      if (validateForm()) {
        console.log("Form submitted:", formData);
        // Add your signup logic here (e.g., API call)
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle SSO signup
  const handleSSOSignup = (provider: "google" | "microsoft") => {
    console.log(`Signing up with ${provider}`);
    // Add OAuth redirect logic here (e.g., window.location.href = '/auth/google')
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
        }}
      >
        {/* Simulated Backdrop Layer */}
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(249, 249, 250, 0.28)",
            zIndex: 1,
          }}
        />
        {/* Left Section - Welcome */}
        {!isSmallScreen && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: 4,
              color: "blueviolet",
              position: "relative",
            }}
          >
            <motion.div variants={childVariants}>
              <Typography
                variant={isExtraSmallScreen ? "h4" : "h3"}
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  zIndex: 3,
                }}
              >
                Don't have a smart DMS!
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Join Our AI <br /> Document Management System
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant="h5"
                color="inherit"
                sx={{
                  fontWeight: 300,
                  mb: 3,
                }}
              >
                Powered by ERGOVANCE
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant={isExtraSmallScreen ? "body1" : "h6"}
                sx={{
                  mb: 3,
                  maxWidth: "500px",
                  zIndex: 3,
                }}
              >
                Get started with secure, AI-powered document management tailored
                for your team.
              </Typography>
            </motion.div>
            {/* Social Icons */}
            <motion.div variants={childVariants}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  mt: 2,
                  zIndex: 3,
                }}
              >
                <IconButton
                  color="inherit"
                  size={isExtraSmallScreen ? "small" : "medium"}
                >
                  <LinkedIn />
                </IconButton>
                <IconButton
                  color="inherit"
                  size={isExtraSmallScreen ? "small" : "medium"}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  color="inherit"
                  size={isExtraSmallScreen ? "small" : "medium"}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  color="inherit"
                  size={isExtraSmallScreen ? "small" : "medium"}
                >
                  <Twitter />
                </IconButton>
              </Stack>
            </motion.div>
          </Box>
        )}
        {/* Right Section - Signup Form */}
        <Box
          sx={{
            width: isSmallScreen ? "100%" : "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isExtraSmallScreen ? 2 : 4,
            // background: "rgba(255, 255, 255, 0.1)",
            // backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 2,
            // height: isSmallScreen ? '100%' : '100vh',
          }}
        >
          {/* Form Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)", // Static, not animated
            }}
          />
          <Box
            sx={{
              maxWidth: isExtraSmallScreen ? "100%" : "400px",
              margin: "auto",
              width: "100%",
              position: "relative",
            }}
          >
            <motion.div variants={childVariants}>
              <Typography
                variant="h4"
                align="center"
                sx={{
                  mb: 1,
                  color: "blueviolet",
                  fontWeight: "bold",
                }}
              >
                Sign Up
              </Typography>
            </motion.div>
            {isSmallScreen && (
              <motion.div variants={childVariants}>
                <Box sx={{ textAlign: "center", mb: 3, color: "blueviolet" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      mb: 2,
                    }}
                  >
                    Document Management Reimagined
                  </Typography>

                  <Typography
                    variant="h6"
                    color="inherit"
                    sx={{
                      fontWeight: 300,
                      mb: 3,
                    }}
                  >
                    Powered by ERGOVANCE
                  </Typography>
                </Box>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <motion.div variants={childVariants}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(89, 45, 247, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "blueviolet",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(65, 68, 248, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "blueviolet",
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isExtraSmallScreen ? "14px" : "16px",
                    },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(89, 45, 247, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "blueviolet",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(65, 68, 248, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "blueviolet",
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isExtraSmallScreen ? "14px" : "16px",
                    },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <TextField
                  fullWidth
                  label="Organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  error={!!errors.organization}
                  helperText={errors.organization}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(89, 45, 247, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "blueviolet",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(65, 68, 248, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "blueviolet",
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isExtraSmallScreen ? "14px" : "16px",
                    },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(89, 45, 247, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "blueviolet",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(65, 68, 248, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "blueviolet",
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isExtraSmallScreen ? "14px" : "16px",
                    },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  margin="normal"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(89, 45, 247, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "blueviolet",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(65, 68, 248, 0.7)",
                    },
                    "& .MuiInputBase-input": {
                      color: "blueviolet",
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isExtraSmallScreen ? "14px" : "16px",
                    },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2,
                    // py: 1.5,
                    fontSize: isExtraSmallScreen ? "14px" : "16px",
                    background: "linear-gradient(to right, #5E97F6, #3367D6)",
                    "&:hover": {
                      background: "linear-gradient(to right, #4285F4, #3367D6)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </motion.div>
              <motion.div variants={childVariants}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="blueviolet">
                    Or sign up with
                  </Typography>
                </Divider>
              </motion.div>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <motion.div variants={childVariants}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<GoogleIcon />}
                      onClick={() => (window.location.href = "http://localhost:3000/auth/google")}
                      sx={{ textTransform: "none" }}
                    >
                      Google
                    </Button>
                  </motion.div>
                </Grid>
                <Grid item xs={6}>
                  <motion.div variants={childVariants}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<MicrosoftIcon />}
                      onClick={() => handleSSOSignup("microsoft")}
                      sx={{ textTransform: "none" }}
                    >
                      Microsoft
                    </Button>
                  </motion.div>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isExtraSmallScreen ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isExtraSmallScreen ? "flex-start" : "center",
                  my: 2,
                }}
              ></Box>
              {/* Mobile Social Icons */}
              {isSmallScreen && (
                <motion.div variants={childVariants}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      mt: 3,
                      justifyContent: "center",
                    }}
                  >
                    <IconButton color="inherit" size="small">
                      <LinkedIn />
                    </IconButton>
                    <IconButton color="inherit" size="small">
                      <Facebook />
                    </IconButton>
                    <IconButton color="inherit" size="small">
                      <Instagram />
                    </IconButton>
                    <IconButton color="inherit" size="small">
                      <Twitter />
                    </IconButton>
                  </Stack>
                </motion.div>
              )}
              <motion.div variants={childVariants}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    mt: 2,
                    color: "blueviolet",
                    fontSize: isExtraSmallScreen ? "12px" : "14px",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "blueviolet",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Log in
                  </Link>
                </Typography>
              </motion.div>
            </form>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default SignupPage;
