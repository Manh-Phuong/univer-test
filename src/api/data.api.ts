import { apiClient } from "./client";
import { MergeDataParams } from '../types/template.types';

export const dataApi = {
  // Universal merge data endpoint
  mergeData: async (params: MergeDataParams) => {
    const response = await apiClient.post('/api/data/merge', params);
    return response.data;
  },
};