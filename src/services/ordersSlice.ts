import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'newOrder/creatNewOrder',
  orderBurgerApi
);

export const getOrder = createAsyncThunk('order/getOrder', getOrderByNumberApi);

export const getOrders = createAsyncThunk('orders/getOrders', getOrdersApi);

export type TOrderState = {
  orders: TOrder[] | null;
  currentOrderRequest: boolean;
  openedOrderRequest: boolean;
  errorMessage: string | undefined;
  currentOrder: TOrder | null;
  openedOrder: TOrder | null;
};

const initialState: TOrderState = {
  orders: null,
  currentOrderRequest: false,
  openedOrderRequest: false,
  errorMessage: undefined,
  currentOrder: null,
  openedOrder: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrder: () => initialState
  },
  selectors: {
    currentOrderRequestSelector: (state) => state.currentOrderRequest,
    openedOrderRequestSelector: (state) => state.openedOrderRequest,
    currentOrderSelector: (state) => state.currentOrder,
    openedOrderselector: (state) => state.openedOrder,
    getOrdersSelector: (state) => state.orders
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (state) => {
        state.currentOrderRequest = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.errorMessage = action.error.message;
        state.currentOrderRequest = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.errorMessage = undefined;
        state.currentOrder = action.payload.order;
        state.currentOrderRequest = false;

        if (state.orders !== null) {
          state.orders = [...state.orders, action.payload.order];
        } else {
          state.orders = [action.payload.order];
        }
      })
      .addCase(getOrder.pending, (state, action) => {
        state.openedOrderRequest = true;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.openedOrder = action.payload.orders[0];
      })
      .addCase(getOrders.pending, (state) => {
        state.openedOrderRequest = true;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.errorMessage = action.error.message;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const {
  openedOrderRequestSelector,
  currentOrderRequestSelector,
  currentOrderSelector,
  getOrdersSelector,
  openedOrderselector
} = ordersSlice.selectors;

export const { resetOrder } = ordersSlice.actions;
