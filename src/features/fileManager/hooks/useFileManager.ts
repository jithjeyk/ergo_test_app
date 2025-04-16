import { useState, useEffect, useCallback } from "react";
import {
  FolderItem,
  BreadcrumbSegment,
  Folder,
  Document,
} from "../../../types/types";

const INITIAL_FILE_SYSTEM: Folder = {
  id: "root",
  name: "Home",
  parentId: null,
  time: "2 hours ago",
  items: [
    // Your initial file system structure remains unchanged
    {
      id: "project",
      name: "project",
      parentId: "root",
      time: "2 hours ago",
      items: [
        {
          id: "astra",
          name: "astra",
          parentId: "project",
          time: "2 hours ago",
          items: [
            {
              id: "chatboat",
              name: "chatboat",
              parentId: "astra",
              time: "2 hours ago",
              items: [
                {
                  id: "ai_chatboat",
                  name: "ai chatboat",
                  parentId: "chatboat",
                  time: "2 hours ago",
                  items: [
                    {
                      id: "doc1",
                      name: "ChatbotSpec.pdf",
                      parentId: "ai_chatboat",
                      type: "pdf",
                      size: "1.2 MB",
                      time: "2 hours ago",
                      iconColor: "#4285f4",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "folder1",
      name: "Documents",
      parentId: "root",
      time: "2 hours ago",
      items: [
        {
          id: "doc2",
          name: "Resume.pdf",
          parentId: "folder1",
          type: "pdf",
          size: "1.2 MB",
          time: "2 hours ago",
          iconColor: "#4285f4",
        },
        {
          id: "doc3",
          name: "Notes.docx",
          parentId: "folder1",
          type: "docx",
          size: "0.5 MB",
          time: "1 day ago",
          iconColor: "#0f9d58",
        },
      ],
    },
  ],
};

const ROOT_BREADCRUMB: BreadcrumbSegment = { id: "root", name: "Home" };

const loadFileSystem = (): Folder => {
  const stored = localStorage.getItem("fileSystem");
  return stored ? JSON.parse(stored) : INITIAL_FILE_SYSTEM;
};

const saveFileSystem = (fs: Folder) => {
  localStorage.setItem("fileSystem", JSON.stringify(fs));
};

const findFolder = (fs: Folder, folderId: string | null): Folder | null => {
  if (fs.id === folderId || (folderId === null && fs.id === "root")) return fs;
  for (const item of fs.items) {
    if ("items" in item) {
      const found = findFolder(item as Folder, folderId);
      if (found) return found;
    }
  }
  return null;
};

// Collect all items recursively for non-'all' query types
const collectAllItems = (folder: Folder): FolderItem[] => {
  const allItems: FolderItem[] = [];

  const traverse = (current: Folder) => {
    // Add items directly without spread operator to avoid unnecessary array creation
    for (const item of current.items) {
      allItems.push(item);
      if ("items" in item) {
        traverse(item as Folder);
      }
    }
  };

  traverse(folder);
  return allItems;
};

interface FileManagerOptions {
  initialFolderId?: string | null;
  queryType?: "all" | "recent" | "shared" | "favorites";
  itemsPerPage?: number;
}

export const useFileManager = (options: FileManagerOptions = {}) => {
  const {
    initialFolderId = null,
    queryType = "all",
    itemsPerPage = 8,
  } = options;

  const folderColors = [
    "#FF0000",
    "#1E90FF",
    "#4169E1",
    "#32CD32",
    "#228B22",
    "#FF8C00",
    "#D2691E",
    "#9932CC",
    "#8A2BE2",
    "#BA55D3",
    "#DA70D6",
    "#A9A9A9",
  ];

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(
    initialFolderId
  );
  const [items, setItems] = useState<FolderItem[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([
    ROOT_BREADCRUMB,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Move the memoizedFindFolder inside the hook
  const memoizedFindFolder = useCallback(
    (folderId: string | null) => findFolder(loadFileSystem(), folderId),
    []
  );

  const buildBreadcrumbs = useCallback(
    (fs: Folder, folderId: string | null): BreadcrumbSegment[] => {
      // Always start with root
      const breadcrumbs: BreadcrumbSegment[] = [ROOT_BREADCRUMB];

      if (folderId === null || folderId === "root") {
        return breadcrumbs;
      }

      // Build path from current folder back to root
      const path: BreadcrumbSegment[] = [];
      let currentFolder = memoizedFindFolder(folderId);

      while (currentFolder && currentFolder.id !== "root") {
        path.unshift({ id: currentFolder.id, name: currentFolder.name });
        currentFolder = currentFolder.parentId
          ? memoizedFindFolder(currentFolder.parentId)
          : null;
      }

      // Combine root with the path
      return [...breadcrumbs, ...path];
    },
    [memoizedFindFolder]
  );

  const fetchItems = useCallback(
    async (folderId: string | null, page: number, currentQueryType: string) => {
      setIsLoading(true);
      setError(null);
      setItems([]);

      try {
        const fs = loadFileSystem();
        let fetchedItems: FolderItem[] = [];

        if (currentQueryType === "all") {
          const folder = memoizedFindFolder(folderId);
          if (folder) {
            fetchedItems = folder.items;
            setBreadcrumbs(buildBreadcrumbs(fs, folderId));
          } else {
            setError("Folder not found");
            setBreadcrumbs([ROOT_BREADCRUMB]);
          }
        } else {
          // For other query types, collect all items recursively
          fetchedItems = collectAllItems(fs);
          setBreadcrumbs([ROOT_BREADCRUMB]);

          // Apply basic filtering based on queryType (simulated for local storage)
          switch (currentQueryType) {
            case "recent":
              fetchedItems = fetchedItems.filter(
                (item) =>
                  item.time && ["2 hours ago", "1 day ago"].includes(item.time)
              );
              break;
            case "shared":
              // Simulated filter (could be enhanced with a shared property)
              fetchedItems = fetchedItems.filter((item) =>
                item.name.toLowerCase().includes("spec")
              );
              break;
            case "favorites":
              // Simulated filter (could be enhanced with a favorite property)
              fetchedItems = fetchedItems.filter((item) =>
                item.name.toLowerCase().includes("resume")
              );
              break;
          }
        }

        // Pagination logic
        setTotalItems(fetchedItems.length);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = fetchedItems.slice(startIndex, endIndex);

        setItems(paginatedItems);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "An unexpected error occurred";
        console.error("Fetch items error:", err);
        setError(errorMessage);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, memoizedFindFolder, buildBreadcrumbs]
  );

  useEffect(() => {
    fetchItems(currentFolderId, currentPage, queryType);
  }, [currentFolderId, currentPage, queryType, fetchItems]);

  const navigateToFolder = useCallback(
    (folderId: string | null) => {
      if (folderId === currentFolderId) return; // Prevent redundant navigation

      const fs = loadFileSystem();
      const folder = memoizedFindFolder(folderId);

      if (folder) {
        // Correctly rebuild breadcrumbs based on the folder path
        setBreadcrumbs(buildBreadcrumbs(fs, folderId));
        setCurrentFolderId(folderId);
        setCurrentPage(1); // Reset to first page when navigating
      } else {
        setError("Folder not found");
      }
    },
    [currentFolderId, memoizedFindFolder, buildBreadcrumbs]
  );

  const navigateViaBreadcrumb = useCallback(
    (folderId: string | null, index: number) => {
      if (index < 0 || index >= breadcrumbs.length) {
        setError("Invalid breadcrumb index");
        return;
      }
      setCurrentPage(1);
      setCurrentFolderId(folderId);
      setBreadcrumbs((prev) => prev.slice(0, index + 1));
    },
    [breadcrumbs]
  );

  const refreshFolder = useCallback(() => {
    fetchItems(currentFolderId, currentPage, queryType);
  }, [currentFolderId, currentPage, queryType, fetchItems]);

  const createFolder = useCallback(
    async (name: string): Promise<boolean> => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("Folder name cannot be empty");
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        const fs = loadFileSystem();
        const parentFolder = findFolder(fs, currentFolderId);
        if (!parentFolder) {
          setError("Current folder not found");
          return false;
        }
        // console.log("Parent folder:", parentFolder);
        // console.log("Name:", name);
        // Check if a folder with the same name already exists

        if (parentFolder.items.some((item) => item.name === trimmedName)) {
          console.log("Folder with this name already exists");

          setError("Folder with this name already exists");
          return false;
        }

        // Count existing folders to determine the color index
        const existingFolderCount = parentFolder.items.filter(
          (item) => "items" in item
        ).length;
        const colorIndex = existingFolderCount % folderColors.length;

        const newFolder: Folder = {
          id: `folder_${Date.now()}`,
          name: trimmedName,
          parentId: currentFolderId,
          time: new Date().toLocaleString(),
          iconColor: folderColors[colorIndex], // Assign color based on existing folder count
          items: [],
        };

        parentFolder.items.push(newFolder);
        saveFileSystem(fs);
        refreshFolder();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during folder creation";
        console.error("Create folder error:", err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentFolderId, refreshFolder, setError]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage > 0 && newPage <= Math.ceil(totalItems / itemsPerPage)) {
        setCurrentPage(newPage);
      }
    },
    [totalItems, itemsPerPage]
  );
  // New function to handle file uploads
  const uploadFiles = useCallback(
    async (files: File[]): Promise<boolean> => {
      if (files.length === 0) {
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fs = loadFileSystem();
        const currentFolder = findFolder(fs, currentFolderId);

        if (!currentFolder) {
          setError("Current folder not found");
          return false;
        }

        // Process each file
        for (const file of files) {
          const fileSize = formatFileSize(file.size);
          const fileType =
            file.name.split(".").pop()?.toLowerCase() || "unknown";

          // Create a document object for the file
          const newDocument: Document = {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            parentId: currentFolder.id,
            type: fileType,
            size: fileSize,
            time: new Date().toLocaleString(),
            iconColor: getIconColorForFileType(fileType),
            // In a real app, you might add a URL or reference to the stored file
          };

          // Add the document to the current folder
          currentFolder.items.push(newDocument);
        }

        // Save updated file system and refresh the view
        saveFileSystem(fs);
        refreshFolder();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during file upload";
        console.error("Upload files error:", err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentFolderId, refreshFolder]
  );

  // New function to handle folder uploads
  const uploadFolder = useCallback(
    async (files: File[]): Promise<boolean> => {
      if (files.length === 0) {
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fs = loadFileSystem();
        const currentFolder = findFolder(fs, currentFolderId);

        if (!currentFolder) {
          setError("Current folder not found");
          return false;
        }

        // Extract folder structure from files
        const folderStructure = new Map<string, Folder>();
        const rootFolderName = extractRootFolderName(files);

        if (!rootFolderName) {
          // If can't determine root folder, treat as individual files
          return uploadFiles(files);
        }

        // Create root folder or find if already exists
        let rootFolder = currentFolder.items.find(
          (item) => "items" in item && item.name === rootFolderName
        ) as Folder | undefined;

        if (!rootFolder) {
          // Determine color for new folder
          const existingFolderCount = currentFolder.items.filter(
            (item) => "items" in item
          ).length;
          const colorIndex = existingFolderCount % folderColors.length;

          rootFolder = {
            id: `folder_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            name: rootFolderName,
            parentId: currentFolder.id,
            time: new Date().toLocaleString(),
            iconColor: folderColors[colorIndex],
            items: [],
          };

          currentFolder.items.push(rootFolder);
          folderStructure.set(rootFolderName, rootFolder);
        } else {
          folderStructure.set(rootFolderName, rootFolder);
        }

        // Process files and create folder structure
        for (const file of files) {
          const pathParts = file.webkitRelativePath
            ? file.webkitRelativePath.split("/")
            : file.name.split("/");

          if (pathParts.length <= 1) {
            // Skip files without path information
            continue;
          }

          // Create or find folders for each path segment
          let currentPathFolder = rootFolder;
          const fileName = pathParts[pathParts.length - 1];

          // Create nested folder structure (skip root folder and filename)
          for (let i = 1; i < pathParts.length - 1; i++) {
            const folderName = pathParts[i];
            const folderPath = pathParts.slice(0, i + 1).join("/");

            // Check if we've already created this folder
            if (folderStructure.has(folderPath)) {
              currentPathFolder = folderStructure.get(folderPath)!;
              continue;
            }

            // Find if folder already exists in current path
            let childFolder = currentPathFolder.items.find(
              (item) => "items" in item && item.name === folderName
            ) as Folder | undefined;

            if (!childFolder) {
              // Create new folder
              childFolder = {
                id: `folder_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}_${i}`,
                name: folderName,
                parentId: currentPathFolder.id,
                time: new Date().toLocaleString(),
                iconColor:
                  folderColors[Math.floor(Math.random() * folderColors.length)],
                items: [],
              };

              currentPathFolder.items.push(childFolder);
            }

            // Store reference and update current folder
            folderStructure.set(folderPath, childFolder);
            currentPathFolder = childFolder;
          }

          // Add the actual file to the deepest folder
          const fileSize = formatFileSize(file.size);
          const fileType =
            fileName.split(".").pop()?.toLowerCase() || "unknown";

          const newDocument: Document = {
            id: `file_${Date.now()}_${Math.random()
              .toString(36)
              .substr(2, 9)}_${fileName}`,
            name: fileName,
            parentId: currentPathFolder.id,
            type: fileType,
            size: fileSize,
            time: new Date().toLocaleString(),
            iconColor: getIconColorForFileType(fileType),
          };

          currentPathFolder.items.push(newDocument);
        }

        // Save updated file system and refresh
        saveFileSystem(fs);
        refreshFolder();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An error occurred during folder upload";
        console.error("Upload folder error:", err);
        setError(errorMessage);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [currentFolderId, refreshFolder, uploadFiles]
  );

  // Helper function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function to determine icon color based on file type
  const getIconColorForFileType = (fileType: string): string => {
    const colorMap: Record<string, string> = {
      pdf: "#FF0000", // Red
      doc: "#1E90FF", // Dodger Blue
      docx: "#4169E1", // Royal Blue
      xls: "#32CD32", // Lime Green
      xlsx: "#228B22", // Forest Green
      ppt: "#FF8C00", // Dark Orange
      pptx: "#D2691E", // Chocolate
      jpg: "#9932CC", // Dark Orchid
      jpeg: "#8A2BE2", // Blue Violet
      png: "#BA55D3", // Medium Orchid
      gif: "#DA70D6", // Orchid
      txt: "#A9A9A9", // Dark Gray
    };

    return colorMap[fileType] || "#A9A9A9";
  };

  // Helper function to extract root folder name from uploaded files
  const extractRootFolderName = (files: File[]): string | null => {
    // Try to get the folder name from webkitRelativePath
    for (const file of files) {
      if (file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split("/");
        if (pathParts.length > 1) {
          return pathParts[0]; // First segment is the root folder
        }
      }
    }

    // Fallback: Try to infer from file name patterns
    const commonPrefix = findCommonPrefix(files.map((f) => f.name));
    if (commonPrefix && commonPrefix.includes("/")) {
      return commonPrefix.split("/")[0];
    }

    return null;
  };

  // Helper function to find common prefix in a list of strings
  const findCommonPrefix = (strings: string[]): string | null => {
    if (!strings.length) return null;
    if (strings.length === 1) return strings[0].split("/")[0];

    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (strings[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (!prefix) return null;
      }
    }

    return prefix;
  };

  return {
    currentFolderId,
    items,
    breadcrumbs,
    isLoading,
    error,
    navigateToFolder,
    navigateViaBreadcrumb,
    refreshFolder,
    createFolder,
    setError,
    currentPage,
    totalItems,
    itemsPerPage,
    handlePageChange,
    // New functions added to the return object
    uploadFiles,
    uploadFolder,
  };
};
