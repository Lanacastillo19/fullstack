import { create } from "zustand";
import { persist } from "zustand/middleware";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://backend-21o5.vercel.app/api";

interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string, token: string) => void;
  logout: () => void;
  loginWithApi: (identifier: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem("token") || null,
      userName: null,

      login: (name: string, token: string) => {
        localStorage.setItem("token", token);
        set({ token, userName: name });
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ token: null, userName: null });
      },

      loginWithApi: async (identifier: string) => {
        // Formats endpoint correctly to https://backend-21o5.vercel.app/api/auth/login
        const endpoint = API_BASE_URL.endsWith("/api")
          ? `${API_BASE_URL}/auth/login`
          : `${API_BASE_URL}/api/auth/login`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: identifier,
            email: identifier,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        const token = data.token || "demo-jwt-token";
        const name = data.user?.name || identifier.split("@")[0];

        localStorage.setItem("token", token);
        set({ token, userName: name });
      },
    }),
    {
      name: "itelect4-auth",
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;