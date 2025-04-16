import React, { useState, useCallback, useMemo } from "react"; // Added useCallback
import {
  Typography,
  Box,
  Skeleton,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// *** Import types/guards from src-new ***
import { Folder, File } from "../../../types/document"; // Adjust path
import { isFolder as isFolderGuard } from "../../../types/typeGuards"; // Adjust path

// *** Import adapted components ***
import FolderGrid from "./FolderGrid"; // Uses Folder
// DocumentItem is removed as DocumentCard is used for grid view
import DocumentCard from "./DocumentCard"; // Uses File
import FolderMenu from "./FolderMenu"; // Uses Folder
import DocumentMenu from "./DocumentMenu"; // Uses File
import { getIconForItem } from "../utils/getIconForItem"; // Uses File/Folder
import { formatBytes, formatDate } from "../utils/formatting";
import { useTranslation } from "react-i18next"; // For translation

// Combine types
type ItemType = Folder | File;

interface ItemListProps {
  items: ItemType[]; // Use combined type
  onFolderClick: (folder: Folder) => void; // Use Folder
  onDocumentClick: (document: File) => void; // Use File
  isLoading?: boolean;
  viewMode?: "list" | "hybrid"; // Keep viewMode for layout

  // --- Add Handlers for Menu Actions ---
  onRenameItem: (item: ItemType) => void;
  onMoveItem: (item: ItemType) => void;
  onDeleteItem: (item: ItemType) => void;
  // Add others like star, share, download if needed
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onFolderClick,
  onDocumentClick,
  isLoading = false,
  viewMode = "hybrid", // Default remains hybrid
  // --- Destructure new handlers ---
  onRenameItem,
  onMoveItem,
  onDeleteItem,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

  // *** Use type guard for filtering ***
  const folders = useMemo(() => items.filter(isFolderGuard), [items]);
  const documents = useMemo(
    () => items.filter((item): item is File => !isFolderGuard(item)),
    [items]
  );

  const { t } = useTranslation(); // For translation

  // --- Menu Handlers ---
  const handleMoreClick = useCallback(
    (event: React.MouseEvent, item: ItemType) => {
      event.stopPropagation(); // Prevent click bubbling (e.g., stops card click)
      setMenuAnchorEl(event.currentTarget as HTMLElement);
      setSelectedItem(item);
    },
    []
  ); // Empty dependency array as it only uses args

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  }, []); // Empty dependency array

  // --- Action Handlers (passed down to menus) ---
  // These now just call the props passed from the parent (MyDocumentsPage)
  const handleRename = useCallback(
    (item: ItemType) => {
      console.log(`ItemList: Rename requested for ${item.name}`);
      onRenameItem(item);
    },
    [onRenameItem]
  );

  const handleMove = useCallback(
    (item: ItemType) => {
      console.log(`ItemList: Move requested for ${item.name}`);
      onMoveItem(item);
    },
    [onMoveItem]
  );

  const handleDelete = useCallback(
    (item: ItemType) => {
      console.log(`ItemList: Delete requested for ${item.name}`);
      onDeleteItem(item);
    },
    [onDeleteItem]
  );

  // Loading Skeleton (Keep existing)
  // if (isLoading && items.length === 0) { // Only show full skeleton if items are empty AND loading
  //   return ( /* ... existing skeleton ... */ );
  // }

  // // Empty State (Keep existing)
  // if (!isLoading && items.length === 0) {
  //    return ( /* ... existing empty state ... */ );
  // }

  // --- Render Logic ---

  // Hybrid view (folders grid + documents grid) - Adapt to use DocumentCard
  if (viewMode === "hybrid") {
    return (
      <Box>
        {/* Folders section */}
        {folders.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t("fileManager.folders")} ({folders.length})
            </Typography>
            <FolderGrid
              folders={folders}
              // onFolderClick={onFolderClick}
              // Pass handleMoreClick to FolderGrid -> FolderCard
              onFolderMoreClick={handleMoreClick}
              loading={isLoading} // Pass loading for individual card skeletons if needed
            />
          </Box>
        )}

        {/* Documents section (now using DocumentCard grid) */}
        {documents.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
            {t("fileManager.documents")} ({documents.length})
            </Typography>
            <Grid container spacing={2}>
              {documents.map((document) => (
                <Grid item xs={12} sm={6} md={3} lg={2.4} key={document.id}>
                  {" "}
                  {/* Adjust grid sizing */}
                  <DocumentCard
                    document={document}
                    onDocumentClick={onDocumentClick}
                    // Pass handleMoreClick to DocumentCard
                    onMoreClick={(e) => handleMoreClick(e, document)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Context menus */}
        {selectedItem && isFolderGuard(selectedItem) && (
          <FolderMenu
            anchorEl={menuAnchorEl}
            folder={selectedItem} // Type is correct now
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            // Pass action handlers
            onRename={handleRename}
            onMove={handleMove}
            onDelete={handleDelete}
            // Add other actions later if needed (onDownload, onShare, onToggleStar, onGetInfo, onColorChange)
          />
        )}
        {selectedItem && !isFolderGuard(selectedItem) && (
          <DocumentMenu
            anchorEl={menuAnchorEl}
            document={selectedItem} // Type is correct now
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            // Pass action handlers
            onRename={handleRename}
            onMove={handleMove}
            onDelete={handleDelete}
            // Add other actions later if needed (onDownload, onShare, onToggleStar, onGetInfo)
          />
        )}
      </Box>
    );
  }

  // List view (Render all items in a single list) - Adapt to use new types
  return (
    <List dense>
      {items.map((item) => {
        const isItemFolder = isFolderGuard(item);
        const icon = getIconForItem(item);

        return (
          <ListItem
            key={item.id}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => handleMoreClick(e, item)}
                aria-label="more actions"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemButton
              onClick={() =>
                isItemFolder ? onFolderClick(item) : onDocumentClick(item)
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText
                primary={item.name}
                // Use modifiedAt, format size correctly
                secondary={
                  !isItemFolder
                    ? `${formatBytes(item.size)} - ${formatDate(
                        item.modifiedAt
                      )}`
                    : formatDate(item.modifiedAt)
                }
              />
            </ListItemButton>
          </ListItem>
        );
      })}

      {/* Context menus (same as hybrid view) */}
      {selectedItem && isFolderGuard(selectedItem) && (
        <FolderMenu
          anchorEl={menuAnchorEl}
          folder={selectedItem}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          onRename={handleRename}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      )}
      {selectedItem && !isFolderGuard(selectedItem) && (
        <DocumentMenu
          anchorEl={menuAnchorEl}
          document={selectedItem}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          onRename={handleRename}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      )}
    </List>
  );
};

export default ItemList; // Export default
