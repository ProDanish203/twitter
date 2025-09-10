import { create } from "zustand";

interface ForgotPasswordStore {
  identifier: string;
  setIdentifier: (identifier: string) => void;
  token?: string;
  setToken?: (token: string) => void;
}

export const useForgotPasswordStore = create<ForgotPasswordStore>((set) => ({
  identifier: "",
  setIdentifier: (identifier) => set({ identifier }),
  token: undefined,
  setToken: (token) => set({ token }),
}));
