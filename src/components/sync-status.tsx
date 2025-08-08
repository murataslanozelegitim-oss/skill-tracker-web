'use client';

import { useState } from 'react';
import { useSyncStatus } from '@/lib/sync-service';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function SyncStatus() {
  const syncStatus = useSyncStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const { syncService } = await import('@/lib/sync-service');
      await syncService.manualSync();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {syncStatus.isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          {syncStatus.pendingItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {syncStatus.pendingItems}
            </Badge>
          )}
          <span className="sr-only">Sync status</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Sync Status</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualSync}
              disabled={isSyncing || !syncStatus.isOnline}
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync Now
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connection</span>
              <div className="flex items-center gap-2">
                {syncStatus.isOnline ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Online</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Offline</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Items</span>
              <Badge variant={syncStatus.pendingItems > 0 ? "destructive" : "secondary"}>
                {syncStatus.pendingItems}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Sync</span>
              <span className="text-sm">{formatLastSync(syncStatus.lastSync)}</span>
            </div>
          </div>

          {syncStatus.pendingItems > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {syncStatus.pendingItems} item(s) waiting to sync. They will be automatically synced when you're online.
              </p>
              <div className="text-xs text-muted-foreground">
                <p>• Observations and notes are saved locally</p>
                <p>• Data syncs automatically when online</p>
                <p>• You can continue working offline</p>
              </div>
            </div>
          )}

          {!syncStatus.isOnline && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're currently offline. Your data will be saved locally and synced when you reconnect.
              </p>
              <div className="text-xs text-muted-foreground">
                <p>• All features work offline</p>
                <p>• Data is stored on your device</p>
                <p>• Automatic sync when online</p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}