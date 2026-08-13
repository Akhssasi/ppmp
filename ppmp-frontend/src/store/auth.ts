import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse, AuthUser } from "@/lib/types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setAuth: (auth) =>
        set({
          user: auth.user,
          isAuthenticated: true,
        }),
      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "ppmp_auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}
