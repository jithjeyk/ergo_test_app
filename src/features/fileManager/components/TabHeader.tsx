import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export type TabValue = "recent" | "all" | "shared" | "favorites";

interface TabHeaderProps {
  activeTab: TabValue;
  onTabChange: (event: React.SyntheticEvent, newValue: TabValue) => void;
}

// Styled components to match Shadcn UI styling
const ShadcnTabs = styled(Tabs)(({ theme }) => ({
  minHeight: "auto",
  // maxWidth: "662px",
  width: "fit-content",
  borderRadius: "6px",
  padding: "6px",
  backgroundColor: theme.palette.background.darker,
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTabs-flexContainer": {
    gap: theme.spacing(1),
  },
}));

const ShadcnTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.875rem",
  // lineHeight: 1.5,
  minHeight: 30,
  // minWidth: "123px",
  padding: "0px 12px",
  borderRadius: "6px",
  color: theme.palette.text.secondary,
  transition: "all 0.2s ease",
  "&.Mui-selected": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontWeight: 600,
    // boxShadow: `0 0 8px 2px ${theme.palette.action.selected}`,
    "&:hover": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
}));

export const TabHeader: React.FC<TabHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();
  return (
    <Box>
      <ShadcnTabs
        value={activeTab}
        onChange={onTabChange}
        aria-label="Document tabs"
      >
        <ShadcnTab
          label={t("fileManager.recentFiles")}
          value="recent"
          id="documents-tab-recent"
          aria-controls="documents-tabpanel-recent"
          disableRipple
        />
        <ShadcnTab
          label={t("fileManager.allDocuments")}
          value="all"
          id="documents-tab-all"
          aria-controls="documents-tabpanel-all"
          disableRipple
        />
        <ShadcnTab
          label={t("fileManager.sharedWithMe")}
          value="shared"
          id="documents-tab-shared"
          aria-controls="documents-tabpanel-shared"
          disableRipple
        />
        <ShadcnTab
          label={t("fileManager.favorites")}
          value="favorites"
          id="documents-tab-favorites"
          aria-controls="documents-tabpanel-favorites"
          disableRipple
        />
      </ShadcnTabs>
    </Box>
  );
};
