// src/components/layout/Sidebar/SidebarFooter.tsx
import React, { useContext } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext, useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps {
  open: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ open }) => {
  const { logout } = useAuth();
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: open ? "16px" : "16px 0",
          minHeight: 56,
          boxSizing: "border-box",
        }}
      >
        {open ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 36,
                  height: 36,
                  fontSize: "0.875rem",
                }}
                src={user?.avatar}
              >
                {"JD"}
              </Avatar>

              <Box sx={{ ml: 1.5, overflow: "hidden" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    lineHeight: 1.2,
                    fontWeight: 600,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.name || "John Doe"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t("profile.administrator")}
                </Typography>
              </Box>
            </Box>

            <Tooltip title="Logout">
              <IconButton
                size="small"
                onClick={onLogout}
                sx={{ color: "text.secondary" }}
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          // When drawer is closed, show only logout icon centered
          <Tooltip title="Logout" placement="right">
            <IconButton
              size="small"
              onClick={onLogout}
              sx={{
                color: "text.secondary",
                margin: "0 auto",
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </>
  );
};

export default SidebarFooter;
