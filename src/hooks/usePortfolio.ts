import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchPortfolio, updatePrice } from '../store/slices/portfolioSlice';
import { WebSocketClient } from '../services/websocket.service';

export const usePortfolio = (portfolioId: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const portfolio = useSelector((state: RootState) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio(portfolioId));

    const wsClient = WebSocketClient.getInstance();
    
    const handlePriceUpdate = (data: any) => {
      dispatch(updatePrice({
        symbol: data.symbol,
        price: data.price
      }));
    };

    // Subscribe to updates for all portfolio symbols
    portfolio.investments.forEach((investment: any) => {
      wsClient.subscribeToSymbol(investment.symbol, handlePriceUpdate);
    });

    return () => {
      portfolio.investments.forEach((investment: any) => {
        wsClient.unsubscribeFromSymbol(investment.symbol, handlePriceUpdate);
      });
    };
  }, [dispatch, portfolioId, portfolio.investments]);

  return portfolio;
};