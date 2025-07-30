import { useState, useEffect, useCallback } from 'react';
import { SyncService, SyncProgress, SyncCallbacks } from '../services/syncService';

export interface UseSyncReturn {
  isSyncing: boolean;
  syncProgress: SyncProgress | null;
  syncStats: {
    hasLocalData: boolean;
    totalHinos: number;
    lastUpdate: Date | null;
    cacheValid: boolean;
  } | null;
  startSync: (force?: boolean) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useSync(): UseSyncReturn {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [syncStats, setSyncStats] = useState<{
    hasLocalData: boolean;
    totalHinos: number;
    lastUpdate: Date | null;
    cacheValid: boolean;
  } | null>(null);

  const loadSyncStats = useCallback(async () => {
    try {
      const stats = await SyncService.getSyncStats();
      setSyncStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas de sincronização:', error);
    }
  }, []);

  const startSync = useCallback(async (force: boolean = false) => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncProgress(null);

    try {
      const callbacks: SyncCallbacks = {
        onProgress: (progress) => {
          setSyncProgress(progress);
        },
        onComplete: async (result) => {
          setIsSyncing(false);
          setSyncProgress(null);
          
          if (result.success) {
            // Recarregar estatísticas após sincronização
            await loadSyncStats();
          }
        }
      };

      if (force) {
        await SyncService.forceSync(callbacks);
      } else {
        await SyncService.syncIfNeeded(callbacks);
      }
    } catch (error) {
      console.error('Erro durante sincronização:', error);
      setIsSyncing(false);
      setSyncProgress(null);
    }
  }, [isSyncing, loadSyncStats]);

  const refreshStats = useCallback(async () => {
    await loadSyncStats();
  }, [loadSyncStats]);

  // Carregar estatísticas iniciais
  useEffect(() => {
    loadSyncStats();
  }, [loadSyncStats]);

  return {
    isSyncing,
    syncProgress,
    syncStats,
    startSync,
    refreshStats
  };
} 