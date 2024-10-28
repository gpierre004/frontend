import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchWatchlist, updateWatchlistPrice } from '../store/slices/watchlistSlice';
import { WebSocketClient } from '../services/websocket.service';

export const useWatchlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const watchlist = useSelector((state: RootState) => state.watchlist);

  useEffect(() => {
    dispatch(fetchWatchlist());

    const wsClient = WebSocketClient.getInstance();
    
    const handlePriceUpdate = (data: any) => {
      dispatch(updateWatchlistPrice(data));
    };

    watchlist.items.forEach((item: any) => {
      wsClient.subscribeToSymbol(item.symbol, handlePriceUpdate);
    });

    return () => {
      watchlist.items.forEach((item: any) => {
        wsClient.unsubscribeFromSymbol(item.symbol, handlePriceUpdate);
      });
    };
  }, [dispatch, watchlist.items]);

  return watchlist;
};