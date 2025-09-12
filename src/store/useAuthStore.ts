import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface Location {
  type: "Point";
  coordinates: [number, number]; // [lng, lat]
  geohash?: string;
  address?: Record<string, any>;
}

interface AuthState {
  id: string;
  name: string;
  email: string;
  govId: string;
  token: string | null;
  role: string;
  department: string;
  phone: string;
  last_login: Date | null;
  location?: Location;

  setLogin: (data: {
    id: string;
    name: string;
    email: string;
    govId: string;
    token: string;
    role: string;
    department: string;
    phone: string;
    last_login: Date | null;
    location?: Location;
  }) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set) => ({
      id: "",
      name: "",
      email: "",
      govId: "",
      token: null,
      role: "",
      department: "",
      phone: "",
      last_login: null,
      location: undefined,

      setLogin: (data) =>
        set((state) => {
          state.id = data.id;
          state.name = data.name;
          state.email = data.email;
          state.govId = data.govId;
          state.token = data.token;
          state.role = data.role;
          state.department = data.department;
          state.phone = data.phone;
          state.last_login = data.last_login;
          state.location = data.location;
        }),

      logout: async () => {
        set((state) => {
          state.id = "";
          state.name = "";
          state.email = "";
          state.govId = "";
          state.token = null;
          state.role = "";
          state.department = "";
          state.phone = "";
          state.last_login = null;
          state.location = undefined;
        }),
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("complaints-storage");
        localStorage.removeItem("escalation-log-storage");

        try {
          await fetch("/api/logout", {
            method: "POST",
          });
        } catch (err) {
          console.error("Error clearing cookie:", err);
        }
       }
    })),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
