import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSync } from '../hooks/useSync';
import { getThemeClass } from '../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function SyncStatus() {
  const { isDarkMode, colors } = useTheme();
  const { isSyncing, syncProgress, syncStats, startSync } = useSync();
  const [showSyncStatus, setShowSyncStatus] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const progressWidth = new Animated.Value(0);

  const handleSync = () => {
    setShowProgress(true);
    startSync(true); // Forçar sincronização
  };

  // Verificar se deve mostrar o SyncStatus semanalmente
  useEffect(() => {
    const checkWeeklySync = async () => {
      try {
        const lastSyncCheck = await AsyncStorage.getItem('lastSyncCheck');
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 dias em millisegundos

        if (!lastSyncCheck || (now - parseInt(lastSyncCheck)) > oneWeek) {
          setShowSyncStatus(true);
          await AsyncStorage.setItem('lastSyncCheck', now.toString());
        }
      } catch (error) {
        console.error('Erro ao verificar sincronização semanal:', error);
      }
    };

    checkWeeklySync();
  }, []);

  // Animação da barra de progresso
  useEffect(() => {
    if (isSyncing && syncProgress) {
      const percentage = (syncProgress.currentHinos / syncProgress.totalHinos) * 100;
      Animated.timing(progressWidth, {
        toValue: percentage,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (!isSyncing && showProgress) {
      // Esconder progresso após sincronização
      setTimeout(() => {
        setShowProgress(false);
        setShowSyncStatus(false);
      }, 2000);
    }
  }, [isSyncing, syncProgress, showProgress, progressWidth]);

  if (!syncStats || !showSyncStatus) {
    return null;
  }

  const getStatusColor = () => {
    if (isSyncing) return colors.primary;
    if (syncStats.hasLocalData) return '#4CAF50'; // Verde
    return '#FF9800'; // Laranja
  };

  const getStatusText = () => {
    if (isSyncing) return 'Sincronizando...';
    if (syncStats.hasLocalData) return 'Sincronização concluída!';
    return 'Sem dados locais';
  };

  const getStatusIcon = () => {
    if (isSyncing) return 'refresh-cw';
    if (syncStats.hasLocalData) return 'check-circle';
    return 'alert-circle';
  };

  return (
    <View className="px-4 py-2">
      <View 
        className={`flex-row items-center justify-between p-3 rounded-lg ${getThemeClass(isDarkMode, 'surface')}`}
        style={{
          borderLeftWidth: 3,
          borderLeftColor: getStatusColor(),
        }}
      >
        <View className="flex-row items-center flex-1">
          {isSyncing ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Feather 
              name={getStatusIcon() as any} 
              size={16} 
              color={getStatusColor()} 
            />
          )}
          
          <View className="ml-3 flex-1">
            <Text 
              className={`text-sm font-medium ${getThemeClass(isDarkMode, 'text')}`}
              style={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Text>
            
            {syncStats.hasLocalData && (
              <Text className={`text-xs ${getThemeClass(isDarkMode, 'textSecondary')}`}>
                {syncStats.totalHinos} hinos salvos localmente
                {syncStats.lastUpdate && (
                  ` • Atualizado em ${syncStats.lastUpdate.toLocaleDateString('pt-BR')}`
                )}
              </Text>
            )}
            
            {isSyncing && syncProgress && (
              <Text className={`text-xs ${getThemeClass(isDarkMode, 'textSecondary')}`}>
                {syncProgress.currentHinos}/{syncProgress.totalHinos} hinos 
                ({syncProgress.currentPage}/{syncProgress.totalPages} páginas)
              </Text>
            )}
          </View>
        </View>
        
        {!isSyncing && (
          <TouchableOpacity
            className={`px-3 py-1.5 rounded-lg ${getThemeClass(isDarkMode, 'primary')}`}
            onPress={handleSync}
            activeOpacity={0.7}
          >
            <Text 
              className="text-xs font-medium"
              style={{ color: colors.background }}
            >
              Sincronizar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Barra de progresso */}
      {showProgress && (
        <View className="mt-3">
          <View 
            className="h-3 bg-gray-200 rounded-full overflow-hidden"
            style={{ backgroundColor: '#e0e0e0' }}
          >
            <Animated.View 
              className="h-full rounded-full"
              style={{
                backgroundColor: colors.primary,
                width: progressWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          </View>
          {syncProgress && (
            <Text className={`text-xs text-center mt-1 ${getThemeClass(isDarkMode, 'textSecondary')}`}>
              {Math.round((syncProgress.currentHinos / syncProgress.totalHinos) * 100)}% concluído
            </Text>
          )}
        </View>
      )}
    </View>
  );
} 