export type UUID = string;
type ISO8601Date = string; // e.g. "2025-04-07T15:30:00Z"
type MimeType = string; // e.g. "application/pdf", "image/jpeg"
type FilePermission = "view" | "edit" | "comment" | "owner";
type ShareStatus = "private" | "shared" | "public" | "organization";

// User & Collaborator Types
interface User {
  id: UUID;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: ISO8601Date;
  lastActive: ISO8601Date;
}

interface Collaborator {
  user: User;
  permission: FilePermission;
  addedAt: ISO8601Date;
  addedBy: UUID; // User ID who shared the item
}

// File System Item (base interface for both files and folders)
export interface FileSystemItem {
  id: UUID;
  name: string;
  path: string; // Full path e.g. "/Personal/Projects/2025/Project X"
  parentId: UUID | null; // null means root level
  createdBy: UUID;
  createdAt: ISO8601Date;
  modifiedAt: ISO8601Date;
  lastAccessedAt: ISO8601Date;
  isStarred: boolean;
  shareStatus: ShareStatus;
  collaborators: Collaborator[];
  tags: string[];
  customMetadata: Record<string, unknown>; // Extensible metadata
  trashed: boolean;
  trashedAt?: ISO8601Date;
  permanentlyDeleteAt?: ISO8601Date; // For auto-cleanup policies
}

// Folder specific properties
export interface Folder extends FileSystemItem {
  type: "folder";
  color?: string; // Optional color for UI display
  childCount: {
    folders: number;
    files: number;
    trashedItems: number;
  };
  size: number; // Total size of all contained files in bytes
}

// Version history for files
interface FileVersion {
  id: UUID;
  fileId: UUID;
  versionNumber: number;
  size: number;
  createdBy: UUID;
  createdAt: ISO8601Date;
  comment?: string;
  storageLocation: string; // Path or reference to storage backend
  checksum: string; // For integrity verification
}

// File specific properties
export interface File extends FileSystemItem {
  type: "file";
  mimeType: MimeType;
  size: number; // Size in bytes
  extension: string;
  versions: FileVersion[];
  currentVersionId: UUID;
  thumbnail?: {
    url: string;
    width: number;
    height: number;
    generatedAt: ISO8601Date;
  };
  contentHash: string; // For deduplication and integrity checks
  encrypted: boolean;
  locked: boolean;
  lockedBy?: UUID;
  lockedUntil?: ISO8601Date;
}

// Activity tracking
export interface ActivityLog {
  id: UUID;
  itemId: UUID; // File or folder ID
  userId: UUID;
  timestamp: ISO8601Date;
  activityType: 
    | "create" 
    | "upload" 
    | "download" 
    | "view" 
    | "edit" 
    | "delete" 
    | "restore" 
    | "rename"
    | "move" 
    | "copy" 
    | "share" 
    | "unshare"
    | "star" 
    | "unstar" 
    | "comment"
    | "version_upload";
  details: Record<string, unknown>; // Additional context
  ipAddress?: string;
  userAgent?: string;
}

// Comment system
export interface Comment {
  id: UUID;
  itemId: UUID; // File or folder ID
  userId: UUID;
  parentCommentId?: UUID; // For threaded comments
  content: string;
  createdAt: ISO8601Date;
  editedAt?: ISO8601Date;
  resolved: boolean;
  resolvedBy?: UUID;
  resolvedAt?: ISO8601Date;
  // For file-specific annotations
  annotation?: {
    pageNumber?: number; // For multi-page documents
    coordinates?: [number, number, number, number]; // [x1, y1, x2, y2]
    annotationType: "highlight" | "note" | "drawing";
  };
}

// Share links for external access
export interface ShareLink {
  id: UUID;
  itemId: UUID; // File or folder ID
  createdBy: UUID;
  createdAt: ISO8601Date;
  expiresAt?: ISO8601Date;
  password?: string; // Hashed, for protected shares
  permission: FilePermission;
  allowedDomains?: string[]; // Restrict access to specific email domains
  maxUses?: number;
  currentUses: number;
  notifyOnAccess: boolean;
  accessLog: {
    timestamp: ISO8601Date;
    ipAddress: string;
    userAgent: string;
    email?: string; // If authentication was required
  }[];
}

// Cache and recent files tracking
export interface RecentItem {
  userId: UUID;
  itemId: UUID;
  accessedAt: ISO8601Date;
  accessCount: number;
  accessType: "view" | "edit" | "download";
}

// Search index entry
export interface SearchIndexEntry {
  itemId: UUID;
  itemType: "file" | "folder";
  content: string; // Extracted text content for full-text search
  metadata: {
    title: string;
    tags: string[];
    createdAt: ISO8601Date;
    modifiedAt: ISO8601Date;
    fileType?: string;
    author?: string;
    size?: number;
  };
  permissions: UUID[]; // Users who can access this item
  lastIndexed: ISO8601Date;
}

export interface BreadcrumbSegment {
  id: string;
  name: string;
}