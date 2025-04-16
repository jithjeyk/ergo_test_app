import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from 'react-redux';
import { selectCurrentFolderItems, selectStatus, selectError } from '../../../store/fileManagerSelectors'; // Adjust path
import type { Folder, File } from "../../../types/document"; // Adjust path
import { isFolder } from "../../../types/typeGuards"; // Assuming you create this type guard based on 'type' property

// Type guard example (place in src/types/typeGuards.ts or similar)
/*
import type { FileSystemItem, Folder, File } from "./document";
export function isFolder(item: FileSystemItem | Folder | File): item is Folder {
    return item.type === 'folder';
}
*/

type FolderItem = Folder | File; // Union type based on document.ts

// Types for local state within the hook
// type QueryType = "all"; // Extend later if needed (recent, shared etc requires more state/selectors)
interface SortOptions {
    field: keyof FolderItem | 'type'; // Allow sorting by 'type' discriminator
    direction: "asc" | "desc";
}

// Hook options (simplified for now)
interface FileDisplayOptions {
    itemsPerPage?: number;
    initialSort?: SortOptions;
}

const DEFAULT_ITEMS_PER_PAGE = 15;

export const useFileDisplay = (options: FileDisplayOptions = {}) => {
    const {
        itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
        initialSort = { field: "type", direction: "asc" }, // Default sort: Folders first, then by name
    } = options;

    // Select data from Redux store
    const currentFolderItems = useSelector(selectCurrentFolderItems);
    const status = useSelector(selectStatus);
    const error = useSelector(selectError); // Use Redux error state

    // Local state for display logic (pagination, sorting)
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOptions, setSortOptions] = useState<SortOptions>(initialSort);

    const sortItems = (items: FolderItem[], sortOpts: SortOptions): FolderItem[] => {
      return [...items].sort((a, b) => {
          const isFolderA = isFolder(a);
          const isFolderB = isFolder(b);

          // --- Folders First Logic ---
          if (sortOpts.field !== 'type') { // If primary sort isn't type, still put folders first
              if (isFolderA !== isFolderB) {
                  return isFolderA ? -1 : 1;
              }
          }

          // --- Primary Sort Field ---
          let compareResult = 0;
          const field = sortOpts.field;

          if (field === 'type') {
              compareResult = isFolderA ? -1 : (isFolderB ? 1 : 0); // Folders first
          } else if (field === 'name') {
              compareResult = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          } else if (field === 'modifiedAt' || field === 'createdAt' || field === 'lastAccessedAt') {
              // Ensure field exists and is comparable (ISO strings work directly)
              const timeA = a[field] || '';
              const timeB = b[field] || '';
              compareResult = timeA.localeCompare(timeB);
          } else if (field === 'size') {
               // Handle potential undefined size or different types if necessary
              const sizeA = a.size ?? 0;
              const sizeB = b.size ?? 0;
              compareResult = sizeA - sizeB;
          }
          // Add other sortable fields from document.ts as needed

           // If primary sort is equal, fallback to name sort
          if (compareResult === 0 && field !== 'name') {
               compareResult = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          }


          return sortOpts.direction === 'asc' ? compareResult : -compareResult;
      });
  };

    // Derived state: Sort and Paginate the items from Redux
    const processedItems = useMemo(() => {
         // Apply sorting
        const sortedItems = sortItems(currentFolderItems, sortOptions);
        // Apply pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedItems.slice(startIndex, endIndex);
    }, [currentFolderItems, sortOptions, currentPage, itemsPerPage]);

    const totalItems = useMemo(() => currentFolderItems.length, [currentFolderItems]);

    // Reset page when total items change significantly (e.g., folder navigation)
    useEffect(() => {
        setCurrentPage(1);
    }, [currentFolderItems]); // Resets on folder change implicitly

  

    const handlePageChange = useCallback(
        (newPage: number) => {
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (newPage >= 1 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        },
        [totalItems, itemsPerPage]
    );

    const changeSort = useCallback((field: SortOptions['field']) => {
        setSortOptions(prev => ({
            field,
            direction: (prev.field === field && prev.direction === 'asc') ? 'desc' : 'asc'
        }));
        setCurrentPage(1); // Reset to first page on sort change
    }, []);

    // Refresh is now implicit via Redux state updates.
    // If needed, could dispatch initializeFileSystem or a specific refresh thunk.
    const refreshDisplay = useCallback(() => {
        // console.log("Refresh triggered - data updates via Redux");
        // dispatch(initializeFileSystem()); // Example if needed
    }, []);


    return {
        items: processedItems, // Renamed from displayedItems for clarity
        isLoading: status === 'loading',
        error, // Use the error state from Redux
        currentPage,
        totalItems,
        itemsPerPage,
        sortOptions,
        handlePageChange,
        changeSort,
        refreshDisplay,
    };
};