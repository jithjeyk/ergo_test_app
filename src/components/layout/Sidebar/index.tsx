import React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { useTranslatedMenuItems } from "../../../navigation/menuItems"; // Import only the hook
import { Typography } from "@mui/material";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  // padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      display: "flex",
      flexDirection: "column",
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      display: "flex",
      flexDirection: "column",
    },
  }),
}));

interface SidebarProps {
  open: boolean;
  onDrawerClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onDrawerClose }) => {
  const theme = useTheme();
  const translatedMenuItems = useTranslatedMenuItems();

  return (
    <StyledDrawer variant="permanent" open={open}>
      <DrawerHeader>
        <Typography
          variant="h4"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: "left",
            paddingLeft: "16px",
            fontWeight: "bold",
            color: theme.palette.primary.main,
          }}
        >
          AI DMS
        </Typography>
        <IconButton onClick={onDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
        <Divider orientation="vertical" flexItem />
      </DrawerHeader>

      <Divider />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <List
          sx={{
            width: "100%",
            padding: open ? "12px" : "4px",
            flexGrow: 1,
          }}
        >
          {translatedMenuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              level={0}
              isNested={false}
              drawerOpen={open}
            />
          ))}
        </List>
      </Box>

      <SidebarFooter open={open} />
    </StyledDrawer>
  );
};

export default Sidebar;
