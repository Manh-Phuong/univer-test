import { useState } from "react";
import { connectionApi } from "../api/connection.api";
import { DataConnection } from "../types/template.types";

export const useConnection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConnection = async (
    data: Omit<DataConnection, "id" | "owner_id" | "created_at" | "updated_at">
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await connectionApi.createConnection(data);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to create connection";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const listConnections = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await connectionApi.listConnections();
      return { success: true, data: result.connections };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to load connections";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (connectionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await connectionApi.testConnection(connectionId);
      return { success: result.success, message: result.message };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Connection test failed";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConnection = async (connectionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await connectionApi.deleteConnection(connectionId);
      return { success: true };
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || "Failed to delete connection";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createConnection,
    listConnections,
    testConnection,
    deleteConnection,
  };
};
