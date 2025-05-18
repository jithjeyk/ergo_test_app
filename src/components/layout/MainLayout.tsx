import React, { useEffect } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  styled,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import AppBarComponent from "./AppBar/index";
// import Footer from "./Footer/index";
import Sidebar from "./Sidebar/index";

const MainContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  minHeight: "calc(100vh - 64px)",
  display: "flex",
  flexDirection: "column",
}));

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const location = useLocation();

  // Detect screen size changes
  useEffect(() => {
    setIsSidebarOpen(!isMobile);
  }, [isMobile]);

  // Close drawer on mobile route change
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBarComponent open={isSidebarOpen} onDrawerOpen={toggleSidebar} />
      <Sidebar open={isSidebarOpen} onDrawerClose={toggleSidebar} />

      <MainContent>
        <Toolbar />
        {children || <Outlet />}
      </MainContent>
    </Box>
  );
};

export default MainLayout;
