import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet, Animated, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useSync } from '../hooks/useSync';
import { getThemeClass } from '../utils/colors';

interface InitialSyncModalProps {
  visible: boolean;
  onComplete: () => void;
}

export function InitialSyncModal({ visible, onComplete }: InitialSyncModalProps) {
  const { isDarkMode, colors } = useTheme();
  const { isSyncing, syncProgress, syncStats, startSync } = useSync();
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [syncStarted, setSyncStarted] = useState(false);
  const animatedWidth = useRef(new Animated.Value(10)).current;
  const progressWidth = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (visible && !syncStarted) {
      // Iniciar sincronização automaticamente quando o modal for exibido
      setSyncStarted(true);
      startSync(true);
    }
  }, [visible, syncStarted, startSync]);

  useEffect(() => {
    if (visible && !isSyncing && syncStarted) {
      if (syncStats?.hasLocalData) {
        // Mostrar mensagem de conclusão por 2 segundos
        setShowCompletionMessage(true);
        const timer = setTimeout(() => {
          setShowCompletionMessage(false);
          setSyncStarted(false); // Reset do estado
          onComplete();
        }, 2000);

        return () => clearTimeout(timer);
      } else {
        // Se não há dados locais mas a sincronização terminou, fechar o modal
        const timer = setTimeout(() => {
          setSyncStarted(false); // Reset do estado
          onComplete();
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, syncStats, isSyncing, syncStarted, onComplete]);

  const getProgressPercentage = () => {
    if (!syncProgress) return 5; // Valor mínimo para mostrar que está carregando
    const percentage = (syncProgress.currentHinos / syncProgress.totalHinos) * 100;
    // Usar porcentagem exata para melhor precisão
    const finalPercentage = Math.max(5, Math.min(100, percentage)); // Entre 5% e 100%
    console.log(`Progresso: ${percentage}% -> ${finalPercentage}%`);
    return finalPercentage;
  };

  const getProgressMessage = () => {
    console.log(`Modal Debug - isSyncing: ${isSyncing}, syncProgress: ${!!syncProgress}, showCompletionMessage: ${showCompletionMessage}`);
    
    if (showCompletionMessage) {
      return `Dados locais disponíveis: ${syncStats?.totalHinos} hinos salvos localmente – Atualizado em ${syncStats?.lastUpdate?.toLocaleDateString('pt-BR')}`;
    }
    
    if (isSyncing) {
      return "Aguarde enquanto as letras dos hinos estão sendo carregadas para uso offline.";
    }
    
    return "Iniciando sincronização...";
  };

  // Reset do estado quando o modal for fechado
  useEffect(() => {
    if (!visible) {
      setSyncStarted(false);
      setShowCompletionMessage(false);
    }
  }, [visible]);

  // Animação de loading quando não há dados de progresso
  useEffect(() => {
    if (visible && !syncProgress) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedWidth, {
            toValue: 30,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedWidth, {
            toValue: 10,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [visible, syncProgress, animatedWidth]);

  // Animação da barra de progresso quando há dados
  useEffect(() => {
    if (syncProgress) {
      const percentage = getProgressPercentage();
      console.log(`Animando barra para: ${percentage}%`);
      Animated.timing(progressWidth, {
        toValue: percentage,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [syncProgress, progressWidth]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.iconContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>
            {showCompletionMessage ? 'Sincronização Concluída!' : 'Inicializando Aplicativo'}
          </Text>
          
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {getProgressMessage()}
          </Text>
          
          <View style={styles.progressContainer}>
                        <View style={[styles.progressBar, { backgroundColor: '#e0e0e0' }]}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: '#007AFF', // Cor azul mais contrastante
                    width: progressWidth.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    minWidth: 8, // Largura mínima menor
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {syncProgress 
                ? `${getProgressPercentage()}% concluído (${syncProgress.currentHinos}/${syncProgress.totalHinos} hinos)`
                : 'Iniciando sincronização...'
              }
            </Text>
          </View>
          
          {showCompletionMessage && (
            <View style={styles.completionContainer}>
              <Text style={[styles.completionText, { color: colors.primary }]}>
                ✓ Sincronização concluída com sucesso!
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%', // Ocupar toda a largura disponível
    maxWidth: '90%', // Limitar a 90% da tela
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 0, // Remover padding horizontal
    alignSelf: 'stretch', // Forçar ocupar toda a largura
  },
  progressBar: {
    height: 12, // Altura adequada para visualização
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
    width: '100%', // Garantir que ocupe toda a largura
    backgroundColor: '#e0e0e0', // Cor de fundo padrão
    borderWidth: 1,
    borderColor: '#d0d0d0',
    alignSelf: 'stretch', // Forçar ocupar toda a largura
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    minWidth: 8, // Largura mínima menor
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  completionContainer: {
    marginTop: 20,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 