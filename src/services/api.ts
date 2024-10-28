import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const portfolioApi = {
  getPortfolio: (portfolioId: string) => api.get(`/portfolio/${portfolioId}/summary`),
  addInvestment: (portfolioId: string, investment: any) => 
    api.post(`/portfolio/${portfolioId}/investments`, investment),
  updateInvestment: (investmentId: string, data: any) =>
    api.put(`/investments/${investmentId}`, data),
  deleteInvestment: (investmentId: string) =>
    api.delete(`/investments/${investmentId}`),
};

export const watchlistApi = {
  getWatchlist: () => api.get('/watchlist'),
  addToWatchlist: (symbol: string) => api.post('/watchlist', { symbol }),
  removeFromWatchlist: (symbol: string) => api.delete(`/watchlist/${symbol}`),
};

export const technicalApi = {
  getIndicators: (symbol: string, period?: number) =>
    api.get(`/technical/${symbol}`, { params: { period } }),
  createAlert: (alertData: any) =>
    api.post('/technical/alerts', alertData),
  getAlerts: () => api.get('/technical/alerts'),
  deleteAlert: (alertId: string) =>
    api.delete(`/technical/alerts/${alertId}`),
};