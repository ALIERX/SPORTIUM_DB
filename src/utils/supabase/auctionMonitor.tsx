// Background monitor for auction expiration
import { projectId, publicAnonKey } from "./info";

export class AuctionMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('🔥 Auction Monitor started - checking every 60 seconds');

    // Check immediately on start
    this.checkExpiredAuctions();

    // Then check every 60 seconds
    this.intervalId = setInterval(() => {
      this.checkExpiredAuctions();
    }, 60000); // 60 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Auction Monitor stopped');
  }

  private async checkExpiredAuctions() {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/auctions/check-expired`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.closed > 0) {
          console.log(`✅ Closed ${data.closed} expired auction(s)`);
        }
      }
    } catch (error) {
      console.error('Error checking expired auctions:', error);
    }
  }
}

// Singleton instance
export const auctionMonitor = new AuctionMonitor();
