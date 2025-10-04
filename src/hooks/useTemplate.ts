import { useState } from "react";
import { templateApi } from "../api/template.api";
import { Template, ApplyTemplateParams } from "../types/template.types";

export const useTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplate = async (data: {
    name: string;
    description?: string;
    snapshot: any; // Changed from workbookId
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templateApi.createTemplate(data);
      return { success: true, data: result };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to create template";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const listTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templateApi.listTemplates();
      return { success: true, data: result.templates };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to load templates";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templateApi.getTemplate(templateId);
      return { success: true, data: result.template };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to load template";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await templateApi.deleteTemplate(templateId);
      return { success: true };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to delete template";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const applyTemplate = async (
    templateId: string,
    params: ApplyTemplateParams
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await templateApi.applyTemplate(templateId, params);
      return { success: true, data: result.workbook };
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to apply template";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    createTemplate,
    listTemplates,
    getTemplate,
    deleteTemplate,
    applyTemplate,
  };
};
