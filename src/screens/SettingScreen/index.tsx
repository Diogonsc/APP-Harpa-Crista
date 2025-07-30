import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SettingItem } from "../../components/SettingItem";
import { useTheme } from "../../contexts/ThemeContext";
import { StatusBar } from "../../components/StatusBar";
import { getThemeClass } from "../../utils/colors";
import { SyncService } from "../../services/syncService";
import { LocalStorageService } from "../../services/localStorageService";

type SettingScreenProps = {
  navigation: any;
};

export function SettingScreen({ navigation }: SettingScreenProps) {
  const { isDarkMode, toggleTheme, setTheme, colors } = useTheme();
  const [notifications, setNotifications] = useState(false);
  const [hasLocalData, setHasLocalData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar dados locais ao carregar a tela
  useEffect(() => {
    checkLocalData();
  }, []);

  const checkLocalData = async () => {
    try {
      setIsLoading(true);
      const stats = await SyncService.getSyncStats();
      setHasLocalData(stats.hasLocalData);
      console.log('Dados locais verificados:', stats);
    } catch (error) {
      console.error('Erro ao verificar dados locais:', error);
      setHasLocalData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateApp = () => {
    console.log('Abrir avaliação do app');
  };

  const handleShareApp = () => {
    console.log('Compartilhar app');
  };

  const handleTermsOfUse = () => {
    navigation.navigate('TermsScreen');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyScreen');
  };

  const handleDeveloperInfo = () => {
    navigation.navigate('DeveloperScreen');
  };

  const handleThemeToggle = (value: boolean) => {
    setTheme(value);
  };

  const handleSyncHinos = async () => {
    try {
      Alert.alert(
        'Sincronizar Hinos',
        'Isso irá baixar todos os hinos da Harpa Cristã para uso offline. Deseja continuar?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Sincronizar',
            onPress: async () => {
              try {
                const result = await SyncService.forceSync({
                  onProgress: (progress) => {
                    console.log(`Sincronizando: ${progress.currentPage}/${progress.totalPages} páginas`);
                  },
                  onComplete: (result) => {
                    if (result.success) {
                      Alert.alert(
                        'Sincronização Concluída',
                        `${result.totalHinos} hinos foram baixados com sucesso! Agora você pode usar o app offline.`
                      );
                      // Atualizar estado após sincronização
                      setHasLocalData(true);
                    } else {
                      Alert.alert(
                        'Erro na Sincronização',
                        result.error || 'Ocorreu um erro durante a sincronização. Tente novamente.'
                      );
                    }
                  }
                });
              } catch (error) {
                console.error('Erro ao sincronizar:', error);
                Alert.alert(
                  'Erro na Sincronização',
                  'Não foi possível sincronizar os hinos. Verifique sua conexão com a internet e tente novamente.'
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao iniciar sincronização:', error);
    }
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Limpar Cache',
      'Isso irá remover todos os hinos baixados. Você terá que sincronizar novamente para usar offline. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await LocalStorageService.clearCache();
              setHasLocalData(false);
              Alert.alert('Cache Limpo', 'Todos os dados foram removidos.');
            } catch (error) {
              console.error('Erro ao limpar cache:', error);
              Alert.alert('Erro', 'Não foi possível limpar o cache.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className={`flex-1 ${getThemeClass(isDarkMode, 'background')}`} edges={['left', 'right']}>
      <StatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => console.log('Ajuda')}>
            <Feather name="help-circle" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Informações')}>
            <Feather name="info" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo Principal */}
      <View className="flex-1 px-5 mx-4 mt-8">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 32}}>
          {/* Seção Aparência */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-3 ${getThemeClass(isDarkMode, 'text')}`}>
              Aparência
            </Text>
            <View className={`rounded-xl px-4 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Tema Escuro"
                subtitle="Alternar entre tema claro e escuro"
                type="toggle"
                value={isDarkMode}
                onToggle={handleThemeToggle}
              />
            </View>
          </View>

          {/* Seção Dados */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-3 ${getThemeClass(isDarkMode, 'text')}`}>
              Dados
            </Text>
            <View className={`rounded-xl px-4 ${getThemeClass(isDarkMode, 'surface')}`}>
              {!hasLocalData ? (
                <SettingItem
                  title="Sincronizar Hinos"
                  subtitle="Baixar todos os hinos para uso offline"
                  type="link"
                  onPress={handleSyncHinos}
                />
              ) : (
                <>
                  <SettingItem
                    title="✅ Hinos Sincronizados"
                    subtitle="Todos os hinos estão disponíveis offline"
                    type="info"
                    onPress={() => {}}
                  />
                  <View className="mt-3">
                    <SettingItem
                      title="Sincronizar Novamente"
                      subtitle="Atualizar dados dos hinos"
                      type="link"
                      onPress={handleSyncHinos}
                    />
                  </View>
                  <View className="mt-3">
                    <SettingItem
                      title="Limpar Cache"
                      subtitle="Remover hinos baixados"
                      type="link"
                      onPress={handleClearCache}
                    />
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Seção Notificações */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-3 ${getThemeClass(isDarkMode, 'text')}`}>
              Notificações
            </Text>
            <View className={`rounded-xl px-4 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Notificações"
                subtitle="Receber notificações sobre novos hinos"
                type="toggle"
                value={notifications}
                onToggle={setNotifications}
              />
            </View>
          </View>

          {/* Seção Sobre o App */}
          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-3 ${getThemeClass(isDarkMode, 'text')}`}>
              Sobre o App
            </Text>
            <View className={`rounded-xl px-4 mb-3 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Avaliar App"
                subtitle="Deixe sua avaliação na loja"
                type="link"
                onPress={handleRateApp}
              />
            </View>
            <View className={`rounded-xl px-4 mb-3 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Compartilhar App"
                subtitle="Compartilhe com amigos"
                type="link"
                onPress={handleShareApp}
              />
            </View>
            <View className={`rounded-xl px-4 mb-3 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Termos de Uso"
                subtitle="Leia os termos de uso"
                type="link"
                onPress={handleTermsOfUse}
              />
            </View>
            <View className={`rounded-xl px-4 mb-3 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Política de Privacidade"
                subtitle="Leia a política de privacidade"
                type="link"
                onPress={handlePrivacyPolicy}
              />
            </View>
            <View className={`rounded-xl px-4 ${getThemeClass(isDarkMode, 'surface')}`}>
              <SettingItem
                title="Sobre o Desenvolvedor"
                subtitle="Saiba mais sobre o desenvolvedor"
                type="link"
                onPress={handleDeveloperInfo}
              />
            </View>
          </View>

          {/* Versão do app */}
          <View className="items-center py-6">
            <Text className={`text-sm ${getThemeClass(isDarkMode, 'textSecondary')}`}>
              Versão 1.0.0
            </Text>
          </View>

          {/* Espaço extra para evitar que o conteúdo fique sob a tab bar */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
}); 