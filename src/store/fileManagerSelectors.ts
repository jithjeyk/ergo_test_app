import { createSelector } from '@reduxjs/toolkit'; // or from 'reselect'
import type { RootState } from './store';
import type { FileManagerState } from './fileManagerSlice';
import type { Folder, File, UUID, BreadcrumbSegment } from '../types/document';
// Base selector for the fileManager slice state
export const selectFileManagerState = (state: RootState): FileManagerState => state.fileManager;

// Selectors for basic state properties
export const selectAllItems = createSelector(
    [selectFileManagerState],
    (fileManagerState) => fileManagerState.items
);

export const selectCurrentFolderId = createSelector(
    [selectFileManagerState],
    (fileManagerState) => fileManagerState.currentFolderId
);

export const selectRootId = createSelector(
    [selectFileManagerState],
    (fileManagerState) => fileManagerState.rootId
);

export const selectStatus = createSelector(
    [selectFileManagerState],
    (fileManagerState) => fileManagerState.status
);

export const selectError = createSelector(
    [selectFileManagerState],
    (fileManagerState) => fileManagerState.error
);

// Derived Data Selectors

// Select the actual Folder object for the current folder
export const selectCurrentFolder = createSelector(
    [selectAllItems, selectCurrentFolderId],
    (items, currentFolderId): Folder | null => {
        if (currentFolderId === null) return null;
        const folder = items[currentFolderId];
        // Use type guard for safety, although currentFolderId should always point to a folder
        return folder?.type === 'folder' ? folder : null;
    }
);

// Select items (Folders and Files) within the current folder
export const selectCurrentFolderItems = createSelector(
    [selectAllItems, selectCurrentFolderId],
    (items, currentFolderId): (Folder | File)[] => {
        if (currentFolderId === null) return [];
        return Object.values(items).filter(item => item.parentId === currentFolderId);
        // Optional: Add sorting here if you want it centralized,
        // otherwise sort in the component/hook using this data.
        // .sort((a, b) => a.name.localeCompare(b.name));
    }
);

// Select breadcrumbs for the current folder
export const selectBreadcrumbs = createSelector(
    [selectAllItems, selectCurrentFolderId, selectRootId],
    (items, currentFolderId, rootId): BreadcrumbSegment[] => {
        const breadcrumbs: BreadcrumbSegment[] = [];
        let currentId = currentFolderId;

        while (currentId) {
            const item = items[currentId];
            if (!item) break; // Should not happen in consistent state

            // Use the imported BreadcrumbSegment type
            breadcrumbs.unshift({ id: item.id, name: item.name });

            if (currentId === rootId || !item.parentId) break; // Reached root
            currentId = item.parentId;
        }

        // Ensure root is always first if not already present and we aren't at root
         const rootItem = items[rootId]; // Get root item info
         if (rootId && rootItem && currentFolderId !== rootId && (!breadcrumbs.length || breadcrumbs[0].id !== rootId)) {
             breadcrumbs.unshift({ id: rootItem.id, name: rootItem.name });
         }

         // Handle case where breadcrumbs might still be empty (e.g., only root exists)
         if (breadcrumbs.length === 0 && rootId && rootItem) {
             breadcrumbs.push({ id: rootItem.id, name: rootItem.name });
         }


        return breadcrumbs;
    }
);

// Example selector to find an item by ID (useful for components)
export const selectItemById = (itemId: UUID | null) => createSelector(
    [selectAllItems],
    (items): Folder | File | null => (itemId ? items[itemId] : null) ?? null
);