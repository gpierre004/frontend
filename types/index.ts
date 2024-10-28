// Common types used across the application
export interface User {
    id: string;
    email: string;
    name?: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
  export interface Investment {
    id: string;
    symbol: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    currentValue: number;
    gainLoss: number;
  }
  
  export interface WatchlistItem {
    id: string;
    symbol: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    volume: number;
  }
  
  export {};