import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './slices/portfolioSlice';
import watchlistReducer from './slices/watchlistSlice';
import technicalReducer from './slices/technicalSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    watchlist: watchlistReducer,
    technical: technicalReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;