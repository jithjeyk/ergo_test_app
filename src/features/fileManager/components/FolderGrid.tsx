import React, { useCallback, useMemo, memo } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Skeleton,
  IconButton,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// *** Import types from src-new ***
import { Folder } from "../../../types/document"; // Adjust path as needed
import { isFolder } from "../../../types/typeGuards";
import { useFileNavigation } from "../hooks/useFileNavigation";
interface FolderCardProps {
  folder: Folder; // Use Folder
  // onFolderClick: (folder: Folder) => void; // Use Folder
  onFolderMoreClick: (event: React.MouseEvent, folder: Folder) => void; // Use Folder
}

// Folder colors (keep as is or manage via theme/props)
export const folderColors = [
  // First row
  "#c1a699",
  "#e57a6a",
  "#e34234",
  "#fe724c",
  "#ff9531",
  "#ffb300",
  "#ffde03",
  "#fef167",
  // Second row
  "#4285f4",
  "#95cbf8",
  "#98dbd4",
  "#7fd8be",
  "#33ca95",
  "#15a364",
  "#84cc16",
  "#c7e718",
  // Third row
  "#b4b4b4",
  "#d7d0cd",
  "#f3cec5",
  "#f6abbb",
  "#e277cd",
  "#aa53bc",
  "#8f67db",
  "#a6a0f7",
];

// Memoized FolderCard component
const FolderCard = memo<FolderCardProps>(
  ({ folder, onFolderMoreClick }) => {
    const theme = useTheme();
    const color =
      folder.color ||
      folderColors[Math.floor(Math.random() * folderColors.length)]; // Use optional color or fallback

    const handleMoreClick = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();
        onFolderMoreClick?.(event, folder);
      },
      [onFolderMoreClick, folder]
    );
    const handleFolderClick = useCallback((folder: Folder) => {
      if (isFolder(folder)) { // [cite: src/types/typeGuards.ts]
          // Call the function obtained directly from the hook
          navigateToFolder(folder.id);
      }
  }, []);

  const { navigateToFolder } = useFileNavigation();

    const cardStyles = {
      backgroundColor: theme.palette.background.paper,
      cursor: "pointer",
      borderRadius: 1,
      position: "relative",
      // overflow: "visible",
      "&:hover": {
        backgroundColor: theme.palette.background.darker,
      },
    };

    const cardContentStyles = {
      p: 2,
      "&:last-child": { pb: 2 },
    };

    const iconStyles = {
      color,
      fontSize: 40,
      mr: 1,
    };

    const boxStyles = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      ml: 1,
    };

    const titleStyles = {
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };

    const iconButtonStyles = {
      ml: "auto",
      position: "absolute",
      right: 4,
    };

    // *** Update display based on Folder properties ***
    // Use childCount if available, otherwise fallback or calculate if needed
    const itemCountText = `${
      folder.childCount?.files + folder.childCount?.folders || 0
    } items`;

    return (
      <Card sx={cardStyles} onClick={() => handleFolderClick(folder)}>
        <CardContent sx={cardContentStyles}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FolderOutlinedIcon sx={iconStyles} />
            <Box sx={boxStyles}>
              <Typography variant="body1" sx={titleStyles} title={folder.name}>
                {" "}
                {/* Add title attribute */}
                {folder.name}
              </Typography>
              {/* *** Use itemCountText *** */}
              <Typography variant="body2" color="text.secondary">
                {itemCountText}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={iconButtonStyles}
              onClick={handleMoreClick}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }
);
FolderCard.displayName = "FolderCard";

// FolderGridSkeleton (Keep existing)
const FolderGridSkeleton = memo(() => {
  const elements = [...Array(4)].map((_, index) => (
    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
      <Skeleton variant="rectangular" height={100} />
    </Grid>
  ));
  // *** Add a return statement ***
  return (
    <Box>
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {elements}
      </Grid>
    </Box>
  );
  // Or return null if the skeleton shouldn't render anything in some case
  // return null;
});
FolderGridSkeleton.displayName = "FolderGridSkeleton";

// Removed ListViewFolder as ItemList logic handles view switching now

// FolderGrid Props
interface FolderGridProps {
  folders: Folder[]; // Use Folder[]
  // onFolderClick: (folder: Folder) => void; // Use Folder
  onFolderMoreClick?: (event: React.MouseEvent, folder: Folder) => void; // Use Folder
  loading?: boolean;
  // Removed viewMode as ItemList handles this
}

// Main FolderGrid component
const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  // onFolderClick,
  onFolderMoreClick,
  loading = false,
}) => {
  if (loading) {
    return <FolderGridSkeleton />;
  }

  const gridItems = useMemo(() => {
    return folders.map((folder) => (
      <Grid item xs={12} sm={6} md={3} lg={2.4} key={folder.id}>
        {" "}
        {/* Adjust grid sizing as needed */}
        <FolderCard
          folder={folder}
          // onFolderClick={onFolderClick}
          // Ensure onFolderMoreClick is passed if provided
          onFolderMoreClick={onFolderMoreClick || (() => {})}
        />
      </Grid>
    ));
  }, [folders, onFolderMoreClick]);

  return (
    <Grid container spacing={2}>
      {gridItems}
    </Grid>
  );
};

export { FolderCard };
export default memo(FolderGrid);
