import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  ListItemButton,
  Divider,
  Tooltip,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { MenuItem } from "../../../navigation/menuItems";
import { useTranslation } from "react-i18next";

interface SidebarItemProps {
  item: MenuItem;
  level?: number; // Optional nesting level
  isNested?: boolean; // Optional flag for nested styling
  drawerOpen?: boolean; // Add prop for drawer open state
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  level = 0,
  isNested = false,
  drawerOpen = true, // Default to true for backward compatibility
}) => {
  const [menuOpen, setMenuOpen] = useState(false); // Renamed to avoid confusion
  const hasChildren = Array.isArray(item.children) && item.children.length > 0;
  const { t } = useTranslation();

  const handleClick = () => {
    if (hasChildren) {
      setMenuOpen(!menuOpen);
    }
  };

  if (item.divider) {
    return <Divider key={item.id} />;
  }

  return (
    <>
      <ListItem
        disablePadding
        component={
          item.path && !hasChildren && !item.disabled ? NavLink : "div"
        }
        to={item.path && !hasChildren && !item.disabled ? item.path : undefined}
        sx={{
          pl: level * 4, // Indent based on level
          margin: "6px 0",
          color: "text.primary",
          opacity: item.disabled ? 0.5 : 1,
          "&.active": {
            backgroundColor: "action.selected",
            "& .MuiListItemIcon-root": {
              color: "primary.main",
            },
            "& .MuiListItemText-primary": {
              fontWeight: "bold",
            },
          },
        }}
        onClick={handleClick}
      >
        <Tooltip
          title={item.disabled ? t("navigation.verySoon") : item.title}
          placement="right"
          arrow
        >
          <ListItemButton>
            {item.icon && (
              <ListItemIcon
                sx={{
                  color: "text.primary",
                  minWidth: drawerOpen ? 40 : 36, // Adjust icon container width when closed
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              sx={{
                margin: 0,
                display: drawerOpen ? "block" : "none",
                "& .MuiListItemText-primary": {
                  width: "144px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block", // Ensures the element behaves as a block
                },
              }}
              primary={item.title}
            />
            {hasChildren &&
              drawerOpen &&
              (menuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </Tooltip>
      </ListItem>

      {hasChildren && (
        <Collapse in={menuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children?.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                level={level + 1}
                isNested={true}
                drawerOpen={drawerOpen} // Pass drawer state to children
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default SidebarItem;
