import { apiClient } from "./client";
import { Template, ApplyTemplateParams } from '../types/template.types';

export const templateApi = {
  // Create template from workbook
  createTemplate: async (data: {
    name: string;
    description?: string;
    snapshot: any; // Changed
  }) => {
    const response = await apiClient.post('/api/templates', data);
    return response.data;
  },

  // List templates
  listTemplates: async () => {
    const response = await apiClient.get('/api/templates');
    return response.data;
  },

  // Get template by ID
  getTemplate: async (templateId: string) => {
    const response = await apiClient.get(`/api/templates/${templateId}`);
    return response.data;
  },

  // Delete template
  deleteTemplate: async (templateId: string) => {
    const response = await apiClient.delete(`/api/templates/${templateId}`);
    return response.data;
  },

  // Apply template to create workbook
   applyTemplate: async (templateId: string, params: ApplyTemplateParams) => {
    const response = await apiClient.post(`/api/templates/${templateId}/apply`, params);
    return response.data;
  },
};