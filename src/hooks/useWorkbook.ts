import { useState, useEffect, useCallback } from "react";
import { workbookApi } from "../api/workbook.api";
import { handleApiError } from "../api/client";
import type {
  Workbook,
  WorkbookWithSnapshot,
  CreateWorkbookInput,
  UpdateWorkbookInput,
  WorkbookListQuery,
} from "../types";

export const useWorkbook = () => {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [currentWorkbook, setCurrentWorkbook] =
    useState<WorkbookWithSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // List workbooks
  const fetchWorkbooks = useCallback(async (query?: WorkbookListQuery) => {
    try {
      setLoading(true);
      setError(null);

      const response = await workbookApi.list(query);

      setWorkbooks(response.data);
      setPagination(response.pagination);

      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single workbook
  const fetchWorkbook = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await workbookApi.get(id);

      setCurrentWorkbook(response.workbook);

      return { success: true, data: response.workbook };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create workbook
  const createWorkbook = async (input: CreateWorkbookInput) => {
    try {
      setLoading(true);
      setError(null);

      const response = await workbookApi.create(input);

      // Refresh list
      await fetchWorkbooks();

      return { success: true, data: response.workbook };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update workbook
  const updateWorkbook = async (id: string, input: UpdateWorkbookInput) => {
    try {
      setLoading(true);
      setError(null);

      const response = await workbookApi.update(id, input);

      // Update current workbook if it's the same
      if (currentWorkbook?.id === id) {
        setCurrentWorkbook({
          ...currentWorkbook,
          ...response.workbook,
        });
      }

      // Update in list
      setWorkbooks((prev) =>
        prev.map((wb) => (wb.id === id ? response.workbook : wb))
      );

      return { success: true, data: response.workbook };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Delete workbook
  const deleteWorkbook = async (id: string, permanent = false) => {
    try {
      setLoading(true);
      setError(null);

      if (permanent) {
        await workbookApi.permanentDelete(id);
      } else {
        await workbookApi.delete(id);
      }

      // Remove from list
      setWorkbooks((prev) => prev.filter((wb) => wb.id !== id));

      // Clear current if deleted
      if (currentWorkbook?.id === id) {
        setCurrentWorkbook(null);
      }

      return { success: true };
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    workbooks,
    currentWorkbook,
    loading,
    error,
    pagination,
    fetchWorkbooks,
    fetchWorkbook,
    createWorkbook,
    updateWorkbook,
    deleteWorkbook,
    setCurrentWorkbook,
  };
};
