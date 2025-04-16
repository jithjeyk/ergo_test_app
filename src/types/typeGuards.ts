import type { FileSystemItem, Folder, File } from "./document"; // Adjust path if needed

/**
 * Type guard to check if a FileSystemItem is a Folder.
 * It safely checks for the presence and value of the 'type' property.
 */
export function isFolder(item: FileSystemItem | Folder | File | undefined | null): item is Folder {
    // Check if item is non-null, has the 'type' property, and its value is 'folder'
    return !!item && 'type' in item && item.type === 'folder';
}

/**
 * Type guard to check if a FileSystemItem is a File.
 * It safely checks for the presence and value of the 'type' property.
 */
export function isFile(item: FileSystemItem | Folder | File | undefined | null): item is File {
     // Check if item is non-null, has the 'type' property, and its value is 'file'
    return !!item && 'type' in item && item.type === 'file';
}