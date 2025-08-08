// Service for handling offline data synchronization
import { useState, useEffect } from 'react';

export interface SyncItem {
  id: string;
  url: string;
  method: 'POST' | 'PUT' | 'DELETE';
  data: any;
  timestamp: string;
  retryCount: number;
}

export interface SyncStatus {
  pendingItems: number;
  isOnline: boolean;
  lastSync: string | null;
}

class SyncService {
  private db: IDBDatabase | null = null;
  private isOnline: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      this.initDB();
      this.setupEventListeners();
    }
  }

  private async initDB(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AutismObservationDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const objectStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          this.onSyncComplete(event.data.successful, event.data.failed);
        }
      });
    }

    // Set up periodic sync when online
    this.startPeriodicSync();
  }

  private startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.triggerSync();
      }
    }, 30000); // Sync every 30 seconds when online
  }

  private async triggerSync(): Promise<void> {
    if (typeof window === 'undefined') {
      return;
    }

    if ('serviceWorker' in navigator && 'sync' in (window as any).ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-observations');
      } catch (error) {
        console.error('Failed to register sync:', error);
        // Fallback to manual sync
        await this.manualSync();
      }
    } else {
      // Fallback for browsers that don't support background sync
      await this.manualSync();
    }
  }

  private async manualSync(): Promise<void> {
    if (!this.db || !this.isOnline) return;

    const transaction = this.db.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    const index = store.index('timestamp');

    return new Promise((resolve, reject) => {
      const getAllRequest = index.getAll();
      
      getAllRequest.onsuccess = async () => {
        const pendingRequests = getAllRequest.result;
        
        if (pendingRequests.length === 0) {
          resolve();
          return;
        }

        const results = await Promise.allSettled(
          pendingRequests.map(item => this.syncItem(item, store))
        );

        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;

        this.onSyncComplete(successful, failed);
        resolve();
      };

      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
  }

  private async syncItem(item: SyncItem, store: IDBObjectStore): Promise<any> {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove from sync queue on success
      store.delete(item.id);
      return await response.json();
    } catch (error) {
      // Increment retry count
      item.retryCount += 1;

      // If too many retries, remove from queue
      if (item.retryCount >= 3) {
        store.delete(item.id);
        throw error;
      }

      // Update item with new retry count
      store.put(item);
      throw error;
    }
  }

  private onSyncComplete(successful: number, failed: number): void {
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('syncComplete', {
      detail: { successful, failed }
    }));

    // Store last sync time
    localStorage.setItem('lastSync', new Date().toISOString());
  }

  async queueForSync(url: string, method: 'POST' | 'PUT' | 'DELETE', data: any): Promise<string> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const syncItem: SyncItem = {
      id: Date.now().toString(),
      url,
      method,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');

      const request = store.add(syncItem);

      request.onsuccess = () => {
        // If online, try to sync immediately
        if (this.isOnline) {
          this.triggerSync();
        }
        resolve(syncItem.id);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async getSyncStatus(): Promise<SyncStatus> {
    if (!this.db) {
      return {
        pendingItems: 0,
        isOnline: this.isOnline,
        lastSync: localStorage.getItem('lastSync')
      };
    }

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');

      const countRequest = store.count();

      countRequest.onsuccess = () => {
        resolve({
          pendingItems: countRequest.result,
          isOnline: this.isOnline,
          lastSync: localStorage.getItem('lastSync')
        });
      };

      countRequest.onerror = () => {
        resolve({
          pendingItems: 0,
          isOnline: this.isOnline,
          lastSync: localStorage.getItem('lastSync')
        });
      };
    });
  }

  async getPendingItems(): Promise<SyncItem[]> {
    if (!this.db) {
      return [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const index = store.index('timestamp');

      const getAllRequest = index.getAll();

      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    });
  }

  async clearPendingItems(): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');

      const clearRequest = store.clear();

      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
  }

  // Conflict resolution helpers
  async resolveConflict(localItem: any, serverItem: any): Promise<any> {
    // Simple conflict resolution: prefer server version for most fields
    // but preserve local notes and tags if they're newer
    
    const resolved = { ...serverItem };
    
    if (localItem.notes && localItem.updatedAt > serverItem.updatedAt) {
      resolved.notes = localItem.notes;
    }
    
    if (localItem.tags && localItem.updatedAt > serverItem.updatedAt) {
      resolved.tags = localItem.tags;
    }
    
    return resolved;
  }

  // Check if item needs sync (has local changes)
  needsSync(item: any): boolean {
    return item._dirty || item._pendingSync;
  }

  // Mark item as needing sync
  markForSync(item: any): void {
    item._dirty = true;
    item._pendingSync = true;
    item.updatedAt = new Date().toISOString();
  }
}

// Export singleton instance
export const syncService = new SyncService();

// React hook for sync status
export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    pendingItems: 0,
    isOnline: false,
    lastSync: null
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return;
    }

    const updateStatus = async () => {
      const status = await syncService.getSyncStatus();
      setSyncStatus(status);
    };

    updateStatus();

    // Listen for sync completion events
    const handleSyncComplete = () => updateStatus();
    window.addEventListener('syncComplete', handleSyncComplete);
    
    // Listen for online/offline events
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update status periodically
    const interval = setInterval(updateStatus, 5000);

    return () => {
      window.removeEventListener('syncComplete', handleSyncComplete);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return syncStatus;
}