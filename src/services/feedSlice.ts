import { getFeedsApi, getOrdersApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getFeeds = createAsyncThunk('get/feeds', getFeedsApi);

export type TFeedsState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

const initialState: TFeedsState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const feedSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    feedStateSelector: (state) => state,
    feedOrdersSelector: (state) => state.orders
  },
  extraReducers(builder) {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeeds.rejected, () => initialState)
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
      });
  }
});

export const { feedOrdersSelector, feedStateSelector } = feedSlice.selectors;
