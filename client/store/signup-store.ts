import { create } from "zustand";

interface SignupStore {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  month: string;
  setMonth: (month: string) => void;
  day: string;
  setDay: (day: string) => void;
  year: string;
  setYear: (year: string) => void;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  password: string;
  setPassword: (password: string) => void;
  getDateOfBirth: () => Date | null;
}

export const useSignupStore = create<SignupStore>((set, get) => ({
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  name: "",
  setName: (name) => set({ name }),
  email: "",
  setEmail: (email) => set({ email }),
  month: "",
  setMonth: (month) => set({ month }),
  day: "",
  setDay: (day) => set({ day }),
  year: "",
  setYear: (year) => set({ year }),
  verificationCode: "",
  setVerificationCode: (code) => set({ verificationCode: code }),
  password: "",
  setPassword: (password) => set({ password }),
  getDateOfBirth: () => {
    const { month, day, year } = get();
    if (month && day && year) {
      return new Date(`${month} ${day}, ${year}`);
    }
    return null;
  },
}));
