import React from 'react';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface WatchlistState {
  items: WatchlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WatchlistState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchWatchlist = createAsyncThunk(
  'watchlist/fetchWatchlist',
  async () => {
    const response = await api.get('/watchlist');
    return response.data;
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (symbol: string) => {
    const response = await api.post('/watchlist', { symbol });
    return response.data;
  }
);

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    updateWatchlistPrice: (state, action) => {
      const { symbol, price, change, changePercent, volume } = action.payload;
      const item = state.items.find((item) => item.symbol === symbol);
      if (item) {
        Object.assign(item, { price, change, changePercent, volume });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch watchlist';
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const { updateWatchlistPrice } = watchlistSlice.actions;
export default watchlistSlice.reducer;
export {};