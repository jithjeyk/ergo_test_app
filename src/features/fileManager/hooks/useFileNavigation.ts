import { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentFolderId } from '../../../store/fileManagerSlice'; // Adjust path
import { selectCurrentFolderId, selectBreadcrumbs, selectRootId } from '../../../store/fileManagerSelectors'; // Adjust path
import type { AppDispatch } from '../../../store/store'; // Adjust path
import type { UUID } from "../../../types/document";

export const useFileNavigation = () => {
    const dispatch: AppDispatch = useDispatch();
    const currentFolderId = useSelector(selectCurrentFolderId);
    const breadcrumbs = useSelector(selectBreadcrumbs);
    const rootId = useSelector(selectRootId);

    const navigateToFolder = useCallback(
        (folderId: UUID) => {
            // Basic check to prevent unnecessary dispatches if already there
            if (folderId !== currentFolderId) {
               dispatch(setCurrentFolderId(folderId));
            }
        },
        [dispatch, currentFolderId]
    );

    // navigateViaBreadcrumb is essentially the same as navigateToFolder now
    const navigateViaBreadcrumb = navigateToFolder;

    const navigateUp = useCallback(() => {
        // Breadcrumbs selector already gives us the path
        if (breadcrumbs.length > 1) {
            const parentIndex = breadcrumbs.length - 2;
            dispatch(setCurrentFolderId(breadcrumbs[parentIndex].id));
        } else if (currentFolderId !== rootId) {
            // Fallback if breadcrumbs logic somehow misses the immediate parent
             dispatch(setCurrentFolderId(rootId));
        }
    }, [dispatch, breadcrumbs, currentFolderId, rootId]);

    const navigateToRoot = useCallback(() => {
        if (currentFolderId !== rootId) {
            dispatch(setCurrentFolderId(rootId));
        }
    }, [dispatch, currentFolderId, rootId]);

    return {
        currentFolderId,
        breadcrumbs,
        navigateToFolder,
        navigateViaBreadcrumb,
        navigateUp,
        navigateToRoot,
    };
};