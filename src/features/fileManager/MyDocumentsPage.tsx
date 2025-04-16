import React, { useState, useCallback, useMemo } from "react"; // Added useMemo
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button as MuiButton,
  Typography,
} from "@mui/material"; // Added Dialog elements

// *** Import adapted/provided components ***
import { TabPanel } from "../../components/common/TabPanel"; // Keep path
import { TabHeader } from "./components/TabHeader"; // Keep path
import { ItemContent } from "./components/ItemContent"; // Use adapted ItemContent
import { ActionFab } from "./components/ActionFab"; // Use adapted ActionFab
import { UploadBackdrop } from "./components/UploadBackdrop"; // Use adapted UploadBackdrop
import CreateFolderDialog from "./components/CreateFolderDialog"; // Use adapted Dialog

// *** Import hooks, types, actions from src-new ***
import { useFileNavigation } from "../../features/fileManager/hooks/useFileNavigation"; // Adjust path to src-new hooks
import { useFileDisplay } from "../../features/fileManager/hooks/useFileDisplay"; // Adjust path to src-new hooks
import { useDragAndDrop } from "../../features/fileManager/hooks/useDragAndDrop"; // Adjust path to src-new hooks
import {
  createFolderThunk,
  removeItem,
  uploadFilesThunk,
  uploadFolderThunk,
  renameItemThunk /*, moveItemThunk */,
} from "../../store/fileManagerSlice"; // Adjust path to src-new slice
import {
  selectError,
  selectStatus,
  selectCurrentFolderId,
  selectBreadcrumbs,
  selectRootId,
} from "../../store/fileManagerSelectors"; // Adjust path to src-new selectors
import type { AppDispatch } from "../../store/store"; // Adjust path to src-new store
import type { Folder, File, UUID } from "../../types/document"; // Adjust path to src-new types
import { isFolder } from "../../types/typeGuards"; // Adjust path to src-new types
import BreadcrumbsNavigation from "./components/BreadcrumbsNavigation";
import { useTranslation } from "react-i18next";
// Combine types
type ItemType = Folder | File;

// Tab value type (can remain as is for UI)
export type TabValue = "recent" | "all" | "shared" | "favorites";

// Helper function (assuming defined elsewhere or add here)
const generateId = (prefix: "file" | "folder"): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const MyDocumentsPage: React.FC = () => {
  // Renamed component
  const dispatch: AppDispatch = useDispatch();
  const currentFolderId = useSelector(selectCurrentFolderId);
  const rootId = useSelector(selectRootId);
  //   const breadcrumbs = useSelector(selectBreadcrumbs);
  const globalError = useSelector(selectError); // Global errors from slice
  const globalStatus = useSelector(selectStatus); // Global status from slice

  // --- State ---
  const [activeTab, setActiveTab] = useState<TabValue>("all"); // Default to 'all' as it's the only functional one now
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // State for Rename Dialog
  const [renameItem, setRenameItem] = useState<ItemType | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  // State for Move Dialog (Optional - can implement later)
  // const [moveItem, setMoveItem] = useState<ItemType | null>(null);
  // const [isMoving, setIsMoving] = useState(false);

  // --- Hooks ---
  const {
    items,
    isLoading: isDisplayLoading,
    error: displayError,
    ...displayProps
  } = useFileDisplay({ itemsPerPage: 15 }); // Use hook from src-new
  const { navigateToFolder, navigateViaBreadcrumb, navigateUp, breadcrumbs } =
    useFileNavigation(); // Use hook from src-new

  const { t } = useTranslation();

  // Implement Callbacks for useDragAndDrop
  const handleUploadError = useCallback((error: Error) => {
    console.error("Upload Error Callback:", error);
    setUploadError(`Upload failed: ${error.message}`);
  }, []);

  const handleFileUpload = useCallback(
    async (browserFiles: globalThis.File[]) => {
      // <-- Change type here
      if (!currentFolderId) {
        handleUploadError(
          new Error("Cannot upload: No current folder selected.")
        );
        return;
      }
      setUploadError(null);
      console.log("Handling file upload...", browserFiles);

      // --- CONVERSION LOGIC INSIDE ---
      const newAppFiles: File[] = browserFiles.map((file) => {
        // <-- Perform mapping here
        const now = new Date().toISOString();
        const id = generateId("file");
        const parentPath =
          breadcrumbs.length > 0
            ? breadcrumbs.map((b) => b.name).join("/")
            : ""; // Calculate parent path
        const filePath = parentPath
          ? `${parentPath}/${file.name}`
          : `/${file.name}`; // Construct full path

        return {
          id: id,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          parentId: currentFolderId,
          path: filePath,
          type: "file",
          extension: file.name.split(".").pop()?.toLowerCase() ?? "",
          createdAt: now,
          modifiedAt: now,
          lastAccessedAt: now,
          createdBy: "local_user",
          isStarred: false,
          shareStatus: "private",
          collaborators: [],
          tags: [],
          customMetadata: {},
          trashed: false,
          versions: [],
          currentVersionId: "", // Adjust if needed
          contentHash: "", // Adjust if needed
          encrypted: false,
          locked: false,
        };
      });
      // --- END CONVERSION LOGIC ---

      if (newAppFiles.length > 0) {
        try {
          console.log("Dispatching uploadFilesThunk with:", newAppFiles);
          await dispatch(uploadFilesThunk({ files: newAppFiles })).unwrap(); // Dispatch with AppFile[]
          console.log("File upload successful.");
        } catch (rejectedValueOrSerializedError) {
          console.error(
            "Failed to upload files via thunk:",
            rejectedValueOrSerializedError
          );
          const errorMsg =
            typeof rejectedValueOrSerializedError === "string"
              ? rejectedValueOrSerializedError
              : (rejectedValueOrSerializedError as any)?.message ||
                "Unknown upload error";
          handleUploadError(new Error(errorMsg));
        }
      }
    },
    [dispatch, currentFolderId, handleUploadError, breadcrumbs]
  );

  const handleFolderUpload = useCallback(
    async (browserFiles: globalThis.File[], relativePaths: string[]) => {
      // <-- Change type here
      if (!currentFolderId) {
        handleUploadError(
          new Error("Cannot upload: No current folder selected.")
        );
        return;
      }
      setUploadError(null);
      console.log("Handling folder upload...", browserFiles, relativePaths);

      const newAppFiles: File[] = [];
      const newAppFolders: Folder[] = [];
      const now = new Date().toISOString();
      const createdFolders: Record<string, Folder> = {};

      // --- CONVERSION LOGIC INSIDE (Function to create/find AppFolder based on path) ---
      const ensureParentFolder = (pathSegments: string[]): Folder | null => {
        let currentParentId: UUID | null = currentFolderId;
        // Calculate base path from breadcrumbs carefully
        let currentParentPath = "";
        if (breadcrumbs.length > 0) {
          // Ensure root isn't duplicated if it's the only breadcrumb
          currentParentPath =
            breadcrumbs[0].id === "root" && breadcrumbs.length === 1
              ? "/"
              : breadcrumbs.map((b) => b.name).join("/");
          // Add leading slash if needed and not root
          if (currentParentPath !== "/" && !currentParentPath.startsWith("/")) {
            currentParentPath = "/" + currentParentPath;
          }
        } else {
          currentParentPath = "/"; // Should not happen if breadcrumbs selector is correct
        }

        let parentFolderInLoop: Folder | null = null;

        for (let i = 0; i < pathSegments.length; i++) {
          const segmentName = pathSegments[i];
          // Construct full path carefully, avoiding double slashes
          const fullPath =
            currentParentPath === "/"
              ? `/${segmentName}`
              : `${currentParentPath}/${segmentName}`;

          if (createdFolders[fullPath]) {
            parentFolderInLoop = createdFolders[fullPath];
          } else {
            const folderId = generateId("folder");
            parentFolderInLoop = {
              id: folderId,
              name: segmentName,
              parentId: currentParentId,
              path: fullPath,
              type: "folder",
              createdAt: now,
              modifiedAt: now,
              lastAccessedAt: now,
              createdBy: "local_user",
              isStarred: false,
              shareStatus: "private",
              collaborators: [],
              tags: [],
              customMetadata: {},
              trashed: false,
              childCount: { files: 0, folders: 0, trashedItems: 0 },
              size: 0,
              color: "#1E90FF",
            };
            newAppFolders.push(parentFolderInLoop); // Add to list for dispatch
            createdFolders[fullPath] = parentFolderInLoop;
          }
          currentParentId = parentFolderInLoop.id;
          currentParentPath = parentFolderInLoop.path;
        }
        return parentFolderInLoop;
      };
      // --- END CONVERSION LOGIC (Helper) ---

      for (let i = 0; i < browserFiles.length; i++) {
        const file = browserFiles[i]; // Native browser File
        const relativePath = relativePaths[i];
        const pathSegments = relativePath
          .split("/")
          .filter((p) => p.length > 0);

        const fileName = pathSegments.pop(); // Remove filename
        if (!fileName) continue;

        // --- CONVERSION LOGIC INSIDE (File to AppFile) ---
        const parentFolder = ensureParentFolder(pathSegments); // Create/get parent AppFolder
        if (!parentFolder) {
          console.error("Could not determine parent folder for:", relativePath);
          continue;
        }

        newAppFiles.push({
          // Create AppFile
          id: generateId("file"),
          name: fileName,
          mimeType: file.type,
          size: file.size,
          parentId: parentFolder.id, // Parent is the AppFolder created/found
          path: `${parentFolder.path}/${fileName}`, // Path based on AppFolder path
          type: "file",
          extension: fileName.split(".").pop()?.toLowerCase() ?? "",
          createdAt: now,
          modifiedAt: now,
          lastAccessedAt: now,
          createdBy: "local_user",
          isStarred: false,
          shareStatus: "private",
          collaborators: [],
          tags: [],
          customMetadata: {},
          trashed: false,
          versions: [],
          currentVersionId: "",
          contentHash: "",
          encrypted: false,
          locked: false,
        });
        // --- END CONVERSION LOGIC (File to AppFile) ---
      }

      if (newAppFiles.length > 0 || newAppFolders.length > 0) {
        try {
          console.log("Dispatching uploadFolderThunk with:", {
            files: newAppFiles,
            folders: newAppFolders,
          });
          await dispatch(
            uploadFolderThunk({ files: newAppFiles, folders: newAppFolders })
          ).unwrap(); // Dispatch AppFile[]/AppFolder[]
          console.log("Folder structure upload successful.");
        } catch (rejectedValueOrSerializedError) {
          console.error(
            "Failed to upload folder structure via thunk:",
            rejectedValueOrSerializedError
          );
          const errorMsg =
            typeof rejectedValueOrSerializedError === "string"
              ? rejectedValueOrSerializedError
              : (rejectedValueOrSerializedError as any)?.message ||
                "Unknown folder upload error";
          handleUploadError(new Error(errorMsg));
        }
      }
    },
    [dispatch, currentFolderId, handleUploadError, breadcrumbs]
  );

  const {
    getRootProps,
    isDragging,
    isProcessing: isUploading,
    uploadProgress,
  } = useDragAndDrop({
    onFileUpload: handleFileUpload,
    onFolderUpload: handleFolderUpload,
    onError: handleUploadError,
  });

  // --- Event Handlers ---
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    // Only allow switching to 'all' for now, or add logic for other tabs later
    if (newValue === "all") {
      setActiveTab(newValue);
    } else {
      console.warn(`Tab '${newValue}' functionality not implemented yet.`);
      // Optionally show a message to the user
    }
    // displayProps.handlePageChange(1); // Reset pagination if needed
  };

  // Open Create Folder Dialog
  const handleCreateFolderClick = useCallback(() => {
    setIsCreateFolderDialogOpen(true);
  }, []);

  // Handle actual folder creation from dialog
  const handleCreateFolderSubmit = useCallback(
    async (name: string): Promise<boolean> => {
      if (!currentFolderId) return false; // Should have current folder
      try {
        await dispatch(
          createFolderThunk({ name, parentId: currentFolderId })
        ).unwrap();
        setIsCreateFolderDialogOpen(false); // Close dialog on success
        return true;
      } catch (rejectedValueOrSerializedError) {
        console.error(
          "Failed to create folder:",
          rejectedValueOrSerializedError
        );
        // Error will be set in Redux state, dialog might show it if adapted
        return false;
      }
    },
    [dispatch, currentFolderId]
  );

  // Handle file/document click (currently just logs)
  const handleDocumentClick = useCallback((document: File) => {
    console.log("Document clicked:", document);
    alert(`Open document: ${document.name}`);
  }, []);

  // --- Action Handlers for Item Menus ---
  const handleRenameItem = useCallback(
    (item: ItemType) => {
      setRenameItem(item); // Set item to rename
      setNewItemName(item.name); // Pre-fill input
      // Dialog opening logic would be here if using a separate dialog component
      // For simplicity, using browser prompt for now, replace with Dialog
      const updatedName = prompt(`Rename "${item.name}" to:`, item.name);
      if (updatedName && updatedName !== item.name) {
        setIsRenaming(true); // Set renaming status if needed
        dispatch(renameItemThunk({ itemId: item.id, newName: updatedName }))
          .unwrap()
          .catch((err) => alert(`Rename failed: ${err.message || err}`)) // Show alert on failure
          .finally(() => setIsRenaming(false)); // Reset status
      }
      setRenameItem(null); // Clear rename state
    },
    [dispatch]
  );

  const handleMoveItem = useCallback(
    (item: ItemType) => {
      console.log("Move action triggered for:", item.name);
      // TODO: Implement Move Dialog / Logic
      // 1. Open a dialog/selector to choose the target folder.
      // 2. Get the target folder ID (`newParentId`).
      // 3. Dispatch `moveItemThunk({ itemId: item.id, newParentId })`.
      alert("Move functionality not implemented yet.");
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (item: ItemType) => {
      // Confirmation is good practice
      if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
        dispatch(removeItem(item.id));
      }
    },
    [dispatch]
  );

  //   const handleItemClick = (item: Folder | File) => {
  //     if (isFolder(item)) {
  //       // Use type guard [cite: src/types/typeGuards.ts]
  //       navigateToFolder(item.id); // Navigate on folder click [cite: src/features/fileManager/hooks/useFileNavigation.ts]
  //     } else {
  //       // Handle file click (e.g., open preview, download) - Placeholder
  //       console.log("File clicked:", item.name);
  //     }
  //   };

  //   // Define the click handler for breadcrumbs using the fetched rootId
  const handleBreadcrumbClick = useCallback(
    (folderId: UUID | null) => {
      // Navigate to the clicked folder ID, or fall back to rootId if null is passed (e.g., from root breadcrumb)
      navigateToFolder(folderId ?? rootId);
    },
    [navigateToFolder, rootId]
  ); // Add rootId as dependency
  //   const handleBreadcrumbClick = (folderId: string) => {
  //     navigateViaBreadcrumb(folderId); // Navigate via breadcrumb click [cite: src/features/fileManager/hooks/useFileNavigation.ts]
  //   };

  // --- Rendering ---

  // Combine loading states
  const isLoading = isDisplayLoading || globalStatus === "loading";

  return (
    // Use dropzone props on the main container
    <Box
      {...getRootProps()}
      sx={{
        width: "100%",
        p: { xs: 2, sm: "0 3" },
        position: "relative",
        minHeight: "calc(100vh - 64px)" /* Adjust based on AppBar height */,
      }}
    >
      <Box sx={{ pt: 0.4 }}>
        <Typography variant="h4" component="div">
          {t("fileManager.myDocuments")}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          {t("fileManager.viewAndManage")}
        </Typography>
      </Box>
      {/* Render Breadcrumbs */}
      <BreadcrumbsNavigation
        segments={breadcrumbs}
        onNavigate={handleBreadcrumbClick}
      />

      {/* Header with tabs - Only 'All' tab is truly functional */}
      <TabHeader activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Upload Backdrop */}
      <UploadBackdrop
        isDragging={isDragging}
        isProcessing={isUploading}
        progress={uploadProgress}
        onDragOver={(e) => e.preventDefault()} // Basic handlers needed
        onDragLeave={(e) => e.preventDefault()}
        onDrop={(e) => {
          /* handled by getRootProps */
        }}
        onClose={() => {
          /* Logic to cancel upload if needed */
        }}
      />

      {/* Main Content Area */}
      <Box sx={{ position: "relative" }}>
        {/* Render only the 'all' tab content */}
        <TabPanel value={activeTab} index="all">
          <ItemContent
            items={items}
            breadcrumbs={breadcrumbs}
            isLoading={isLoading}
            error={displayError || uploadError || globalError} // Combine errors
            currentPage={displayProps.currentPage}
            totalItems={displayProps.totalItems}
            itemsPerPage={displayProps.itemsPerPage}
            activeTab={activeTab} // Pass active tab
            onPageChange={displayProps.handlePageChange}
            onFolderClick={(folder: Folder) => navigateToFolder(folder.id)}
            onDocumentClick={handleDocumentClick}
            // onBreadcrumbClick={handleBreadcrumbClick}
            onErrorClose={() => {
              setUploadError(null);
              // Optionally dispatch action to clear global error
            }}
            // Pass action handlers down
            onRenameItem={handleRenameItem}
            onMoveItem={handleMoveItem}
            onDeleteItem={handleDeleteItem}
          />
        </TabPanel>
        {/* Add other TabPanels here if/when their logic is implemented */}
        <TabPanel value={activeTab} index="recent">
          {" "}
          <Typography>Recent files not implemented.</Typography>{" "}
        </TabPanel>
        <TabPanel value={activeTab} index="shared">
          {" "}
          <Typography>Shared files not implemented.</Typography>{" "}
        </TabPanel>
        <TabPanel value={activeTab} index="favorites">
          {" "}
          <Typography>Favorite files not implemented.</Typography>{" "}
        </TabPanel>
      </Box>

      {/* Action FAB */}
      <ActionFab
        onCreateFolder={handleCreateFolderClick} // Open dialog
        onFileUpload={handleFileUpload} // Dispatch thunk
        onFolderUpload={handleFolderUpload} // Dispatch thunk
        isProcessing={isUploading} // Pass uploading state
      />

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onClose={() => setIsCreateFolderDialogOpen(false)}
        onCreate={handleCreateFolderSubmit} // Dispatch thunk
        parentId={currentFolderId} // Pass current folder ID for context if needed
      />

      {/* Rename Dialog (Example using simple state, ideally a separate component) */}
      {/* <Dialog open={!!renameItem} onClose={() => { setRenameItem(null); setNewItemName(''); }}>
           <DialogTitle>Rename {renameItem?.name}</DialogTitle>
           <DialogContent>
               <TextField autoFocus margin="dense" label="New Name" type="text" fullWidth variant="standard" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} disabled={isRenaming}/>
           </DialogContent>
           <DialogActions>
               <MuiButton onClick={() => { setRenameItem(null); setNewItemName(''); }} disabled={isRenaming}>Cancel</MuiButton>
               <MuiButton onClick={handleConfirmRename} disabled={isRenaming || !newItemName.trim() || newItemName === renameItem?.name}>Rename</MuiButton>
           </DialogActions>
       </Dialog> */}
      {/* // Note: handleConfirmRename implementation would dispatch renameItemThunk */}
    </Box>
  );
};

export default MyDocumentsPage; // Changed export name
