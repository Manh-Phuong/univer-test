// API Base URL - Thay đổi theo môi trường
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    ME: "/api/auth/me",
  },
  WORKBOOKS: {
    LIST: "/api/workbooks",
    CREATE: "/api/workbooks",
    GET: (id: string) => `/api/workbooks/${id}`,
    UPDATE: (id: string) => `/api/workbooks/${id}`,
    DELETE: (id: string) => `/api/workbooks/${id}`,
    PERMANENT_DELETE: (id: string) => `/api/workbooks/${id}/permanent`,
  },
};

// Auto-save interval (milliseconds)
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Debounce delay for typing
export const DEBOUNCE_DELAY = 500; // 500ms
