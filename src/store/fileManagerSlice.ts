import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
    UUID,
    Folder as AppFolder, // Renamed to avoid conflict with native File type
    File as AppFile,     // Renamed to avoid conflict with native File type
    FileSystemItem,
} from '../types/document'; // Adjust path if necessary
import { isFolder as isFolderGuard } from '../types/typeGuards'; // Import type guard


// --- Interfaces (Keep existing FileManagerState) ---
export interface FileManagerState {
    items: Record<UUID, AppFolder | AppFile>; // Use renamed types
    currentFolderId: UUID | null;
    rootId: UUID;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// --- Constants & LocalStorage Utilities (Keep existing) ---
const LOCAL_STORAGE_KEY = "fileSystemState";
const ROOT_FOLDER_ID = "root";
const ROOT_FOLDER_NAME = "Home";

const saveStateToLocalStorage = (state: FileManagerState) => {
    // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
     try {
        const stateToSave = {
            items: state.items,
            currentFolderId: state.currentFolderId,
            rootId: state.rootId,
        };
        const serializedState = JSON.stringify(stateToSave);
        localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
    } catch (error) {
        console.error("Could not save state to localStorage:", error);
    }
};

const loadStateFromLocalStorage = (): Partial<FileManagerState> | undefined => {
    // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
    try {
        const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (serializedState === null) return undefined;
        const parsed = JSON.parse(serializedState);
        return typeof parsed === 'object' && parsed !== null && typeof parsed.items === 'object' ? parsed : undefined;
    } catch (error) {
        console.error("Could not load state from localStorage:", error);
        return undefined;
    }
};

// --- Default Initial State (Keep existing, but use renamed types) ---
const getDefaultInitialState = (): FileManagerState => {
     const defaultRoot: AppFolder = { // Use AppFolder
         id: ROOT_FOLDER_ID, name: ROOT_FOLDER_NAME, parentId: null, type: 'folder', path: '/',
         createdBy: 'system', createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(),
         lastAccessedAt: new Date().toISOString(), isStarred: false, shareStatus: 'private',
         collaborators: [], tags: [], customMetadata: {}, trashed: false,
         childCount: { files: 0, folders: 0, trashedItems: 0 }, size: 0
     };
     return {
        items: { [ROOT_FOLDER_ID]: defaultRoot },
        currentFolderId: ROOT_FOLDER_ID,
        rootId: ROOT_FOLDER_ID,
        status: 'idle',
        error: null,
     };
}

// --- Initial State (Keep existing) ---
const persistedState = loadStateFromLocalStorage();
const initialState: FileManagerState = {
    ...getDefaultInitialState(),
    ...persistedState,
    status: 'idle',
    error: null,
};

// --- Async Thunks ---

// Keep existing initializeFileSystem and createFolderThunk [cite: src-new/store/fileManagerSlice.ts]
export const initializeFileSystem = createAsyncThunk(
    'fileManager/initialize',
    // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
     (_, { getState }) => {
        const state = getState() as { fileManager: FileManagerState };
        return state.fileManager.items;
    }
);

export const createFolderThunk = createAsyncThunk(
    'fileManager/createFolder',
    // ... (existing implementation, ensure it uses AppFolder type) [cite: src-new/store/fileManagerSlice.ts]
    async (params: { name: string; parentId: UUID }, { getState, dispatch, rejectWithValue }) => {
        const { name, parentId } = params;
        const state = getState() as { fileManager: FileManagerState };
        const parentFolder = state.fileManager.items[parentId];

        const trimmedName = name.trim();
        if (!trimmedName) return rejectWithValue("Folder name cannot be empty.");
        if (/[\\/:*?"<>|]/.test(trimmedName)) return rejectWithValue("Folder name contains invalid characters.");
        if (!parentFolder || !isFolderGuard(parentFolder)) return rejectWithValue("Parent folder not found or is not a folder.");
        const nameLower = trimmedName.toLowerCase();
        const parentItems = Object.values(state.fileManager.items).filter(i => i.parentId === parentId);
        if (parentItems.some(item => item.name.toLowerCase() === nameLower)) {
             return rejectWithValue(`An item named "${trimmedName}" already exists.`);
        }

        try {
            const parentPath = parentFolder.path === '/' ? '' : parentFolder.path;
            const newPath = `${parentPath}/${trimmedName}`;
            const newFolder: AppFolder = { // Use AppFolder type
                id: `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                name: trimmedName, parentId: parentId, type: 'folder', path: newPath,
                createdBy: 'local_user', createdAt: new Date().toISOString(), modifiedAt: new Date().toISOString(),
                lastAccessedAt: new Date().toISOString(), isStarred: false, shareStatus: 'private',
                collaborators: [], tags: [], customMetadata: {}, trashed: false,
                childCount: { files: 0, folders: 0, trashedItems: 0 }, size: 0, color: '#1E90FF'
            };

            dispatch(addItem(newFolder));
            return newFolder;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create folder');
        }
    }
);

// *** NEW: Thunk for uploading files ***
export const uploadFilesThunk = createAsyncThunk(
    'fileManager/uploadFiles',
    async (payload: { files: AppFile[] }, { dispatch, rejectWithValue }) => {
        const { files } = payload;
        if (!files || files.length === 0) {
            return rejectWithValue("No files provided for upload.");
        }
        try {
            // In a real app, you might perform API calls here first.
            // For now, we directly add them to the local state.
            files.forEach(file => {
                // Optional: Add validation or checks here
                dispatch(addItem(file));
            });
            // Persist state after adding all items
            // saveStateToLocalStorage is called within the reducer now
            return files; // Return the added files on success
        } catch (error: any) {
            console.error("Error uploading files:", error);
            return rejectWithValue(error.message || 'Failed to upload files');
        }
    }
);

// *** NEW: Thunk for uploading folders (including files within them) ***
export const uploadFolderThunk = createAsyncThunk(
    'fileManager/uploadFolder',
    async (payload: { files: AppFile[], folders: AppFolder[] }, { dispatch, rejectWithValue }) => {
        const { files, folders } = payload;
        if ((!files || files.length === 0) && (!folders || folders.length === 0)) {
            return rejectWithValue("No items provided for folder upload.");
        }
        try {
            // Add folders first to ensure parent folders exist before files are added (if needed)
            folders?.forEach(folder => {
                dispatch(addItem(folder));
            });
            // Then add files
            files?.forEach(file => {
                dispatch(addItem(file));
            });
            // Persist state after adding all items
            // saveStateToLocalStorage is called within the reducer now
            return { files, folders }; // Return added items on success
        } catch (error: any) {
            console.error("Error uploading folder structure:", error);
            return rejectWithValue(error.message || 'Failed to upload folder structure');
        }
    }
);

// *** NEW: Thunk for renaming an item ***
export const renameItemThunk = createAsyncThunk(
    'fileManager/renameItem',
    async (payload: { itemId: UUID; newName: string }, { getState, dispatch, rejectWithValue }) => {
        const { itemId, newName } = payload;
        const state = getState() as { fileManager: FileManagerState }; // Use RootState if available
        const itemToRename = state.fileManager.items[itemId];
        const trimmedName = newName.trim();

        // --- Validations ---
        if (!itemToRename) return rejectWithValue("Item not found.");
        if (!trimmedName) return rejectWithValue("New name cannot be empty.");
        if (/[\\/:*?"<>|]/.test(trimmedName)) return rejectWithValue("New name contains invalid characters.");
        if (itemToRename.name === trimmedName) return itemToRename; // No change needed

        // Check for name conflict in the same parent folder
        const siblings = Object.values(state.fileManager.items).filter(i => i.parentId === itemToRename.parentId && i.id !== itemId);
        if (siblings.some(item => item.name.toLowerCase() === trimmedName.toLowerCase())) {
             return rejectWithValue(`An item named "${trimmedName}" already exists in this folder.`);
        }
        // --- End Validations ---

        try {
            // Calculate new path (assuming parent path is correct in parent item or calculable)
            let newPath = trimmedName; // Default for root items if parentId is null
            if (itemToRename.parentId) {
                 const parentItem = state.fileManager.items[itemToRename.parentId];
                 if (parentItem) {
                     const parentPath = parentItem.path === '/' ? '' : parentItem.path;
                     newPath = `${parentPath}/${trimmedName}`;
                 } else {
                      // Fallback or error if parent not found, though state should be consistent
                      console.warn(`Parent folder ${itemToRename.parentId} not found for item ${itemId}. Path may be incorrect.`);
                      // Use root relative path as fallback
                      newPath = `/${trimmedName}`;
                 }
            } else {
                 newPath = `/${trimmedName}`; // Item is in root
            }


            // Prepare update payload
            const updatePayload: Partial<AppFile | AppFolder> & { id: UUID } = {
                id: itemId,
                name: trimmedName,
                path: newPath, // Update path as well
                modifiedAt: new Date().toISOString(),
            };

            dispatch(updateItem(updatePayload));

            // Note: If renaming a folder, descendant paths stored in state might become outdated.
            // It's often better to calculate paths dynamically using selectors based on parentage.
            // If direct path storage is required, a recursive update of descendants would be needed here.

            return state.fileManager.items[itemId]; // Return the updated item from state
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to rename item');
        }
    }
);

// *** NEW: Thunk for moving an item ***
export const moveItemThunk = createAsyncThunk(
    'fileManager/moveItem',
    async (payload: { itemId: UUID; newParentId: UUID }, { getState, dispatch, rejectWithValue }) => {
        const { itemId, newParentId } = payload;
        const state = getState() as { fileManager: FileManagerState }; // Use RootState if available
        const itemToMove = state.fileManager.items[itemId];
        const newParentFolder = state.fileManager.items[newParentId];

        // --- Validations ---
        if (!itemToMove) return rejectWithValue("Item to move not found.");
        if (!newParentFolder) return rejectWithValue("Target folder not found.");
        if (!isFolderGuard(newParentFolder)) return rejectWithValue("Target destination is not a folder.");
        if (itemToMove.parentId === newParentId) return itemToMove; // Already in the target folder
        if (itemToMove.id === newParentId) return rejectWithValue("Cannot move an item into itself.");

        // Prevent moving a folder into one of its own descendants
        if (isFolderGuard(itemToMove)) {
            let currentParentId: UUID | null = newParentFolder.parentId;
            while (currentParentId) {
                if (currentParentId === itemToMove.id) {
                    return rejectWithValue("Cannot move a folder into one of its own subfolders.");
                }
                const ancestor = state.fileManager.items[currentParentId];
                currentParentId = ancestor ? ancestor.parentId : null;
            }
        }

        // Check for name conflict in the target folder
        const siblings = Object.values(state.fileManager.items).filter(i => i.parentId === newParentId && i.id !== itemId);
         if (siblings.some(item => item.name.toLowerCase() === itemToMove.name.toLowerCase())) {
             return rejectWithValue(`An item named "${itemToMove.name}" already exists in the target folder.`);
        }
        // --- End Validations ---

        try {
            // Calculate new path
            const parentPath = newParentFolder.path === '/' ? '' : newParentFolder.path;
            const newPath = `${parentPath}/${itemToMove.name}`;

            // Prepare update payload
             const updatePayload: Partial<AppFile | AppFolder> & { id: UUID } = {
                id: itemId,
                parentId: newParentId,
                path: newPath, // Update path based on new parent
                modifiedAt: new Date().toISOString(),
            };

            dispatch(updateItem(updatePayload));

             // Note: Similar to rename, if moving a folder, descendant paths stored in state might become outdated.
             // Dynamic path calculation via selectors is generally preferred.

            return state.fileManager.items[itemId]; // Return the updated item
        } catch (error: any) {
             return rejectWithValue(error.message || 'Failed to move item');
        }
    }
);

// --- Slice Definition ---
const fileManagerSlice = createSlice({
    name: 'fileManager',
    initialState,
    reducers: {
        // Keep existing reducers: setCurrentFolderId, addItem, updateItem, removeItem, setStatus, setError
        // Ensure addItem, updateItem, removeItem use AppFile/AppFolder types where appropriate
        setCurrentFolderId: (state, action: PayloadAction<UUID | null>) => {
            // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
            const targetId = action.payload;
            if (targetId === null || (state.items[targetId] && isFolderGuard(state.items[targetId]))) {
                state.currentFolderId = targetId;
                state.error = null;
                saveStateToLocalStorage(state);
            } else if (targetId === state.rootId && state.items[targetId]) {
                state.currentFolderId = targetId;
                state.error = null;
                saveStateToLocalStorage(state);
            } else {
                console.warn(`Attempted to navigate to non-existent or non-folder ID: ${targetId}`);
            }
        },
        addItem: (state, action: PayloadAction<AppFolder | AppFile>) => { // Use AppFolder | AppFile
            // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
             const item = action.payload;
            state.items[item.id] = item;
            saveStateToLocalStorage(state);
        },
        // updateItem: (state, action: PayloadAction<Partial<AppFolder | AppFile> & { id: UUID }>) => { // Use AppFolder | AppFile
        //    // ... (existing implementation, ensure keys match AppFolder/AppFile) [cite: src-new/store/fileManagerSlice.ts]
        //      const updatePayload = action.payload;
        //     const itemId = updatePayload.id;
        //     if (state.items[itemId]) {
        //         const itemToUpdate = state.items[itemId];
        //         for (const key in updatePayload) {
        //             if (key !== 'id' && key in itemToUpdate) {
        //                 if (key !== 'type') {
        //                    (itemToUpdate as any)[key] = (updatePayload as any)[key];
        //                 } else if (key === 'type' && updatePayload.type === itemToUpdate.type) {
        //                    (itemToUpdate as any)[key] = (updatePayload as any)[key];
        //                 }
        //             }
        //         }
        //         itemToUpdate.modifiedAt = new Date().toISOString();
        //         saveStateToLocalStorage(state);
        //     } else {
        //         console.warn(`Attempted to update non-existent item with ID: ${itemId}`);
        //     }
        // },
        updateItem: (state, action: PayloadAction<Partial<AppFolder | AppFile> & { id: UUID }>) => {
            const updatePayload = action.payload;
            const itemId = updatePayload.id;
            if (state.items[itemId]) {
                // Use Object.assign for cleaner partial update merging
                Object.assign(state.items[itemId], updatePayload);
                // Always update modified timestamp
                state.items[itemId].modifiedAt = new Date().toISOString();
                saveStateToLocalStorage(state);
            } else {
                console.warn(`Attempted to update non-existent item with ID: ${itemId}`);
            }
        },
        removeItem: (state, action: PayloadAction<UUID>) => {
            // ... (existing implementation) [cite: src-new/store/fileManagerSlice.ts]
            const itemIdToRemove = action.payload;
            const item = state.items[itemIdToRemove];

            if (!item) return;

            let idsToRemove = [itemIdToRemove];
            if (isFolderGuard(item)) {
                const findDescendantIds = (parentId: UUID): UUID[] => {
                    let descendants: UUID[] = [];
                    Object.values(state.items).forEach(child => {
                        if (child.parentId === parentId) {
                            descendants.push(child.id);
                            if (isFolderGuard(child)) {
                                descendants = descendants.concat(findDescendantIds(child.id));
                            }
                        }
                    });
                    return descendants;
                };
                idsToRemove = idsToRemove.concat(findDescendantIds(itemIdToRemove));
            }

            idsToRemove.forEach(id => {
                delete state.items[id];
            });

            if (idsToRemove.includes(state.currentFolderId ?? '')) {
                 state.currentFolderId = item.parentId ?? state.rootId;
                 if (!state.items[state.currentFolderId ?? '']) {
                     state.currentFolderId = state.rootId;
                 }
            }
            saveStateToLocalStorage(state);
        },
        setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
            state.status = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.status = 'failed';
        },
    },
    extraReducers: (builder) => {
        builder
            // Existing thunks [cite: src-new/store/fileManagerSlice.ts]
            .addCase(initializeFileSystem.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(initializeFileSystem.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(initializeFileSystem.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'Initialization failed'; })
            .addCase(createFolderThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(createFolderThunk.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(createFolderThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'Folder creation failed'; })

            // *** NEW: Handle uploadFilesThunk states ***
            .addCase(uploadFilesThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(uploadFilesThunk.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(uploadFilesThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'File upload failed'; })

             // *** NEW: Handle uploadFolderThunk states ***
            .addCase(uploadFolderThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
            .addCase(uploadFolderThunk.fulfilled, (state) => { state.status = 'succeeded'; })
            .addCase(uploadFolderThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'Folder upload failed'; })
             // *** NEW: Handle renameItemThunk states ***
             .addCase(renameItemThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
             .addCase(renameItemThunk.fulfilled, (state) => { state.status = 'succeeded'; })
             .addCase(renameItemThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'Rename failed'; })
 
             // *** NEW: Handle moveItemThunk states ***
             .addCase(moveItemThunk.pending, (state) => { state.status = 'loading'; state.error = null; })
             .addCase(moveItemThunk.fulfilled, (state) => { state.status = 'succeeded'; })
             .addCase(moveItemThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string ?? 'Move failed'; });
    },
});

// --- Export Actions and Reducer ---
export const {
    setCurrentFolderId,
    addItem,
    updateItem,
    removeItem,
    setStatus,
    setError,
} = fileManagerSlice.actions;

export default fileManagerSlice.reducer;