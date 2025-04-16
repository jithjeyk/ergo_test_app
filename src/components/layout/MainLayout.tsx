import React from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  styled,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { Outlet } from "react-router-dom";

import AppBarComponent from "./AppBar/index";
// import Footer from "./Footer/index";
import Sidebar from "./Sidebar/index";

const MainContent = styled(Box)<{ theme?: Theme }>(({ theme }) => ({
  flexGrow: 1,
  // padding: theme.spacing(0.5),
  backgroundColor: theme.palette.background.default,
  minHeight: "calc(100vh - 64px)", // Adjust based on AppBar height
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
  // const [open, setOpen] = React.useState(false);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpen(false);
  // };

  const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBarComponent open={isMobile ? false : isSidebarOpen} onDrawerOpen={toggleSidebar} />

      <Sidebar open={isMobile ? false : isSidebarOpen} onDrawerClose={toggleSidebar} />
      <MainContent>
        <Toolbar /> {/* Create space below AppBar */}
        {children || <Outlet />}
        <Box
          sx={(theme) => ({
            borderTop: `1px solid ${theme.palette.divider}`,
          })}
        >
          {/* <Footer /> */}
        </Box>
      </MainContent>
    </Box>
  );
};

export default MainLayout;
