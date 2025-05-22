import { createStore } from "zustand/vanilla";

const store = createStore((set) => ({
  user: {
    email: String,
  },
  updateUser: (payload) =>
    set(() => ({
      user: payload,
    })),
}));

// THIS IS A DESTRUCTURING OF FUNCTIONS FOR OTHER LAYES TO ACCESS THE STORE OUTSIDE OF THE PRESENTATION LAYER
const { getState, setState, subscribe, getInitialState } = store;

export default store;
