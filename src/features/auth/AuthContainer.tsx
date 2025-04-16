import React from "react";
import {
  AppBar,
  // Avatar,
  Box,
  // Container,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// import Footer from "../../components/layout/Footer";
import backgroundImage from "../../assets/images/dms-light-auth-background001.jpg"; // Adjust path as needed

interface AuthContainerProps {
  children: React.ReactNode;
}

const Logo = () => (
  <Typography variant="h4" sx={{ fontWeight: "bold", color: "blueviolet" }}>
    AI DMS
  </Typography>
);

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      sx={{
        minHeight: "100vh", // Ensures the container takes up full viewport height
        display: "flex",
        flexDirection: "column", // Stack children vertically
        justifyContent: "space-between", // Pushes footer to the bottom
        alignItems: "center", // Center horizontally
        bgcolor: "grey.100", 
        // backgroundImage: `linear-gradient(250deg, rgba(123, 104, 238, 0) 0%, #0D1B2A 70%), url(${backgroundImage})`,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        p: { xs: 2, sm: 0 }, // Responsive padding
        // position: 'relative',
        // '&:before': {
        //   content: '""',
        //   position: 'absolute',
        //   top: 0,
        //   left: 0,
        //   width: '100%',
        //   height: '100%',
        //   backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay for readability
        //   zIndex: 1,
        // },
      }}
    >
      <AppBar
        position="static" // Use "fixed" or "absolute" if you want it to stay on top
        sx={{
          backgroundColor: "transparent", // Transparent background
          boxShadow: "none", // Remove default shadow
          borderBottom: "none", // Subtle border for visibility
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between", // Space logo and icon apart
            alignItems: "center",
            px: { xs: 1, sm: 2, md: 5 }, // Responsive padding
          }}
        >
          {/* Left Side: Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Logo />
          </Box>

          {/* Right Side: Help Icon */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="help"
              sx={{
                color: "blueviolet", // Ensure visibility on transparent background
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle hover effect
                },
              }}
              onClick={() => console.log("Help clicked")} // Replace with your handler
            >
              <HelpOutlineIcon fontSize={isMobile ? "small" : "medium"} />{" "}
              {/* Responsive icon size */}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Content Wrapper */}
      <Box
        sx={{
          flexGrow: 1, // Allows this box to grow and fill available space
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          // maxWidth: "450px", // Limits content width
          // position: 'relative',
          // zIndex: 2,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      {/* <Box
        sx={{
          width: "100%",
          maxWidth: "450px", // Matches content width for consistency
          textAlign: "center", // Center footer content
        }}
      >
        <Footer />
      </Box> */}
    </Box>
  );
};

export default AuthContainer;
