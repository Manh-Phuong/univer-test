import { apiClient } from "./client";
import { API_ENDPOINTS } from "../utils/constants";
import type {
  Workbook,
  WorkbookWithSnapshot,
  WorkbookListResponse,
  CreateWorkbookInput,
  UpdateWorkbookInput,
  WorkbookListQuery,
} from "../types";

export const workbookApi = {
  // Create workbook
  create: async (
    input: CreateWorkbookInput
  ): Promise<{ workbook: Workbook }> => {
    const formData = new FormData();
    formData.append("name", input.name);
    if (input.description) {
      formData.append("description", input.description);
    }
    formData.append("snapshot", JSON.stringify(input.snapshot));
    if (input.file) {
      formData.append("file", input.file);
    }

    const response = await apiClient.post<{ workbook: Workbook }>(
      API_ENDPOINTS.WORKBOOKS.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // List workbooks
  list: async (query?: WorkbookListQuery): Promise<WorkbookListResponse> => {
    const response = await apiClient.get<WorkbookListResponse>(
      API_ENDPOINTS.WORKBOOKS.LIST,
      { params: query }
    );
    return response.data;
  },

  // Get workbook by ID
  get: async (id: string): Promise<{ workbook: WorkbookWithSnapshot }> => {
    const response = await apiClient.get<{ workbook: WorkbookWithSnapshot }>(
      API_ENDPOINTS.WORKBOOKS.GET(id)
    );
    return response.data;
  },

  // Update workbook
  update: async (
    id: string,
    input: UpdateWorkbookInput
  ): Promise<{ workbook: Workbook }> => {
    const response = await apiClient.put<{ workbook: Workbook }>(
      API_ENDPOINTS.WORKBOOKS.UPDATE(id),
      input
    );
    return response.data;
  },

  // Delete workbook (soft delete)
  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.WORKBOOKS.DELETE(id)
    );
    return response.data;
  },

  // Permanently delete workbook
  permanentDelete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(
      API_ENDPOINTS.WORKBOOKS.PERMANENT_DELETE(id)
    );
    return response.data;
  },
};
