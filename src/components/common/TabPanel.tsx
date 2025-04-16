import React from "react";
import { Box } from "@mui/material";

export type TabValue = string;

interface TabPanelProps {
  children?: React.ReactNode;
  index: TabValue;
  value: TabValue;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documents-tabpanel-${index}`}
      aria-labelledby={`documents-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};
