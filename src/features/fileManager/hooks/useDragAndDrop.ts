import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { fromEvent } from "file-selector";

interface UseDragAndDropProps {
  /** Callback function when one or more files (not folders) are dropped */
  onFileUpload: (files: File[]) => Promise<void>;
  /** Callback function when a folder (or mix of files/folders) is dropped */
  onFolderUpload: (files: File[], relativePaths: string[]) => Promise<void>;
  /** Optional callback for progress updates (loaded bytes, total bytes) */
  onProgress?: (loaded: number, total: number) => void;
  /** Optional callback for handling errors */
  onError?: (error: Error) => void;
  /** Number of files to process locally before yielding to the event loop (for UI responsiveness) */
  processingChunkSize?: number;
  /** Debounce time in milliseconds for progress updates to reduce renders */
  debounceMs?: number;
}

interface FileWithPath extends File {
  path?: string;
}

interface ProgressState {
  loaded: number;
  total: number;
}

export const useDragAndDrop = ({
  onFileUpload,
  onFolderUpload,
  onProgress,
  onError,
  processingChunkSize = 50,
  debounceMs = 100,
}: UseDragAndDropProps): {
  // Define clear return type for clarity
  isDragging: boolean;
  isProcessing: boolean;
  uploadProgress: ProgressState;
  handleDragEnter: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => Promise<void>; // Note: handleDrop is async
  closeDragOverlay: () => void;
  getRootProps: () => {
    onDragEnter: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void; // Technically returns Promise<void>, but usually not awaited here
    role: string;
    "aria-label": string;
    tabIndex: number;
  };
} => {
  // Added explicit return type
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ProgressState>({
    loaded: 0,
    total: 0,
  });

  const progressRef = useRef<ProgressState | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleError = useCallback(
    (error: unknown) => {
      const errorObject =
        error instanceof Error ? error : new Error(String(error));
      console.error("Drag and drop error:", errorObject);

      if (onError) {
        onError(errorObject);
      }
      setIsProcessing(false);
      setUploadProgress({ loaded: 0, total: 0 });
      progressRef.current = null;
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    },
    [onError]
  );

  const updateProgress = useCallback(
    (loaded: number, total: number, forceImmediate: boolean = false) => {
      progressRef.current = { loaded, total };

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const performUpdate = () => {
        if (progressRef.current) {
          setUploadProgress(progressRef.current);
          if (onProgress) {
            onProgress(progressRef.current.loaded, progressRef.current.total);
          }
          progressRef.current = null;
          debounceTimeoutRef.current = null;
        }
      };

      if (forceImmediate || debounceMs <= 0) {
        performUpdate();
      } else {
        debounceTimeoutRef.current = setTimeout(performUpdate, debounceMs);
      }
    },
    [onProgress, debounceMs]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if actual files/items are being dragged
    if (e.dataTransfer.types.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy"; // Explicitly set drop effect
    // No need to setIsDragging(true) here, enter should handle it.
    // If needed for edge cases, add it back, but usually redundant.
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use relatedTarget to more reliably determine if leaving the boundary
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const isPathFromFolder = useCallback((path: string | undefined): boolean => {
    if (!path) return false;
    
    // Normalize path by removing "./" prefix which is common in file drops
    // but doesn't indicate a true folder structure
    const normalizedPath = path.replace(/^\.\//, '');
    
    // After normalization, check if there are still path separators
    if (!normalizedPath.includes('/') && !normalizedPath.includes('\\')) {
      return false;
    }
    
    // Split by both forward and backslash to handle different OS path formats
    const pathParts = normalizedPath.split(/[/\\]/);
    
    // It's a folder path if there are path parts before the filename (length > 1)
    // AND there's at least one non-empty directory name
    return pathParts.length > 1 && pathParts.some((part, index) => 
      index < pathParts.length - 1 && !!part.trim()
    );
  }, []);

  // handleDrop needs to be async because it awaits file processing/callbacks
  const handleDrop = useCallback(
    async (e: React.DragEvent): Promise<void> => {
      // Explicit async/Promise<void>
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false); // Hide dragging state immediately on drop

      if (isProcessing) {
        console.warn("Drop ignored: Already processing previous drop.");
        return;
      }

      setIsProcessing(true);
      updateProgress(0, 0, true); // Reset progress

      try {
        const droppedItems: (FileWithPath | DataTransferItem)[] =
          await fromEvent(e.nativeEvent);
        const fileEntries = droppedItems.filter(
          (item) => item instanceof File
        ) as FileWithPath[];

        if (fileEntries.length === 0) {
          setIsProcessing(false);
          updateProgress(0, 0, true); // Reset progress if nothing valid dropped
          return;
        }

        const files: FileWithPath[] = [];
        const relativePaths: string[] = [];
        let hasFolder = false;
        let totalSize = 0;

        for (const fileEntry of fileEntries) {
          const file = fileEntry;
          const path = fileEntry.path || file.name;
          
          if (!file) continue;
        
          // Normalize path by removing "./" prefix for detection
          // const normalizedPath = path.replace(/^\.\//, '');
          
          // A path indicates a folder structure if it has directory segments
          // after normalization
          const isFromFolder = isPathFromFolder(path);
          
          if (!hasFolder && isFromFolder) {
            console.log(`[DEBUG] Detected folder structure in path: ${path}`);
            hasFolder = true;
          }
        
          files.push(file);
          // Don't normalize in the relativePaths array - keep original paths
          relativePaths.push(path);
          totalSize += file.size;
        }

        updateProgress(0, totalSize, true); // Update with correct total

        let processedSize = 0;
        const totalFiles = files.length;
        const numChunks = Math.ceil(totalFiles / processingChunkSize);

        for (let i = 0; i < numChunks; i++) {
          const start = i * processingChunkSize;
          const end = Math.min((i + 1) * processingChunkSize, totalFiles);
          const chunkFiles = files.slice(start, end);

          chunkFiles.forEach((file) => {
            processedSize += file.size;
          });

          updateProgress(processedSize, totalSize);

          await new Promise((resolve) => setTimeout(resolve, 0)); // Yield for UI responsiveness
        }
        console.log("[DEBUG] Upload type:", hasFolder ? "folder" : "files");
        console.log("[DEBUG] File paths:", relativePaths);
        // Await the appropriate upload callback
        if (hasFolder) {
          await onFolderUpload(files, relativePaths);
        } else {
          await onFileUpload(files);
        }

        updateProgress(totalSize, totalSize, true); // Final progress update
      } catch (error) {
        handleError(error); // Catch errors during file reading or upload callbacks
      } finally {
        // Ensure processing is set to false even if callbacks succeed/fail quickly
        // Use a small timeout to prevent flicker if processing finishes extremely fast
        setTimeout(() => setIsProcessing(false), 50);
      }
    },
    [
      // Dependencies for handleDrop
      isProcessing,
      onFileUpload,
      onFolderUpload,
      updateProgress,
      handleError,
      isPathFromFolder,
      processingChunkSize,
    ]
  );

  const closeDragOverlay = useCallback(() => {
    setIsDragging(false);
  }, []);

  // *** CORRECTED useMemo return structure ***
  return useMemo(
    () => ({
      // State variables:
      isDragging,
      isProcessing,
      uploadProgress,

      // Individual Handlers (returned explicitly):
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      closeDragOverlay,

      // Convenience function for main drop zone:
      getRootProps: () => ({
        onDragEnter: handleDragEnter,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        // Other props for main zone:
        role: "button", // Example, adjust as needed
        "aria-label": "File drop zone",
        tabIndex: 0,
      }),
    }),
    // Dependencies for useMemo (include all returned state/handlers):
    [
      isDragging,
      isProcessing,
      uploadProgress,
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      closeDragOverlay,
    ]
  );
};
