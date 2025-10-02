import { apiClient } from "./client";
import { API_ENDPOINTS } from "../utils/constants";
import type { AuthResponse, User } from "../types";

export const authApi = {
  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      { email, password }
    );
    return response.data;
  },

  // Register
  register: async (
    email: string,
    password: string,
    name?: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      { email, password, name }
    );
    return response.data;
  },

  // Get current user
  me: async (): Promise<{ user: User }> => {
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },
};
