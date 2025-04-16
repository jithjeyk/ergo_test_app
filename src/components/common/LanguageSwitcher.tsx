// src/components/layout/LanguageSwitcher.tsx (Create this file)
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  ListItemIcon,
  Box,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"; // Or TranslateIcon
import CheckIcon from "@mui/icons-material/Check";
import { languages, LanguageCode } from "../../types/i18n"; // Import languages and type

export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation(); // Get i18n instance and t function
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLanguageCode = (i18n.language || "en") as LanguageCode;
  // Find the full language object for the current language
  const currentLanguage =
    languages.find((lang) => lang.code === currentLanguageCode) ?? languages[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode: LanguageCode) => {
    i18n.changeLanguage(langCode); // Change the language
    handleClose(); // Close the menu
  };

  return (
    <>
      <Tooltip title={t("language") || "Language"}>
        {/* Display current language code/name in the button */}
        <IconButton
          onClick={handleClick}
          aria-controls={open ? "language-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            display: "flex",
            alignItems: "flex-end", // Aligns children to the bottom
            gap: 0.5, // optional: spacing between icon and text
          }}
        >
          <LanguageIcon />
          <Typography
            variant="button"
            component="span"
            sx={{
              textTransform: "uppercase",
              display: { xs: "none", sm: "inline", fontWeight: "bold" },
            }}
          >
            {currentLanguage.nativeName}
          </Typography>
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "language-button",
          dense: true, // Make menu items slightly smaller
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        // Apply styling consistent with theme if needed
        sx={{ "& .MuiPaper-root": { mt: 1 } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            // selected={lang.code === currentLanguageCode} // Indicate selected
            onClick={() => handleLanguageChange(lang.code)}
            sx={{ minWidth: 160 }} // Ensure menu items have enough width
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              {/* Checkmark for selected language */}
              <ListItemIcon
                sx={{
                  minWidth: "30px !important",
                  opacity: lang.code === currentLanguageCode ? 1 : 0,
                }}
              >
                <CheckIcon fontSize="small" />
              </ListItemIcon>
              {/* Display native name */}
              <Typography variant="body2" component="span" sx={{ flexGrow: 1 }}>
                {lang.nativeName}
              </Typography>
              {/* Optionally display English name */}
              {lang.code !== "en" && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({lang.name})
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
