import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const bagSlice = createSlice({
  name: "bag",
  initialState,
  reducers: {
    addToBag: (state, action) => {
      const { item, quantity = 1 } = action.payload || {};
      if (!item || !item.id) return;

      const existingIndex = state.items.findIndex(
        (existingItem) => existingItem.id === item.id,
      );

      if (existingIndex >= 0) {
        state.items[existingIndex].quantity =
          (state.items[existingIndex].quantity || 1) + quantity;
      } else {
        state.items.push({
          ...item,
          quantity: Math.max(1, quantity),
        });
      }
    },
    removeFromBag: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload || {};
      if (!id) return;

      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
    },
    clearBag: (state) => {
      state.items = [];
    },
  },
});

export const bagActions = bagSlice.actions;
export default bagSlice.reducer;
