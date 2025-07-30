import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Dimensions, Alert } from "react-native";
import { getThemeClass } from "../../utils/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Audio as AudioType } from '../../types/api';
import { buildApiUrl, API_CONFIG, validateAudioUrl, testAudioUrl, logError } from '../../config/api';
import { useTheme } from '../../contexts/ThemeContext';
import { ApiService } from '../../services/api';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from '../../components/StatusBar';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAudio } from '../../hooks/useSafeAudio';

const { width } = Dimensions.get('window');

interface AudioDetailsScreenProps {
  route: {
    params: {
      audio: AudioType;
    };
  };
  navigation: any;
}

export function AudioDetailsScreen({ route, navigation }: AudioDetailsScreenProps) {
  const { isDarkMode, colors } = useTheme();
  
  // Estado para o efeito de batimento cardíaco
  const [heartbeatAnim] = useState(new Animated.Value(1));
  const [showPlayer, setShowPlayer] = useState(false);
  
  // Dados do áudio vindos da navegação
  const [audioData, setAudioData] = useState<AudioType>(route.params.audio);

  // Estados para o player de áudio usando expo-av
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Hook para operações seguras de áudio
  const { safePause, safePlay, safeStop, safeSeek, safeUnload } = useSafeAudio({
    sound,
    isLoaded,
    isPlaying,
    setIsPlaying,
  });

  // Estados para navegação entre hinos
  const [previousAudio, setPreviousAudio] = useState<AudioType | null>(null);
  const [nextAudio, setNextAudio] = useState<AudioType | null>(null);
  const [loadingNavigation, setLoadingNavigation] = useState(false);

  // Estados para download
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Estados para compartilhamento
  const [isSharing, setIsSharing] = useState(false);
  const [hinoCompleto, setHinoCompleto] = useState<any>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // Animações
  const [headerOpacity] = useState(new Animated.Value(1));
  const [headerTranslateY] = useState(new Animated.Value(0));

  // Função para validar URL de áudio
  const validarAudioUrl = useCallback((url: string): boolean => {
    return validateAudioUrl(url);
  }, []);

  // Função para testar se a URL de áudio está acessível
  const testarAudioUrl = useCallback(async (url: string): Promise<boolean> => {
    return await testAudioUrl(url);
  }, []);

  // Função para corrigir URL do áudio (adicionar zeros à esquerda)
  const corrigirAudioUrl = useCallback((url: string): string => {
    try {
      // Extrair o número do hino da URL
      const match = url.match(/(\d+)\.mp3$/);
      if (match) {
        const numeroHino = parseInt(match[1]);
        // Formatar com zeros à esquerda (001, 002, etc.)
        const numeroFormatado = numeroHino.toString().padStart(3, '0');
        // Substituir na URL
        const urlCorrigida = url.replace(/(\d+)\.mp3$/, `${numeroFormatado}.mp3`);
        return urlCorrigida;
      }
      return url;
    } catch (error) {
      return url;
    }
  }, []);

  // Função para verificar se o arquivo já foi baixado
  const verificarArquivoBaixado = useCallback(async () => {
    try {
      const filename = `hino_${audioData.numero.toString().padStart(3, '0')}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}downloads/${filename}`;
      
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      setIsDownloaded(fileInfo.exists);
    } catch (error) {
      console.error('Erro ao verificar arquivo baixado:', error);
      setIsDownloaded(false);
    }
  }, [audioData.numero]);

  // Função para baixar o áudio
  const baixarAudio = useCallback(async () => {
    if (!audioUrl) {
      Alert.alert('Erro', 'URL do áudio não disponível para download.');
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      setDownloadError(null);

      // Criar diretório de downloads se não existir
      const downloadsDir = `${FileSystem.documentDirectory}downloads/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadsDir);
      
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true });
      }

      // Nome do arquivo
      const filename = `hino_${audioData.numero.toString().padStart(3, '0')}.mp3`;
      const fileUri = `${downloadsDir}${filename}`;

      // Verificar se já existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setIsDownloaded(true);
        setIsDownloading(false);
        Alert.alert('Sucesso', 'Este áudio já foi baixado anteriormente.');
        return;
      }

      // Baixar o arquivo
      const downloadResumable = FileSystem.createDownloadResumable(
        audioUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setDownloadProgress(progress);
        }
      );

      const result = await downloadResumable.downloadAsync();
      
      if (result && result.uri) {
        setIsDownloaded(true);
        setDownloadProgress(1);
        Alert.alert(
          'Download Concluído', 
          `O áudio "${audioData.titulo}" foi baixado com sucesso!`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erro ao baixar áudio:', error);
      setDownloadError('Erro ao baixar o áudio. Verifique sua conexão e tente novamente.');
      Alert.alert('Erro', 'Não foi possível baixar o áudio. Verifique sua conexão e tente novamente.');
    } finally {
      setIsDownloading(false);
    }
  }, [audioUrl, audioData.numero, audioData.titulo]);

  // Função para carregar dados completos do hino
  const carregarHinoCompleto = useCallback(async () => {
    try {
      const response = await fetch(`https://api-harpa-crista-uzgo.vercel.app/api/hinos/${audioData.numero}`);
      const data = await response.json();
      
      if (data && data.number) {
        setHinoCompleto(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados completos do hino:', error);
    }
  }, [audioData.numero]);

  // Função para compartilhar texto (letra do hino)
  const compartilharTexto = useCallback(async () => {
    try {
      if (!hinoCompleto) {
        Alert.alert('Aviso', 'Carregando dados do hino...');
        return;
      }

      let letraCompleta = `Hino ${hinoCompleto.number} - ${hinoCompleto.title}\n`;
      letraCompleta += `Autor: ${hinoCompleto.author}\n\n`;

      if (hinoCompleto.verses && Array.isArray(hinoCompleto.verses)) {
        hinoCompleto.verses.forEach((verso: any, index: number) => {
          if (verso.lyrics) {
            if (!verso.chorus) {
              letraCompleta += `${verso.sequence}. `;
            }
            letraCompleta += verso.lyrics;
            if (index < hinoCompleto.verses.length - 1) {
              letraCompleta += '\n\n';
            }
          }
        });
      }

      // Usar o API nativo do React Native para copiar para clipboard
      const { Clipboard } = require('react-native');
      Clipboard.setString(letraCompleta);
      
      Alert.alert(
        'Letra Copiada!', 
        'A letra do hino foi copiada para a área de transferência.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao compartilhar texto:', error);
      Alert.alert('Erro', 'Não foi possível copiar a letra do hino.');
    }
  }, [hinoCompleto]);

  // Função para compartilhar arquivo de áudio
  const compartilharAudio = useCallback(async () => {
    try {
      setIsSharing(true);
      setShareError(null);

      // Verificar se o arquivo foi baixado
      const filename = `hino_${audioData.numero.toString().padStart(3, '0')}.mp3`;
      const fileUri = `${FileSystem.documentDirectory}downloads/${filename}`;
      
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      
      if (!fileInfo.exists) {
        Alert.alert(
          'Arquivo não encontrado', 
          'Para compartilhar o áudio, você precisa baixá-lo primeiro.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Baixar agora', onPress: () => baixarAudio() }
          ]
        );
        return;
      }

      Alert.alert(
        'Arquivo Disponível',
        `O arquivo do hino ${audioData.numero} está disponível em:\n${fileUri}\n\nVocê pode acessar este arquivo através do gerenciador de arquivos do seu dispositivo.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro ao compartilhar áudio:', error);
      setShareError('Erro ao compartilhar o áudio. Tente novamente.');
      Alert.alert('Erro', 'Não foi possível compartilhar o áudio.');
    } finally {
      setIsSharing(false);
    }
  }, [audioData.numero, audioData.titulo]);

  // Função para mostrar menu de compartilhamento
  const handleShare = useCallback(() => {
    Alert.alert(
      'Compartilhar',
      'O que você gostaria de compartilhar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Letra do Hino', 
          onPress: compartilharTexto 
        },
        { 
          text: 'Arquivo de Áudio', 
          onPress: compartilharAudio 
        }
      ]
    );
  }, [compartilharTexto, compartilharAudio]);

  // Função para buscar hinos adjacentes
  const buscarHinosAdjacentes = useCallback(async (numeroAtual: number) => {
    try {
      setLoadingNavigation(true);
      
      // Buscar hino anterior
      if (numeroAtual > 1) {
        try {
          const hinoAnterior = await ApiService.getAudioPorHino(numeroAtual - 1);
          if (hinoAnterior) {
            setPreviousAudio(hinoAnterior);
          }
        } catch (error) {
          console.log('Hino anterior não encontrado:', error);
        }
      } else {
        setPreviousAudio(null);
      }

      // Buscar próximo hino
      if (numeroAtual < 640) {
        try {
          const proximoHino = await ApiService.getAudioPorHino(numeroAtual + 1);
          if (proximoHino) {
            setNextAudio(proximoHino);
          }
        } catch (error) {
          console.log('Próximo hino não encontrado:', error);
        }
      } else {
        setNextAudio(null);
      }
    } catch (error) {
      console.error('Erro ao buscar hinos adjacentes:', error);
    } finally {
      setLoadingNavigation(false);
    }
  }, []);

  // Função para navegar para outro hino
  const navegarParaHino = useCallback(async (novoAudio: AudioType) => {
    try {
      // Parar reprodução atual
      if (sound && isLoaded) {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.warn('Erro ao descarregar áudio ao navegar:', error);
        }
      }
      
      // Resetar estados
      setSound(null);
      setIsPlaying(false);
      setIsLoaded(false);
      setDuration(0);
      setPosition(0);
      setAudioError(null);
      setAudioUrl(null);
      setShowPlayer(false);
      
      // Atualizar dados do áudio
      setAudioData(novoAudio);
      
      // Buscar hinos adjacentes para o novo hino
      await buscarHinosAdjacentes(novoAudio.numero);
      
    } catch (error) {
      console.error('Erro ao navegar para hino:', error);
      Alert.alert('Erro', 'Não foi possível navegar para o hino selecionado.');
    }
  }, [sound, isLoaded, buscarHinosAdjacentes]);

  // Carregar áudio quando a URL estiver disponível
  const carregarAudioHino = useCallback(async () => {
    try {
      setAudioError(null);
      
      let urlParaTestar = null;
      
      // Verificar se o audioData já tem audioUrl
      if (audioData?.audioUrl && validarAudioUrl(audioData.audioUrl)) {
        urlParaTestar = corrigirAudioUrl(audioData.audioUrl);
      }
      
      if (urlParaTestar) {
        // Testar se a URL está acessível
        const isAcessivel = await testarAudioUrl(urlParaTestar);
        if (isAcessivel) {
          setAudioUrl(urlParaTestar);
        } else {
          setAudioError('Áudio não está disponível no momento. O arquivo pode ter sido removido ou o servidor está indisponível.');
        }
      } else {
        setAudioError('Este hino não possui áudio disponível.');
      }
    } catch (error) {
      logError('Carregar Áudio', error, { audioNumero: audioData.numero });
      setAudioError('Erro ao verificar disponibilidade do áudio. Tente novamente mais tarde.');
    }
  }, [audioData, validarAudioUrl, testarAudioUrl, corrigirAudioUrl]);

  // Carregar o áudio quando a URL mudar
  useEffect(() => {
    const carregarAudio = async () => {
      if (!audioUrl) return;

      try {
        setAudioError(null);
        
        // Configurar o modo de áudio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        // Criar o objeto de som
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false },
          onPlaybackStatusUpdate
        );

        setSound(newSound);
        setIsLoaded(true);
      } catch (error) {
        logError('Carregar Áudio Expo', error, { audioUrl });
        setAudioError('Não foi possível carregar o áudio');
        setIsLoaded(false);
      }
    };

    carregarAudio();

    return () => {
      safeUnload();
    };
  }, [audioUrl]);

  // Callback para atualizar o status do áudio
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      setPosition(status.positionMillis ? status.positionMillis / 1000 : 0);
    }
  };

  // Carregar hinos adjacentes quando o áudio mudar
  useEffect(() => {
    buscarHinosAdjacentes(audioData.numero);
  }, [audioData.numero, buscarHinosAdjacentes]);

  // Verificar se o arquivo já foi baixado quando o áudio mudar
  useEffect(() => {
    verificarArquivoBaixado();
  }, [audioData.numero, verificarArquivoBaixado]);

  // Carregar dados completos do hino quando o áudio mudar
  useEffect(() => {
    carregarHinoCompleto();
  }, [audioData.numero, carregarHinoCompleto]);

  useEffect(() => {
    carregarAudioHino();
  }, [carregarAudioHino]);

  // Parar áudio quando a tela perder o foco
  useFocusEffect(
    useCallback(() => {
      // Função executada quando a tela ganha foco
      return () => {
        // Função executada quando a tela perde foco
        if (sound && isPlaying && isLoaded) {
          safePause();
        }
      };
    }, [sound, isPlaying, isLoaded, safePause])
  );

  // Efeito de batimento cardíaco quando está tocando
  useEffect(() => {
    if (isPlaying) {
      const heartbeatAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(heartbeatAnim, {
            toValue: 1.1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(heartbeatAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      heartbeatAnimation.start();
      
      return () => heartbeatAnimation.stop();
    } else {
      heartbeatAnim.setValue(1);
    }
  }, [isPlaying, heartbeatAnim]);

  // Função para reproduzir/pausar áudio
  const handlePlayAudio = useCallback(async () => {
    try {
      if (audioError) {
        Alert.alert('Erro', audioError);
        return;
      }

      if (!audioUrl) {
        Alert.alert('Erro', 'URL do áudio não disponível');
        return;
      }

      if (!sound || !isLoaded) {
        Alert.alert('Aviso', 'Aguarde o áudio carregar...');
        return;
      }

      // Se terminou a faixa, volte ao início antes de tocar novamente
      const atEnd = duration > 0 && Math.abs(duration - position) < 0.25;
      if (atEnd) {
        await safeSeek(0);
      }

      if (isPlaying) {
        await safePause();
      } else {
        await safePlay();
      }

      setShowPlayer(true);
    } catch (err) {
      logError('Controlar Áudio', err, { audioUrl, isPlaying });
      Alert.alert('Erro', `Erro ao controlar o áudio: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [audioUrl, sound, isLoaded, isPlaying, duration, position, audioError]);

  const handlePrevious = useCallback(async () => {
    if (previousAudio && !loadingNavigation) {
      await navegarParaHino(previousAudio);
    } else if (!previousAudio) {
      Alert.alert('Informação', 'Este é o primeiro hino da coleção.');
    }
  }, [previousAudio, loadingNavigation, navegarParaHino]);

  const handleNext = useCallback(async () => {
    if (nextAudio && !loadingNavigation) {
      await navegarParaHino(nextAudio);
    } else if (!nextAudio) {
      Alert.alert('Informação', 'Este é o último hino da coleção.');
    }
  }, [nextAudio, loadingNavigation, navegarParaHino]);

  const controlsDisabled = !isLoaded || !!audioError;

  // Formatar duração
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatar progresso do download
  const formatDownloadProgress = (progress: number) => {
    return `${Math.round(progress * 100)}%`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <Animated.View 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.separator,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.searchBackground,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="arrow-left" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 16 }}>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold', 
              color: colors.text,
              textAlign: 'center'
            }}>
              {audioData.numero} - {audioData.titulo}
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: colors.textSecondary,
              marginTop: 2,
              textAlign: 'center'
            }}>
              {audioData.autor}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.searchBackground,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Feather name="heart" size={20} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: showPlayer ? 120 : 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ padding: 20 }}>
            {/* Card Principal do Áudio */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 24,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Animated.View 
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: isPlaying ? colors.primary : colors.searchBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ scale: heartbeatAnim }],
                    shadowColor: isPlaying ? colors.primary : colors.text,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isPlaying ? 0.3 : 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Feather 
                    name="music" 
                    size={48} 
                    color={isPlaying ? colors.background : colors.text} 
                  />
                </Animated.View>
              </View>

              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: colors.text,
                  textAlign: 'center',
                  marginBottom: 8,
                }}>
                  {audioData.titulo}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginBottom: 4,
                }}>
                  Hino {audioData.numero}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}>
                  {audioData.autor}
                </Text>
              </View>

              {/* Botão de Play Principal */}
              <TouchableOpacity
                onPress={handlePlayAudio}
                disabled={controlsDisabled}
                style={{
                  backgroundColor: controlsDisabled ? colors.separator : (isPlaying ? '#ff4757' : colors.primary),
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: controlsDisabled ? 0.6 : 1,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Feather 
                  name={isPlaying ? "pause" : "play"} 
                  size={24} 
                  color="#ffffff" 
                  style={{ marginRight: 12 }}
                />
                <Text style={{
                  color: "#ffffff",
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                  {controlsDisabled ? "Carregando..." : (isPlaying ? "Pausar" : "Reproduzir")}
                </Text>
              </TouchableOpacity>

              {/* Indicador de Progresso */}
              {isLoaded && !audioError && (
                <View style={{ marginTop: 20 }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      {formatDuration(position)}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      {formatDuration(duration)}
                    </Text>
                  </View>
                  <View style={{
                    height: 4,
                    backgroundColor: colors.separator,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <View style={{
                      height: '100%',
                      backgroundColor: colors.primary,
                      width: `${duration > 0 ? (position / duration) * 100 : 0}%`,
                      borderRadius: 2,
                    }} />
                  </View>
                </View>
              )}
            </View>

            {/* Botões de Ação */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={handleShare}
                disabled={isSharing}
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.separator,
                  opacity: isSharing ? 0.6 : 1,
                }}
              >
                <Feather 
                  name={isSharing ? "loader" : "share"} 
                  size={20} 
                  color={colors.text} 
                  style={{ marginRight: 8 }}
                />
                <Text style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  {isSharing ? "Compartilhando..." : "Compartilhar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={baixarAudio}
                disabled={isDownloading || !audioUrl || !!audioError}
                style={{
                  flex: 1,
                  backgroundColor: isDownloaded ? '#4CAF50' : colors.surface,
                  borderRadius: 12,
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: isDownloaded ? '#4CAF50' : colors.separator,
                  opacity: (isDownloading || !audioUrl || !!audioError) ? 0.6 : 1,
                }}
              >
                <Feather 
                  name={isDownloaded ? "check" : (isDownloading ? "loader" : "download")} 
                  size={20} 
                  color={isDownloaded ? "#ffffff" : colors.text} 
                  style={{ marginRight: 8 }}
                />
                <Text style={{
                  color: isDownloaded ? "#ffffff" : colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                  {isDownloaded ? "Baixado" : (isDownloading ? "Baixando..." : "Baixar")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progresso do Download */}
            {isDownloading && (
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: colors.primary,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Feather name="download" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 14, color: colors.text, fontWeight: '500' }}>
                    Baixando áudio...
                  </Text>
                </View>
                <View style={{
                  height: 4,
                  backgroundColor: colors.separator,
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <View style={{
                    height: '100%',
                    backgroundColor: colors.primary,
                    width: `${downloadProgress * 100}%`,
                    borderRadius: 2,
                  }} />
                </View>
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' }}>
                  {formatDownloadProgress(downloadProgress)}
                </Text>
              </View>
            )}

            {/* Informações do Áudio */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 16,
              }}>
                Informações do Áudio
              </Text>
              
              <View style={{ gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.searchBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="music" size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                      Formato
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      MP3 - Alta qualidade
                    </Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.searchBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="clock" size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                      Duração
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      {formatDuration(duration)}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.searchBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="download" size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                      Status do Download
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: isDownloaded ? '#4CAF50' : colors.textSecondary 
                    }}>
                      {isDownloaded ? 'Arquivo baixado' : 'Não baixado'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.searchBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="share" size={20} color={colors.text} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                      Compartilhamento
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                      Letra e áudio disponíveis
                    </Text>
                  </View>
                </View>

                {audioError && (
                  <View style={{
                    backgroundColor: '#ffebee',
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: '#f44336',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="alert-triangle" size={20} color="#f44336" style={{ marginRight: 12 }} />
                      <Text style={{ fontSize: 14, color: '#d32f2f', flex: 1 }}>
                        {audioError}
                      </Text>
                    </View>
                  </View>
                )}

                {downloadError && (
                  <View style={{
                    backgroundColor: '#ffebee',
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: '#f44336',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="alert-triangle" size={20} color="#f44336" style={{ marginRight: 12 }} />
                      <Text style={{ fontSize: 14, color: '#d32f2f', flex: 1 }}>
                        {downloadError}
                      </Text>
                    </View>
                  </View>
                )}

                {shareError && (
                  <View style={{
                    backgroundColor: '#ffebee',
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: '#f44336',
                  }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="alert-triangle" size={20} color="#f44336" style={{ marginRight: 12 }} />
                      <Text style={{ fontSize: 14, color: '#d32f2f', flex: 1 }}>
                        {shareError}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Áudios Relacionados */}
            <View style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
                marginBottom: 16,
              }}>
                Áudios Relacionados
              </Text>
              
              <View style={{ gap: 12 }}>
                <TouchableOpacity 
                  onPress={handlePrevious}
                  disabled={!previousAudio || loadingNavigation}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: colors.searchBackground,
                    borderRadius: 12,
                    opacity: (!previousAudio || loadingNavigation) ? 0.5 : 1,
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: previousAudio ? colors.primary : colors.separator,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="music" size={20} color={previousAudio ? colors.background : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      color: previousAudio ? colors.text : colors.textSecondary, 
                      fontWeight: '500' 
                    }}>
                      {previousAudio ? `Hino ${previousAudio.numero}` : 'Hino anterior'}
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: previousAudio ? colors.textSecondary : colors.textSecondary 
                    }}>
                      {previousAudio ? previousAudio.titulo : 'Não disponível'}
                    </Text>
                  </View>
                  <Feather 
                    name="chevron-right" 
                    size={20} 
                    color={previousAudio ? colors.textSecondary : colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleNext}
                  disabled={!nextAudio || loadingNavigation}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: colors.searchBackground,
                    borderRadius: 12,
                    opacity: (!nextAudio || loadingNavigation) ? 0.5 : 1,
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: nextAudio ? colors.primary : colors.separator,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                    <Feather name="music" size={20} color={nextAudio ? colors.background : colors.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      fontSize: 16, 
                      color: nextAudio ? colors.text : colors.textSecondary, 
                      fontWeight: '500' 
                    }}>
                      {nextAudio ? `Hino ${nextAudio.numero}` : 'Próximo hino'}
                    </Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: nextAudio ? colors.textSecondary : colors.textSecondary 
                    }}>
                      {nextAudio ? nextAudio.titulo : 'Não disponível'}
                    </Text>
                  </View>
                  <Feather 
                    name="chevron-right" 
                    size={20} 
                    color={nextAudio ? colors.textSecondary : colors.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Player na parte inferior */}
        {showPlayer && (
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.separator,
            paddingHorizontal: 20,
            paddingVertical: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={!previousAudio || loadingNavigation}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.searchBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: (!previousAudio || loadingNavigation) ? 0.5 : 1,
                }}
              >
                <Feather name="skip-back" size={20} color={colors.text} />
              </TouchableOpacity>
              
              <View style={{ flex: 1, marginHorizontal: 16 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  textAlign: 'center',
                }}>
                  {audioData.titulo}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  textAlign: 'center',
                }}>
                  Hino {audioData.numero}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={handleNext}
                disabled={!nextAudio || loadingNavigation}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.searchBackground,
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: (!nextAudio || loadingNavigation) ? 0.5 : 1,
                }}
              >
                <Feather name="skip-forward" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}