import { syncService, type SyncItem } from './sync-service'
import { useState } from 'react'

export class SyncManager {
  private userId: string | null = null

  constructor() {
    // Get user ID from localStorage or context
    this.userId = localStorage.getItem('userId')
  }

  setUserId(userId: string) {
    this.userId = userId
    localStorage.setItem('userId', userId)
  }

  async queueObservation(observationData: any): Promise<string> {
    if (!this.userId) {
      throw new Error('User not authenticated')
    }

    const syncItem = {
      action: 'CREATE_OBSERVATION',
      data: observationData,
      userId: this.userId,
      timestamp: new Date().toISOString()
    }

    return await syncService.queueForSync('/api/sync', 'POST', {
      userId: this.userId,
      syncItems: [syncItem]
    })
  }

  async queueObservationUpdate(observationId: string, updateData: any): Promise<string> {
    if (!this.userId) {
      throw new Error('User not authenticated')
    }

    const syncItem = {
      action: 'UPDATE_OBSERVATION',
      data: { id: observationId, ...updateData },
      userId: this.userId,
      timestamp: new Date().toISOString()
    }

    return await syncService.queueForSync('/api/sync', 'POST', {
      userId: this.userId,
      syncItems: [syncItem]
    })
  }

  async queueObservationDelete(observationId: string): Promise<string> {
    if (!this.userId) {
      throw new Error('User not authenticated')
    }

    const syncItem = {
      action: 'DELETE_OBSERVATION',
      data: { id: observationId },
      userId: this.userId,
      timestamp: new Date().toISOString()
    }

    return await syncService.queueForSync('/api/sync', 'POST', {
      userId: this.userId,
      syncItems: [syncItem]
    })
  }

  async syncNow(): Promise<{ successful: number; failed: number }> {
    if (!this.userId) {
      throw new Error('User not authenticated')
    }

    try {
      // Get pending items from IndexedDB
      const pendingItems = await syncService.getPendingItems()
      
      if (pendingItems.length === 0) {
        return { successful: 0, failed: 0 }
      }

      // Group items by user
      const userItems = pendingItems.filter(item => item.data.userId === this.userId)
      
      if (userItems.length === 0) {
        return { successful: 0, failed: 0 }
      }

      // Send to server
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          syncItems: userItems.map(item => item.data)
        })
      })

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`)
      }

      const result = await response.json()
      
      // Clear successfully synced items from IndexedDB
      const successfulIds = result.results
        .filter((r: any) => r.success)
        .map((r: any) => r.id)
      
      if (successfulIds.length > 0) {
        await this.clearSyncedItems(successfulIds)
      }

      return {
        successful: result.results.filter((r: any) => r.success).length,
        failed: result.results.filter((r: any) => !r.success).length
      }
    } catch (error) {
      console.error('Sync failed:', error)
      throw error
    }
  }

  private async clearSyncedItems(itemIds: string[]): Promise<void> {
    // This would remove items from IndexedDB
    // For now, we'll rely on the service worker to handle this
  }

  async getSyncStatus() {
    const status = await syncService.getSyncStatus()
    
    if (this.userId) {
      try {
        // Get server-side sync status
        const response = await fetch(`/api/sync?userId=${this.userId}`)
        if (response.ok) {
          const serverData = await response.json()
          return {
            ...status,
            serverItems: serverData.syncItems.length
          }
        }
      } catch (error) {
        console.error('Error fetching server sync status:', error)
      }
    }
    
    return status
  }

  async clearAllSyncItems(): Promise<void> {
    if (!this.userId) {
      throw new Error('User not authenticated')
    }

    // Clear from IndexedDB
    await syncService.clearPendingItems()
    
    // Clear from server
    try {
      await fetch(`/api/sync?userId=${this.userId}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Error clearing server sync items:', error)
    }
  }
}

// Export singleton instance
export const syncManager = new SyncManager()

// React hook for sync management
export function useSyncManager() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<any>(null)

  const syncNow = async () => {
    setIsSyncing(true)
    try {
      const result = await syncManager.syncNow()
      setSyncStatus(result)
      return result
    } catch (error) {
      console.error('Sync failed:', error)
      setSyncStatus({ successful: 0, failed: 1, error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    } finally {
      setIsSyncing(false)
    }
  }

  const queueObservation = async (observationData: any) => {
    try {
      const syncId = await syncManager.queueObservation(observationData)
      return syncId
    } catch (error) {
      console.error('Failed to queue observation:', error)
      throw error
    }
  }

  return {
    isSyncing,
    syncStatus,
    syncNow,
    queueObservation,
    setUserId: syncManager.setUserId.bind(syncManager)
  }
}