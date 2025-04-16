import React, { useState, FormEvent } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import { LinkedIn, Facebook, Instagram, Twitter } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required");
        return;
      }

      const response = await login(email, password);

      if (response.success) {
        setSuccess(response.message);
        setError("");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
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
          height: !isSmallScreen ? "612px" : "auto",
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          boxShadow: "0px 6px 18px rgba(0, 0, 0, 1)",
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
              zIndex: 2,
            }}
          >
            <motion.div variants={childVariants}>
              <Typography
                variant={isExtraSmallScreen ? "h4" : "h3"}
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Welcome!
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{ fontWeight: 700, lineHeight: 1.2, mb: 2 }}
              >
                Document Management Reimagined
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant="h5"
                color="inherit"
                sx={{ fontWeight: 300, mb: 3 }}
              >
                Powered by ERGOVANCE
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Typography
                variant={isExtraSmallScreen ? "body1" : "h6"}
                sx={{ mb: 3, maxWidth: "500px" }}
              >
                Secure, intelligent document management with AI-powered
                efficiency. Streamline your workflow, enhance collaboration, and
                protect your most valuable information.
              </Typography>
            </motion.div>
            <motion.div variants={childVariants}>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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

        {/* Right Section - Login Form */}
        <Box
          sx={{
            width: isSmallScreen ? "100%" : "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: isExtraSmallScreen ? 2 : 4,
            position: "relative",
            zIndex: 2,
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
                sx={{ mb: 1, color: "blueviolet", fontWeight: "bold" }}
              >
                Sign In
              </Typography>
            </motion.div>
            {isSmallScreen && (
              <motion.div variants={childVariants}>
                <Box sx={{ textAlign: "center", mb: 3, color: "blueviolet" }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 700, lineHeight: 1.2, mb: 2 }}
                  >
                    Document Management Reimagined
                  </Typography>
                  <Typography
                    variant="h6"
                    color="inherit"
                    sx={{ fontWeight: 300, mb: 3 }}
                  >
                    Powered by ERGOVANCE
                  </Typography>
                </Box>
              </motion.div>
            )}
            {error && (
              <motion.div
                variants={childVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                variants={childVariants}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  <AlertTitle>Success</AlertTitle>
                  {success}
                </Alert>
              </motion.div>
            )}
            <form onSubmit={handleSubmit}>
              <motion.div variants={childVariants}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  disabled={loading}
                  autoComplete="email"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(89, 45, 247, 0.3)" },
                      "&:hover fieldset": { borderColor: "blueviolet" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(65, 68, 248, 0.7)" },
                    "& .MuiInputBase-input": { color: "blueviolet" },
                  }}
                  InputProps={{
                    style: { fontSize: isExtraSmallScreen ? "14px" : "16px" },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  variant="outlined"
                  margin="normal"
                  disabled={loading}
                  autoComplete="current-password"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "rgba(89, 45, 247, 0.3)" },
                      "&:hover fieldset": { borderColor: "blueviolet" },
                    },
                    "& .MuiInputLabel-root": { color: "rgba(65, 68, 248, 0.7)" },
                    "& .MuiInputBase-input": { color: "blueviolet" },
                  }}
                  InputProps={{
                    style: { fontSize: isExtraSmallScreen ? "14px" : "16px" },
                  }}
                />
              </motion.div>
              <motion.div variants={childVariants}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: isExtraSmallScreen ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isExtraSmallScreen ? "flex-start" : "center",
                    my: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: "blueviolet",
                          "&.Mui-checked": { color: "blueviolet" },
                          p: isExtraSmallScreen ? 0.5 : 1,
                        }}
                        size={isExtraSmallScreen ? "small" : "medium"}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color: "blueviolet",
                          fontSize: isExtraSmallScreen ? "12px" : "14px",
                        }}
                      >
                        Remember me
                      </Typography>
                    }
                  />
                  <Link
                    href="#"
                    variant="body2"
                    sx={{
                      color: "blueviolet",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                      mt: isExtraSmallScreen ? 1 : 0,
                      fontSize: isExtraSmallScreen ? "12px" : "14px",
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>
              </motion.div>
              <motion.div variants={childVariants}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 2,
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
                    "Sign In"
                  )}
                </Button>
              </motion.div>
              {isSmallScreen && (
                <motion.div variants={childVariants}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 3, justifyContent: "center" }}
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
                  Don't have an account?{" "}
                  <Link
                    onClick={() => navigate("/signup")}
                    sx={{
                      color: "blueviolet",
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign up
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

export default LoginPage;
