import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSync } from '../hooks/useSync';
import { getThemeClass } from '../utils/colors';

interface SyncStatusProps {
  onSyncPress?: () => void;
}

export function SyncStatus({ onSyncPress }: SyncStatusProps) {
  const { isDarkMode, colors } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const { isSyncing, syncProgress, syncStats, startSync } = useSync();

  // Fechar modal automaticamente quando a sincronização terminar
  useEffect(() => {
    if (!isSyncing && syncProgress?.isComplete) {
      // Aguardar um pouco para mostrar o resultado antes de fechar
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // 2 segundos para mostrar "Concluído!"

      return () => clearTimeout(timer);
    }
  }, [isSyncing, syncProgress]);

  // Fechar modal também quando a sincronização terminar sem progresso
  useEffect(() => {
    if (!isSyncing && syncStats?.hasLocalData && syncStats?.cacheValid) {
      // Se não está sincronizando e os dados estão atualizados, fechar após um tempo
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // 3 segundos para mostrar o status atualizado

      return () => clearTimeout(timer);
    }
  }, [isSyncing, syncStats]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSyncPress = async () => {
    if (isSyncing) return; // Evitar múltiplas sincronizações simultâneas
    
    try {
      await startSync(true); // Forçar sincronização
      
      // Chamar callback original se fornecido
      if (onSyncPress) {
        onSyncPress();
      }
      
      // Fechar modal após sincronização (com delay para mostrar o resultado)
      setTimeout(() => {
        setIsVisible(false);
      }, 2500); // 2.5 segundos para mostrar o resultado
    } catch (error) {
      console.error('Erro durante sincronização:', error);
    }
  };

  // Não mostrar o componente se não há dados locais ou se está sincronizando
  if (!isVisible || !syncStats) {
    return null;
  }

  // Não mostrar se já existem dados locais válidos e não está sincronizando
  if (syncStats.hasLocalData && syncStats.cacheValid && !isSyncing) {
    return null;
  }

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d atrás`;
  };

  const getStatusColor = () => {
    if (!syncStats.hasLocalData) return '#f59e0b'; // Amarelo - sem dados
    if (!syncStats.cacheValid) return '#ef4444'; // Vermelho - cache expirado
    return '#10b981'; // Verde - tudo ok
  };

  const getStatusText = () => {
    if (isSyncing) return 'Sincronizando...';
    if (!syncStats.hasLocalData) return 'Sem dados locais';
    if (!syncStats.cacheValid) return 'Dados desatualizados';
    return 'Dados atualizados';
  };

  const getStatusIcon = () => {
    if (isSyncing) return 'refresh-cw';
    if (!syncStats.hasLocalData) return 'alert-circle';
    if (!syncStats.cacheValid) return 'clock';
    return 'check-circle';
  };

  const getProgressText = () => {
    if (!syncProgress) return '';
    
    if (syncProgress.isComplete) {
      return `Concluído! ${syncProgress.totalHinos} hinos sincronizados`;
    }
    
    return `Página ${syncProgress.currentPage} de ${syncProgress.totalPages} (${syncProgress.currentHinos} hinos)`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.headerRow}>
        <View style={styles.statusInfo}>
          {isSyncing ? (
            <ActivityIndicator size={16} color={getStatusColor()} />
          ) : (
            <Feather 
              name={getStatusIcon() as any} 
              size={16} 
              color={getStatusColor()} 
            />
          )}
          <Text style={[styles.statusText, { color: colors.text }]}>
            {getStatusText()}
          </Text>
        </View>
        
        {!isSyncing && (
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={handleClose}
          >
            <Feather name="x" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      
      {isSyncing && syncProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.primary,
                  width: `${(syncProgress.currentPage / syncProgress.totalPages) * 100}%`
                }
              ]} 
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {getProgressText()}
          </Text>
        </View>
      )}
      
      {!isSyncing && (
        <>
          <View style={styles.contentRow}>
            {syncStats.hasLocalData && (
              <Text style={[styles.hinosCount, { color: colors.textSecondary }]}>
                {syncStats.totalHinos} hinos
              </Text>
            )}
          </View>
          
          {syncStats.hasLocalData && syncStats.lastUpdate && (
            <Text style={[styles.lastUpdate, { color: colors.textTertiary }]}>
              Última atualização: {formatLastUpdate(syncStats.lastUpdate)}
            </Text>
          )}
        </>
      )}
      
      {/* Só mostrar o botão de sincronização se não há dados locais válidos */}
      {onSyncPress && !isSyncing && (!syncStats.hasLocalData || !syncStats.cacheValid) && (
        <TouchableOpacity 
          style={[styles.syncButton, { backgroundColor: colors.primary }]}
          onPress={handleSyncPress}
          disabled={isSyncing}
        >
          <Feather name="refresh-cw" size={14} color="white" />
          <Text style={styles.syncButtonText}>Sincronizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8, // mt-2 equivalente
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  closeButton: {
    padding: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  hinosCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastUpdate: {
    fontSize: 11,
    marginTop: 2,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    gap: 4,
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
}); 