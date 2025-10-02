import { User } from "../types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const storage = {
  setToken: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      console.log("Token saved to localStorage");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  getToken: (): string | null => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      console.log("Token retrieved from localStorage:", token ? "exists" : "null");
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  setUser: (user: User) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log("User saved to localStorage:", user);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  },

  getUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        console.log("No user found in localStorage");
        return null;
      }
      const user = JSON.parse(userStr);
      console.log("User retrieved from localStorage:", user);
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      console.log("Storage cleared");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};