import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Investment {
  id: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  currentValue: number;
  gainLoss: number;
}

interface PortfolioState {
  investments: Investment[];
  totalValue: number;
  totalGainLoss: number;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  investments: [],
  totalValue: 0,
  totalGainLoss: 0,
  loading: false,
  error: null,
};

export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (portfolioId: string) => {
    const response = await api.get(`/portfolio/${portfolioId}/summary`);
    return response.data;
  }
);

export const addInvestment = createAsyncThunk(
  'portfolio/addInvestment',
  async (investment: Partial<Investment>) => {
    const response = await api.post(`/portfolio/${investment.portfolioId}/investments`, investment);
    return response.data;
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updatePrice: (state, action) => {
      const { symbol, price } = action.payload;
      const investment = state.investments.find((inv) => inv.symbol === symbol);
      if (investment) {
        investment.currentPrice = price;
        investment.currentValue = price * investment.shares;
        investment.gainLoss = investment.currentValue - (investment.purchasePrice * investment.shares);
        
        // Update totals
        state.totalValue = state.investments.reduce((sum, inv) => sum + inv.currentValue, 0);
        state.totalGainLoss = state.investments.reduce((sum, inv) => sum + inv.gainLoss, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.investments = action.payload;
        state.totalValue = action.payload.reduce(
          (sum: number, inv: Investment) => sum + inv.currentValue, 0
        );
        state.totalGainLoss = action.payload.reduce(
          (sum: number, inv: Investment) => sum + inv.gainLoss, 0
        );
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch portfolio';
      })
      .addCase(addInvestment.fulfilled, (state, action) => {
        state.investments.push(action.payload);
        state.totalValue += action.payload.currentValue;
        state.totalGainLoss += action.payload.gainLoss;
      });
  },
});

export const { updatePrice } = portfolioSlice.actions;
export default portfolioSlice.reducer;