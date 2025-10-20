// Real-time update manager using BroadcastChannel
export class RealtimeManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.channel = new BroadcastChannel('sportium-updates');
      this.channel.onmessage = (event) => {
        const { type, data } = event.data;
        const callbacks = this.listeners.get(type);
        if (callbacks) {
          callbacks.forEach(callback => callback(data));
        }
      };
    }
  }

  subscribe(type: string, callback: (data: any) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    return () => {
      const callbacks = this.listeners.get(type);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  broadcast(type: string, data: any) {
    if (this.channel) {
      this.channel.postMessage({ type, data });
    }
  }

  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    this.listeners.clear();
  }
}

export const realtimeManager = new RealtimeManager();

// Event types
export const REALTIME_EVENTS = {
  AUCTION_UPDATE: 'auction-update',
  BID_PLACED: 'bid-placed',
  AUCTION_WON: 'auction-won',
  AUCTION_ENDED: 'auction-ended',
  WALLET_UPDATE: 'wallet-update',
  NOTIFICATION: 'notification',
};
