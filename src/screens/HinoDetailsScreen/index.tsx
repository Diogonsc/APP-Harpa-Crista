import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Vibration,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { HinoLocal, HinoCompleto, Verso } from '../../types/api';
import { ApiService } from '../../services/api';
import { Audio } from 'expo-av';
import { buildApiUrl, API_CONFIG, validateAudioUrl, testAudioUrl, logError } from '../../config/api';
import { getThemeClass } from '../../utils/colors';
import { StatusBar } from '../../components/StatusBar';
import { useSafeAudio } from '../../hooks/useSafeAudio';

// Criar FlatList animado para resolver o erro do VirtualizedList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ListItem>);

type HinoDetalheProps = {
  route: {
    params: {
      hino: HinoLocal;
    };
  };
  navigation: any;
};

// Interface para item da lista
interface ListItem {
  id: string;
  type: 'text' | 'verso' | 'coro';
  content: string;
  sequence?: number;
  index: number;
}

// Componente memoizado para linha de texto
const TextLine = React.memo(({ 
  item, 
  tamanhoFonte, 
  coresAtuais, 
  isDarkMode 
}: {
  item: ListItem;
  tamanhoFonte: number;
  coresAtuais: any;
  isDarkMode: boolean;
}) => {
  const isRefrao =
    item.content.trim().startsWith('Chuvas de graça') ||
    item.content.trim().startsWith('Sim, eu porfiarei') ||
    item.content.trim().startsWith('Bela, mui bela') ||
    item.content.trim().startsWith('Diz a Sagrada');

  return (
    <Text
      className={`mb-1.5 text-left ${getThemeClass(isDarkMode, 'text')}`}
      style={{
        fontSize: tamanhoFonte,
        fontStyle: isRefrao ? 'italic' : 'normal',
        fontWeight: isRefrao ? '600' : 'normal',
        lineHeight: tamanhoFonte * 1.6,
        color: coresAtuais.text,
      }}
    >
      {item.content}
    </Text>
  );
});

// Componente memoizado para verso
const VersoComponent = React.memo(({ 
  item, 
  tamanhoFonte, 
  coresAtuais, 
  isDarkMode 
}: {
  item: ListItem;
  tamanhoFonte: number;
  coresAtuais: any;
  isDarkMode: boolean;
}) => (
  <View className="flex-row items-start mb-2.5">
    <Text
      className="font-bold mr-1.5 min-w-7"
      style={{
        fontSize: tamanhoFonte - 2,
        lineHeight: tamanhoFonte * 1.6,
        color: coresAtuais.primary,
      }}
    >
      {item.sequence}.
    </Text>
    <Text
      className={`flex-1 ${getThemeClass(isDarkMode, 'text')}`}
      style={{
        fontSize: tamanhoFonte,
        lineHeight: tamanhoFonte * 1.6,
        color: coresAtuais.text,
      }}
    >
      {item.content}
    </Text>
  </View>
));

// Componente memoizado para coro
const CoroComponent = React.memo(({ 
  item, 
  tamanhoFonte, 
  coresAtuais, 
  isDarkMode 
}: {
  item: ListItem;
  tamanhoFonte: number;
  coresAtuais: any;
  isDarkMode: boolean;
}) => {
  // Verificar se está no modo leitura comparando as cores
  const isModoLeitura = coresAtuais.primary === '#e2b714' || coresAtuais.primary === '#8b4513';
  
  return (
    <View 
      className="mt-2 mb-3 pl-8 py-3 rounded-lg"
      style={{
        backgroundColor: isModoLeitura
          ? (isDarkMode ? 'rgba(226, 183, 20, 0.10)' : 'rgba(139, 69, 19, 0.08)')
          : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
        borderLeftWidth: 3,
        borderLeftColor: coresAtuais.primary,
      }}
    >
      <Text
        className="italic font-semibold"
        style={{
          fontSize: tamanhoFonte,
          lineHeight: tamanhoFonte * 1.6,
          color: coresAtuais.text,
        }}
      >
        {item.content}
      </Text>
    </View>
  );
});

export function HinoDetailsScreen({ route, navigation }: HinoDetalheProps) {
  const { isDarkMode, colors } = useTheme();
  const { verificarFavorito, verificarFavoritoSync, alternarFavorito } = useFavoritos();
  const { hino } = route.params;

  const [hinoCompleto, setHinoCompleto] = useState<HinoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritado, setFavoritado] = useState(false);
  const [tamanhoFonte, setTamanhoFonte] = useState(18);
  const [repetirCoro, setRepetirCoro] = useState(true);
  const [modoLeitura, setModoLeitura] = useState(false);
  const [modoLeituraAnim] = useState(new Animated.Value(0));

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

  // Cores específicas para modo leitura - adaptadas para dark e light
  const coresModoLeitura = isDarkMode ? {
    // Modo leitura para tema escuro
    background: '#1a1a1a',
    surface: '#2a2a2a',
    primary: '#e2b714', // Amarelo mostarda suave
    text: '#e8e8e8',
    textSecondary: '#b0b0b0',
    border: '#404040',
    separator: '#404040',
    icon: '#e2b714',
    searchBackground: '#2a2a2a',
  } : {
    // Modo leitura para tema claro
    background: '#f8f6f0',
    surface: '#ffffff',
    primary: '#8b4513',
    text: '#2c2c2c',
    textSecondary: '#5a5a5a',
    border: '#e8e4d8',
    separator: '#e8e4d8',
    icon: '#8b4513',
    searchBackground: '#f0ede6',
  };

  const coresAtuais = modoLeitura ? coresModoLeitura : {
    background: isDarkMode ? '#121212' : '#f5f5f5',
    surface: isDarkMode ? '#1e1e1e' : '#ffffff',
    primary: isDarkMode ? '#0A84FF' : '#007AFF',
    text: isDarkMode ? '#ffffff' : '#333333',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    border: isDarkMode ? '#2c2c2c' : '#e0e0e0',
    separator: isDarkMode ? '#2c2c2c' : '#e0e0e0',
    icon: isDarkMode ? '#b0b0b0' : '#666666',
    searchBackground: isDarkMode ? '#2c2c2c' : '#f8f8f8',
  };

  const [scrollY] = useState(new Animated.Value(0));
  const [progressoLeitura, setProgressoLeitura] = useState(0);
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false);
  const flatListRef = useRef<FlatList<ListItem>>(null);

  // Animações
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  const progressoAnimado = useRef(new Animated.Value(0)).current;
  const botaoTopoOpacity = useRef(new Animated.Value(0)).current;
  const botaoTopoScale = useRef(new Animated.Value(0.8)).current;

  // Animações do botão flutuante
  const floatingButtonScale = useRef(new Animated.Value(1)).current;
  const floatingButtonOpacity = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Pulso do botão play
  useEffect(() => {
    if (isPlaying) {
      if (!pulseLoopRef.current) {
        pulseLoopRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
          ])
        );
        pulseLoopRef.current.start();
      }
    } else {
      pulseLoopRef.current?.stop();
      pulseLoopRef.current = null;
      pulseAnim.setValue(1);
    }
    return () => {
      pulseLoopRef.current?.stop();
      pulseLoopRef.current = null;
      pulseAnim.setValue(1);
    };
  }, [isPlaying, pulseAnim]);

  // Animação do modo leitura
  useEffect(() => {
    Animated.timing(modoLeituraAnim, {
      toValue: modoLeitura ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [modoLeitura, modoLeituraAnim]);

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

  // Carregar áudio quando a URL estiver disponível
  const carregarAudioHino = useCallback(async () => {
    try {
      setAudioError(null);
      
      let urlParaTestar = null;
      
      // Primeiro, verificar se o hinoCompleto já tem audioUrl
      if (hinoCompleto?.audioUrl && validarAudioUrl(hinoCompleto.audioUrl)) {
        urlParaTestar = corrigirAudioUrl(hinoCompleto.audioUrl);
      } else {
        // Se não tem no hinoCompleto, buscar via API
        const hinoCompletoAPI = await ApiService.getHinoPorNumero(hino.numero);
        if (hinoCompletoAPI?.audioUrl && validarAudioUrl(hinoCompletoAPI.audioUrl)) {
          urlParaTestar = corrigirAudioUrl(hinoCompletoAPI.audioUrl);
        }
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
      logError('Carregar Áudio', error, { hinoNumero: hino.numero });
      setAudioError('Erro ao verificar disponibilidade do áudio. Tente novamente mais tarde.');
    }
  }, [hinoCompleto, hino.numero, validarAudioUrl, testarAudioUrl, corrigirAudioUrl]);

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

  useEffect(() => {
    if (hinoCompleto) {
      carregarAudioHino();
    }
  }, [hinoCompleto, carregarAudioHino]);

  // Função para reproduzir/pausar áudio
  const reproduzirAudio = useCallback(async () => {
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

      // Animação de "tap" no botão
      Animated.sequence([
        Animated.timing(floatingButtonScale, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(floatingButtonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    } catch (err) {
      logError('Controlar Áudio', err, { audioUrl, isPlaying });
      Alert.alert('Erro', `Erro ao controlar o áudio: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    }
  }, [audioUrl, sound, isLoaded, isPlaying, duration, position, audioError]);

  useEffect(() => {
    carregarHinoDetalhe();
    verificarFavoritoLocal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hino.numero]);

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

  // Progresso de leitura e botão topo
  useEffect(() => {
    Animated.timing(progressoAnimado, {
      toValue: progressoLeitura,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progressoLeitura, progressoAnimado]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(botaoTopoOpacity, {
        toValue: mostrarBotaoTopo ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(botaoTopoScale, {
        toValue: mostrarBotaoTopo ? 1 : 0.8,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [mostrarBotaoTopo, botaoTopoOpacity, botaoTopoScale]);

  const carregarHinoDetalhe = async () => {
    try {
      setLoading(true);
      const hinoCompletoSrv = await ApiService.getHinoPorNumero(hino.numero);
      
      if (hinoCompletoSrv) {
        // Buscar os dados completos do hino (letra, versos, etc.)
        const response = await fetch(`https://api-harpa-crista-uzgo.vercel.app/api/hinos/${hino.numero}`);
        const data = await response.json();
        
        if (data && data.number) {
          let coro = '';
          if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
            const coroVerso = data.verses.find((verso: any) => verso.chorus === true);
            if (coroVerso) coro = coroVerso.lyrics;
          }

          let letraCompleta = '';
          if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
            data.verses.forEach((verso: any, index: number) => {
              if (verso.lyrics) {
                if (!verso.chorus) letraCompleta += `${verso.sequence}. `;
                letraCompleta += verso.lyrics;
                if (index < data.verses.length - 1) letraCompleta += '\n\n';
              }
            });
          }

          const hinoCompleto: HinoCompleto = {
            numero: data.number,
            titulo: data.title,
            autor: data.author,
            letra: letraCompleta,
            verses: data.verses,
            coro,
            audioUrl: data.audioUrl,
          };

          setHinoCompleto(hinoCompleto);
        } else {
          Alert.alert('Erro', 'Formato de resposta inválido da API');
        }
      } else {
        Alert.alert('Erro', 'Hino não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar hino:', error);
      Alert.alert('Erro', 'Não foi possível carregar o hino');
    } finally {
      setLoading(false);
    }
  };

  const verificarFavoritoLocal = async () => {
    try {
      const isFavorito = verificarFavoritoSync(hino.numero);
      setFavoritado(isFavorito);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const alternarFavoritoLocal = async () => {
    try {
      Vibration.vibrate(50);
      const itemFavorito = {
        numero: hino.numero,
        titulo: hino.titulo,
        autor: hino.autor,
      };
      await alternarFavorito(itemFavorito);
      const novoStatus = verificarFavoritoSync(hino.numero);
      setFavoritado(novoStatus);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível alterar o favorito');
    }
  };

  const aumentarFonte = () => {
    Vibration.vibrate(30);
    const tamanhos = [16, 18, 20, 22, 24];
    const indexAtual = tamanhos.indexOf(tamanhoFonte);
    const proximoIndex = Math.min(indexAtual + 1, tamanhos.length - 1);
    setTamanhoFonte(tamanhos[proximoIndex]);
  };

  const diminuirFonte = () => {
    Vibration.vibrate(30);
    const tamanhos = [16, 18, 20, 22, 24];
    const indexAtual = tamanhos.indexOf(tamanhoFonte);
    const proximoIndex = Math.max(indexAtual - 1, 0);
    setTamanhoFonte(tamanhos[proximoIndex]);
  };

  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progresso = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    setProgressoLeitura(Math.max(0, Math.min(1, progresso)));
    setMostrarBotaoTopo(contentOffset.y > 200);
  }, []);

  const voltarAoTopo = () => {
    Vibration.vibrate(30);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Memoização do conteúdo formatado para FlatList
  const listaItens = useMemo(() => {
    const itens: ListItem[] = [];
    
    if (!hinoCompleto?.verses) {
      // Renderizar letra simples
      const linhas = hinoCompleto?.letra?.split('\n') || [];
      linhas.forEach((linha, index) => {
        itens.push({
          id: `text-${index}`,
          type: 'text',
          content: linha,
          index,
        });
      });
      return itens;
    }

    const versos = hinoCompleto.verses;
    const coro = hinoCompleto.coro;
    const versosNormais = versos && Array.isArray(versos) ? versos.filter((verso) => !verso.chorus) : [];

    if (!coro || !repetirCoro) {
      // Renderizar letra simples
      const linhas = hinoCompleto?.letra?.split('\n') || [];
      linhas.forEach((linha, index) => {
        itens.push({
          id: `text-${index}`,
          type: 'text',
          content: linha,
          index,
        });
      });
      return itens;
    }

    if (versosNormais && versosNormais.length > 0) {
      versosNormais.forEach((verso, index) => {
        itens.push({
          id: `verso-${index}`,
          type: 'verso',
          content: verso.lyrics,
          sequence: verso.sequence,
          index,
        });

        if (index < versosNormais.length - 1) {
          itens.push({
            id: `coro-${index}`,
            type: 'coro',
            content: coro,
            index,
          });
        }
      });
    }

    return itens;
  }, [hinoCompleto, repetirCoro]);

  // Renderizador de item para FlatList
  const renderItem = useCallback(({ item, index }: { item: ListItem; index: number }) => {
    switch (item.type) {
      case 'text':
        return (
          <TextLine
            item={item}
            tamanhoFonte={tamanhoFonte}
            coresAtuais={coresAtuais}
            isDarkMode={isDarkMode}
          />
        );
      case 'verso':
        return (
          <VersoComponent
            item={item}
            tamanhoFonte={tamanhoFonte}
            coresAtuais={coresAtuais}
            isDarkMode={isDarkMode}
          />
        );
      case 'coro':
        return (
          <CoroComponent
            item={item}
            tamanhoFonte={tamanhoFonte}
            coresAtuais={coresAtuais}
            isDarkMode={isDarkMode}
          />
        );
      default:
        return null;
    }
  }, [tamanhoFonte, coresAtuais, isDarkMode]);

  const keyExtractor = useCallback((item: ListItem, index: number) => item.id, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando hino...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const controlsDisabled = !isLoaded || !!audioError;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar />

      {/* Header Animado */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
            opacity: headerOpacity,
            transform: [{ translateY: headerTranslateY }],
          }
        ]}
      >
        <TouchableOpacity
          className={`w-10 h-10 rounded-full justify-center items-center ${getThemeClass(isDarkMode, 'searchBackground')}`}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>

        <View className="flex-1 mx-3 items-center pt-1">
          <Text className={`text-base font-bold text-center ${getThemeClass(isDarkMode, 'text')}`}>
            {hino.numero} - {hino.titulo}
          </Text>
          {hinoCompleto?.autor && (
            <Text className={`text-xs text-center mt-0.5 ${getThemeClass(isDarkMode, 'textSecondary')}`}>
              {hinoCompleto.autor}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className={`w-10 h-10 rounded-full justify-center items-center ${getThemeClass(isDarkMode, 'searchBackground')}`}
          onPress={alternarFavoritoLocal}
          activeOpacity={0.7}
        >
          <Feather name="heart" size={20} color={favoritado ? '#ff6b6b' : colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* Indicador de Progresso */}
      <View className={`h-0.5 ${getThemeClass(isDarkMode, 'surface')}`}>
        <Animated.View
          className={`h-full rounded ${getThemeClass(isDarkMode, 'primary')}`}
          style={{
            width: progressoAnimado.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>

      {/* Indicador do Modo Leitura */}
      {modoLeitura && (
        <Animated.View
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{
            backgroundColor: coresAtuais.primary,
            opacity: modoLeituraAnim,
          }}
        />
      )}

      {/* Conteúdo Principal com FlatList */}
      <AnimatedFlatList
        ref={flatListRef}
        data={listaItens}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 200 }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true, listener: handleScroll })}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: tamanhoFonte * 1.6 + 6, // altura aproximada do item
          offset: (tamanhoFonte * 1.6 + 6) * index,
          index,
        })}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Feather name="file-text" size={48} color={coresAtuais.textSecondary} />
            <Text className={`text-base text-center italic mt-3 ${getThemeClass(isDarkMode, 'textSecondary')}`}>
              Letra não disponível
            </Text>
          </View>
        }
      />

      {/* Botão Voltar ao Topo */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 120,
          right: 20,
          zIndex: 1000,
          opacity: botaoTopoOpacity,
          transform: [{ scale: botaoTopoScale }],
        }}
      >
        <TouchableOpacity
          className={`w-12 h-12 rounded-full justify-center items-center ${getThemeClass(isDarkMode, 'primary')} shadow-lg`}
          onPress={voltarAoTopo}
          activeOpacity={0.8}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Feather name="arrow-up" size={20} color={coresAtuais.background} />
        </TouchableOpacity>
      </Animated.View>

      {/* Botão de Play Flutuante – desabilitado quando não carregado */}
      {audioUrl && !audioError && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            zIndex: 1000,
            opacity: floatingButtonOpacity,
            transform: [{ scale: Animated.multiply(floatingButtonScale, pulseAnim) }],
          }}
        >
          <TouchableOpacity
            className={`w-12 h-12 rounded-full justify-center items-center border-2 ${getThemeClass(isDarkMode, 'surface')} shadow-lg`}
            onPress={reproduzirAudio}
            activeOpacity={0.8}
            disabled={controlsDisabled}
            style={{
              backgroundColor: isPlaying ? coresAtuais.primary : coresAtuais.surface,
              borderColor: coresAtuais.primary,
              opacity: controlsDisabled ? 0.6 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={isPlaying ? coresAtuais.background : coresAtuais.primary}
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Aviso de áudio não disponível */}
      {audioError && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20,
            zIndex: 1000,
            opacity: floatingButtonOpacity,
          }}
        >
          <TouchableOpacity
            className={`px-4 py-3 rounded-xl justify-center items-center border ${getThemeClass(isDarkMode, 'surface')} shadow-lg`}
            onPress={() => Alert.alert(
              'Áudio não disponível', 
              audioError,
              [
                { text: 'OK', style: 'default' },
                { 
                  text: 'Tentar novamente', 
                  onPress: () => {
                    setAudioError(null);
                    carregarAudioHino();
                  }
                }
              ]
            )}
            activeOpacity={0.8}
            style={{
              backgroundColor: coresAtuais.surface,
              borderColor: '#ff6b6b',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 4,
              maxWidth: 200,
            }}
          >
            <View className="flex-row items-center">
              <Feather
                name="volume-x"
                size={18}
                color="#ff6b6b"
              />
              <Text 
                className="ml-2 text-xs font-medium"
                style={{ color: '#ff6b6b' }}
                numberOfLines={2}
              >
                Áudio indisponível
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Footer */}
      <View 
        className={`px-4 py-4 border-t border-opacity-10 absolute bottom-0 left-0 right-0 ${getThemeClass(isDarkMode, 'surface')}`}
        style={{
          borderTopColor: coresAtuais.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
          zIndex: 999,
        }}
      >
        <View className="flex-row justify-around gap-3">
          <TouchableOpacity
            className={`flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 ${getThemeClass(isDarkMode, 'searchBackground')} shadow-sm`}
            onPress={diminuirFonte}
            activeOpacity={0.7}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Feather name="minus" size={18} color={coresAtuais.text} />
            <Text className={`ml-1.5 text-sm font-semibold ${getThemeClass(isDarkMode, 'text')}`}>
              A-
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 ${getThemeClass(isDarkMode, 'searchBackground')} shadow-sm`}
            onPress={aumentarFonte}
            activeOpacity={0.7}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Feather name="plus" size={18} color={coresAtuais.text} />
            <Text className={`ml-1.5 text-sm font-semibold ${getThemeClass(isDarkMode, 'text')}`}>
              A+
            </Text>
          </TouchableOpacity>

          {hinoCompleto?.coro && (
            <TouchableOpacity
              className={`flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 shadow-sm`}
              onPress={() => {
                Vibration.vibrate(30);
                setRepetirCoro(!repetirCoro);
              }}
              activeOpacity={0.7}
              style={{
                backgroundColor: repetirCoro ? coresAtuais.primary : coresAtuais.searchBackground,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Feather name="repeat" size={18} color={repetirCoro ? coresAtuais.background : coresAtuais.text} />
              <Text
                className={`ml-1.5 text-sm font-semibold`}
                style={{ color: repetirCoro ? coresAtuais.background : coresAtuais.text }}
              >
                Coro
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={`flex-row items-center justify-center py-3 px-4 rounded-xl flex-1 shadow-sm`}
            onPress={() => {
              Vibration.vibrate(30);
              setModoLeitura(!modoLeitura);
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: modoLeitura ? coresAtuais.primary : coresAtuais.searchBackground,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Feather name={modoLeitura ? "eye-off" : "eye"} size={18} color={modoLeitura ? coresAtuais.background : coresAtuais.text} />
            <Text
              className={`ml-1.5 text-sm font-semibold`}
              style={{ color: modoLeitura ? coresAtuais.background : coresAtuais.text }}
            >
              {modoLeitura ? 'Normal' : 'Leitura'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default HinoDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
