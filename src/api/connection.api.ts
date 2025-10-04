import { apiClient } from "./client";
import { DataConnection } from '../types/template.types';

export const connectionApi = {
  // Create connection
  createConnection: async (data: {
    name: string;
    type: 'trino' | 'postgresql';
    host: string;
    port: number;
    database_name?: string;
    username?: string;
    password?: string;
    catalog?: string;
    schema?: string;
  }) => {
    const response = await apiClient.post('/api/connections', data);
    return response.data;
  },

  // List connections
  listConnections: async () => {
    const response = await apiClient.get('/api/connections');
    return response.data;
  },

  // Get connection by ID
  getConnection: async (connectionId: string) => {
    const response = await apiClient.get(`/api/connections/${connectionId}`);
    return response.data;
  },

  // Update connection
  updateConnection: async (connectionId: string, data: Partial<DataConnection>) => {
    const response = await apiClient.put(`/api/connections/${connectionId}`, data);
    return response.data;
  },

  // Delete connection
  deleteConnection: async (connectionId: string) => {
    const response = await apiClient.delete(`/api/connections/${connectionId}`);
    return response.data;
  },

  // Test connection
  testConnection: async (connectionId: string) => {
    const response = await apiClient.post(`/api/connections/${connectionId}/test`);
    return response.data;
  },
};