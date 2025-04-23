declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string | boolean;
    directory?: string | boolean;
  }
}// User roles for role-based access control
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MANAGER = 'manager',
    GUEST = 'guest'
}

// Comprehensive User interface
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isOnline?: boolean;
  lastSeen?: Date | string; // Consider using ISO string for easier serialization
}

// Authentication-related permissions
export enum UserPermission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  UPDATE = 'update',
  ADMIN_ACCESS = 'admin_access'
}

// Extended user profile with additional details
export interface UserProfile extends User {
  // Consider using ISO string (string) or number (timestamp) for dates
  // to ensure easier serialization/deserialization (e.g., with JSON.parse/stringify)
  createdAt: Date | string;
  lastLogin?: Date | string;
  isActive: boolean;
  department?: string;
  contactNumber?: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string; // Consider not storing plain passwords even in frontend state
}

// Registration data interface
export interface RegistrationData extends Omit<LoginCredentials, 'password'> {
  name: string;
  password: string; // Separate password fields are good practice
  confirmPassword: string;
}

// Password reset interface
export interface PasswordResetRequest {
  email: string;
  token?: string; // Usually received via email link
  newPassword?: string;
}

// Authentication response interface
export interface AuthResponse {
  user: User;
  token: string;
  permissions: UserPermission[];
  // Consider ISO string or timestamp for expiration
  expiresAt: Date | string;
}

// Error handling for authentication
export interface AuthError {
  code: string; // e.g., 'INVALID_CREDENTIALS', 'EMAIL_EXISTS'
  message: string;
  field?: string; // e.g., 'email', 'password'
}

// --- File Manager Types ---

export interface FileSystemItem {
    id: string;
    name: string;
    parentId: string | null;
    // Consider using number (timestamp) or ISO string for easier sorting/comparison
    time: string; // Or Date? number? ISOString?
    iconColor?: string; // More specific color source? Theme? File type based?
}

export interface Folder extends FileSystemItem {
    // 'items' property definitively identifies it as a Folder vs Document
    items: FolderItem[];
    // parentId is already in FileSystemItem
    // itemCount could be useful but needs to be maintained accurately
    itemCount?: number;
}

export interface Document extends FileSystemItem {
    parentId: string; // Documents must belong to a folder, so not null
    type: string; // e.g., 'pdf', 'docx', 'folder' (though folders handled by Folder interface)
    // Consider using number (bytes) for size for easier calculations/formatting
    size: string | number; // Or number?
    sharedBy?: string; // User ID or name?
    sharedWith?: string[]; // Array of User IDs or names?
    // iconColor is already in FileSystemItem - should it be mandatory for Document?
}

// Union type for items within a folder view
export type FolderItem = Folder | Document;

// Type guard to check if an item is a Folder
export function isFolder(item: FolderItem): item is Folder {
  // Check for the presence of the 'items' array, unique to Folders
  return (item as Folder).items !== undefined;
  // Alternative: Add an explicit 'kind: "folder" | "document"' property
}

// Type for breadcrumb segments
