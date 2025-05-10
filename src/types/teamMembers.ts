export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  phone: string;
  userType: "admin" | "user";
  role: "manager" | "account" | "hr" | "developer" | "support";
  status: "pending" | "registered" | "rejected";
  avatarUrl?: string;
  department?: string;
  hireDate?: string;
  lastActive?: string;
}

export interface TeamMembersFilters {
  search: string;
  status: string;
  role: string;
  userType: string;
}

export type AddUserMethod = "single" | "bulk" | "api";

export interface AddUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  phone: string;
  userType: "admin" | "user";
  role: "manager" | "account" | "hr" | "developer" | "support";
  status: "pending" | "registered" | "rejected";
  avatar?: File | null;
}

export interface BulkImportFormData {
  file: File;
  settings: {
    delimiter: string;
    hasHeader: boolean;
    encoding: string;
  };
  fieldMappings: Record<string, string>;
}

export interface ApiImportFormData {
  source: string;
  endpoint: string;
  apiKey: string;
  secret: string;
  options: {
    importActive: boolean;
    importPhotos: boolean;
    syncRegularly: boolean;
  };
}
