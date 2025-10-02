// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Workbook types
export interface Workbook {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  snapshot_url: string;
  original_file_url?: string;
  file_size?: number;
  sheet_count: number;
  created_at: string;
  updated_at: string;
}

export interface WorkbookWithSnapshot extends Workbook {
  snapshot: any;
  charts: any;
  original_file_presigned_url?: string;
}

export interface WorkbookListResponse {
  data: Workbook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateWorkbookInput {
  name: string;
  description?: string;
  snapshot: any;
  file?: File;
}

export interface UpdateWorkbookInput {
  name?: string;
  description?: string;
  snapshot?: any;
  charts?: any;
}

export interface WorkbookListQuery {
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "updated_at" | "name";
  order?: "ASC" | "DESC";
  search?: string;
}
