import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    selectedOrder: null,
  },
  reducers: {
    SetOrders: (state, action) => {
      state.orders = action.payload;
    },
    SetSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const { SetOrders, SetSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
