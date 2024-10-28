import { io, Socket } from 'socket.io-client';

interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export class WebSocketClient {
  private static instance: WebSocketClient;
  private socket: Socket;
  private subscribers: Map<string, Set<(data: PriceUpdate) => void>> = new Map();

  private constructor() {
    this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000');
    this.initialize();
  }

  public static getInstance(): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient();
    }
    return WebSocketClient.instance;
  }

  private initialize(): void {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('priceUpdate', (data: PriceUpdate) => {
      const subscribers = this.subscribers.get(data.symbol);
      subscribers?.forEach(callback => callback(data));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
    });
  }

  public subscribeToSymbol(symbol: string, callback: (data: PriceUpdate) => void): void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      this.socket.emit('subscribe', [symbol]);
    }
    this.subscribers.get(symbol)?.add(callback);
  }

  public unsubscribeFromSymbol(symbol: string, callback: (data: PriceUpdate) => void): void {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol);
        this.socket.emit('unsubscribe', [symbol]);
      }
    }
  }
}