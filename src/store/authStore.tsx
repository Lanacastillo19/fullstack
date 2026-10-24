import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  login: (name: string, token: string) => void;
  logout: () => void;
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