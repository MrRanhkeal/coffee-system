import { create } from "zustand"; // global state

export const configStore = create((set) => ({
  config: {
    category: null,
    role: null,
    supplier: null,
    product_name: null,
    purchase_status: null,
    brand: null,
    customer: null,
  },
  setConfig: (params) =>
    set((state) => ({
      config: params, 
    })),
    descrease: () =>
      set((state) => ({
        count: state.count - 1,
      })),
}));
