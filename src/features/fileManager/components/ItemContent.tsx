import React from "react";
import { Box, Alert, CircularProgress, Typography } from "@mui/material";

// *** Import adapted components and types from src-new ***
import ItemList from "./ItemList"; // Uses adapted ItemList
import BreadcrumbsNavigation from "./BreadcrumbsNavigation"; // Uses src-new types
import { Pagination } from "../../../components/common/Pagination"; // Adjust path if needed
import { Folder, File, BreadcrumbSegment } from "../../../types/document"; // Adjust path

// Combine types
type ItemType = Folder | File;

interface ItemContentProps {
  items: ItemType[]; // Use combined type from src-new
  breadcrumbs: BreadcrumbSegment[]; // Use type from src-new
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  activeTab: string; // Removed as only 'all' view is supported now
  onPageChange: (page: number) => void;
  onFolderClick: (folder: Folder) => void; // Use Folder
  onDocumentClick: (document: File) => void; // Use File
  // onBreadcrumbClick: (folderId: string | null, index: number) => void; // Keep signature
  onErrorClose: () => void;

  // --- Add Handlers for Menu Actions ---
  onRenameItem: (item: ItemType) => void;
  onMoveItem: (item: ItemType) => void;
  onDeleteItem: (item: ItemType) => void;
}

export const ItemContent: React.FC<ItemContentProps> = ({
  items,
  breadcrumbs,
  isLoading,
  error,
  currentPage,
  totalItems,
  itemsPerPage,
  activeTab, // Removed
  onPageChange,
  onFolderClick,
  onDocumentClick,
  // onBreadcrumbClick,
  onErrorClose,
  // --- Destructure new handlers ---
  onRenameItem,
  onMoveItem,
  onDeleteItem,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 256px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        {/* Breadcrumbs are always shown now */}
        {/* <BreadcrumbsNavigation segments={breadcrumbs} onNavigate={onBreadcrumbClick} /> */}
        {/* {activeTab === "all" && (
          <BreadcrumbsNavigation
            segments={breadcrumbs}
            onNavigate={onBreadcrumbClick} // Pass the correct handler
          />
        )} */}

        {error && (
          <Alert severity="error" onClose={onErrorClose} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Display loading indicator (only when list is empty) */}
        {isLoading && items.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* ItemList always rendered if not loading empty */}
        {(!isLoading || items.length > 0) && (
          <ItemList
            items={items} // Pass items
            onFolderClick={onFolderClick}
            onDocumentClick={onDocumentClick}
            isLoading={isLoading} // Pass loading for potential internal skeletons
            viewMode="hybrid" // Or make this configurable later
            // --- Pass action handlers down ---
            onRenameItem={onRenameItem}
            onMoveItem={onMoveItem}
            onDeleteItem={onDeleteItem}
          />
        )}
      </Box>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
};
