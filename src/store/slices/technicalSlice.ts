import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { technicalApi } from '../../services/api';

interface Alert {
  id: string;
  symbol: string;
  indicator_type: string;
  comparison_operator: string;
  threshold_value: number;
  is_active: boolean;
}

interface TechnicalState {
  alerts: Alert[];
  indicators: {
    rsi: number;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
    };
    bollinger: {
      upper: number;
      middle: number;
      lower: number;
    };
  };
  loading: boolean;
  error: string | null;
}

const initialState: TechnicalState = {
  alerts: [],
  indicators: {
    rsi: 0,
    macd: {
      macd: 0,
      signal: 0,
      histogram: 0,
    },
    bollinger: {
      upper: 0,
      middle: 0,
      lower: 0,
    },
  },
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk(
  'technical/fetchAlerts',
  async () => {
    const response = await technicalApi.getAlerts();
    return response.data;
  }
);

const technicalSlice = createSlice({
  name: 'technical',
  initialState,
  reducers: {
    updateIndicators: (state, action) => {
      state.indicators = {
        ...state.indicators,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
      });
  },
});

export const { updateIndicators } = technicalSlice.actions;
export default technicalSlice.reducer;