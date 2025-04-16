import React, { ReactNode } from "react";
import {
  GridViewOutlined as GridViewOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
  TipsAndUpdatesOutlined as TipsAndUpdatesOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  // GppGoodOutlined as GppGoodOutlinedIcon,
  // SettingsInputComponentOutlined as SettingsInputComponentOutlinedIcon,
} from "@mui/icons-material";
import { SvgIconProps } from "@mui/material";
import { useTranslation } from "react-i18next";
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: ReactNode;
  iconColor?: string;
  permissions?: string[];
  children?: MenuItem[];
  divider?: boolean;
  disabled?: boolean;
  titleKey?: string; // Add a key for translation
}

// Define color categories based on functionality
const ICON_COLORS = {
  navigation: "#2196F3",
  content: "#4CAF50",
  collaboration: "#9C27B0",
  analytics: "#FF9800",
  settings: "#607D8B",
  security: "#F44336",
  system: "#795548",
};

// Helper function to create colored icon
const coloredIcon = (
  Icon: React.ComponentType<SvgIconProps>,
  color: string
) => <Icon sx={{ color }} />;

// Create the menu items without translation
const getMenuItems = (): MenuItem[] => [
  {
    id: "dashboard",
    titleKey: "navigation.dashboard",
    title: "Dashboard", // Fallback title
    path: "/dashboard",
    icon: coloredIcon(GridViewOutlinedIcon, ICON_COLORS.navigation),
    iconColor: ICON_COLORS.navigation,
  },
  {
    id: "my_assistant",
    titleKey: "navigation.myAssistant",
    title: "My Assistant", // Fallback title
    path: "/myassistant",
    icon: coloredIcon(TipsAndUpdatesOutlinedIcon, ICON_COLORS.analytics),
    iconColor: ICON_COLORS.analytics,
    disabled: true,
  },
  {
    id: "my_knowledge_base",
    titleKey: "navigation.myKnowledgeBase",
    title: "My Knowledge Base", // Fallback title
    path: "/myknowledgebase",
    icon: coloredIcon(InsertDriveFileOutlinedIcon, ICON_COLORS.content),
    iconColor: ICON_COLORS.content,
  },
  {
    id: "team",
    titleKey: "navigation.myTeam",
    title: "My Team", // Fallback title
    path: "/team",
    icon: coloredIcon(GroupsOutlinedIcon, ICON_COLORS.collaboration),
    iconColor: ICON_COLORS.collaboration,
    disabled: true,
  },
  {
    id: "reports",
    titleKey: "navigation.myReports",
    title: "My Reports", // Fallback title
    path: "/reports",
    icon: coloredIcon(AssessmentOutlinedIcon, ICON_COLORS.analytics),
    iconColor: ICON_COLORS.analytics,
    disabled: true,
  },
  {
    id: "settings",
    titleKey: "navigation.settings",
    title: "Settings", // Fallback title
    path: "/settings",
    icon: coloredIcon(SettingsOutlinedIcon, ICON_COLORS.settings),
    iconColor: ICON_COLORS.settings,
    disabled: true,
  }
];

export const menuItems = getMenuItems();

// Create a hook to use in components that will return translated menu items
export const useTranslatedMenuItems = () => {
  const { t } = useTranslation();
  
  return React.useMemo(() => {
    return menuItems.map(item => ({
      ...item,
      title: item.titleKey ? t(item.titleKey) : item.title
    }));
  }, [t]);
};

export default menuItems;