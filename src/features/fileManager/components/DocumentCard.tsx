import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  styled,
  useTheme,
  IconButton,
  alpha,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// *** Ensure types are from src-new ***
import { File as AppFile } from "../../../types/document"; // Use alias, Adjust path
import { getIconForItem } from "../utils/getIconForItem"; // Adjust path
import { formatBytes, formatDate } from "../../../utils/formatting";

// Correctly define CardProps type if needed for clarity/more complex scenarios
// import { CardProps } from "@mui/material";

// Styled components
const StyledCard = styled(Card)({
  // Apply <CardProps> potentially if issues persist
  /* ... existing styles if any ... */
  // *** MOVE height style here ***
  height: "100%",
  // Ensure other necessary base styles are here
  display: "flex",
  flexDirection: "column",
});

// Define HeaderSection, IconBox, AvatarGroup (assuming these have simple styles)
const HeaderSection = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // Ensure background color is defined if used via sx prop before
  // backgroundColor: alpha(theme.palette.primary.light, 0.1), // Example if it was in sx
});
const IconBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 48,
  height: 48,
});
const AvatarGroup = styled(Stack)({
  /* Add styles if needed */
});

interface DocumentCardProps {
  document: AppFile; // Use aliased File type
  onDocumentClick: (document: AppFile) => void;
  onMoreClick?: (event: React.MouseEvent, document: AppFile) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDocumentClick,
  onMoreClick,
}) => {
  const theme = useTheme();

  // Mock data (Use collaborator data)
  interface User {
    initials: string;
    color: string;
  }
  const sharedUsers: User[] = (document.collaborators || [])
    .slice(0, 2)
    .map((col, i) => ({
      initials: col.user.name.substring(0, 2).toUpperCase() || "??",
      color: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][i % 4],
    }));

  const cardContentStyles = {
    p: 1.5,
    backgroundColor: theme.palette.background.default,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    display: "flex",
    flexDirection: "column",
    flexGrow: 1, // Ensure content area fills the card
    height: "100%", // Should not be needed if card handles height
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoreClick) {
      onMoreClick(e, document);
    }
  };

  const icon = getIconForItem(document);
  const headerBgColor = alpha(theme.palette.primary.light, 0.1);

  return (
    // *** REMOVE sx prop from StyledCard instance ***
    <StyledCard elevation={0}>
      {/* Pass styles to CardContent instead if needed, or ensure StyledCard handles height */}
      <CardContent
        sx={cardContentStyles}
        onClick={() => onDocumentClick(document)}
      >
        {/* Icon Header */}
        <HeaderSection
          sx={{
            backgroundColor: headerBgColor,
            mb: 1.5,
            p: 2,
            borderRadius: 1,
          }}
        >
          {/* Ensure IconBox has size if not defined in styled() */}
          <IconBox>
            {/* Cloning icon to apply styles */}
            {React.isValidElement(icon)
              ? // *** Apply type assertion 'as any' to the props object ***
                React.cloneElement(
                  icon as React.ReactElement,
                  { sx: { fontSize: 40, color: "primary.main" } } as any
                )
              : null}
          </IconBox>
        </HeaderSection>
        {/* File Name and Actions */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          <Typography
            variant="body2"
            component="h6"
            sx={{
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
            title={document.name}
          >
            {document.name}
          </Typography>
          <IconButton
            edge="end"
            aria-label="more"
            onClick={handleMoreClick}
            size="small"
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
        {/* Footer Info */}
        <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: "auto" }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatBytes(document.size)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(document.modifiedAt)}
          </Typography>
        </Stack>
        {/* Collaborators */}
        {sharedUsers.length > 0 && (
          <Stack direction="row" alignItems="center" sx={{ mt: 1 }}>
            <AvatarGroup direction="row" spacing={-1}>
              {" "}
              {/* Ensure direction and spacing */}
              {sharedUsers.map((user, index) => (
                <Avatar
                  key={index}
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: user.color,
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                  }}
                >
                  {user.initials}
                </Avatar>
              ))}
            </AvatarGroup>
          </Stack>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default DocumentCard;
