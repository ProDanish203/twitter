import { create } from "zustand";

interface LoginStore {
  email: string;
  setEmail: (email: string) => void;
}

export const useLoginStore = create<LoginStore>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
}));
