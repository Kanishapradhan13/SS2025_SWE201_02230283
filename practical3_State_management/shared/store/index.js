import { create } from "zustand";

const useStore = create((set) => ({
  user: {
    email: String,
  },
  updateUser: (payload) =>
    set(() => ({
      user: payload,
    })),
}));

export { useStore };
