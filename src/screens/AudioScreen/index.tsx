import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  StyleSheet,
  TextInput
} from "react-native";
import { getThemeClass } from "../../utils/colors";
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from "../../components/SearchBar";
import { HymnItem } from "../../components/HymnItem";
import { Feather } from '@expo/vector-icons';
import { useTheme } from "../../contexts/ThemeContext";
import { useFavoritos } from "../../contexts/FavoritosContext";
import { ApiService } from "../../services/api";
import { Audio, AudiosPaginados, HinoLocal } from "../../types/api";
import { StatusBar } from "../../components/StatusBar";

type AudioScreenProps = {
  navigation: any;
};

export function AudioScreen({ navigation }: AudioScreenProps) {
  const { isDarkMode, colors } = useTheme();
  const { favoritos, alternarFavorito, verificarFavoritoSync } = useFavoritos();
  
  const [audios, setAudios] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);
  const [totalAudios, setTotalAudios] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  useEffect(() => {
    carregarAudios();
  }, []);

  const carregarAudios = useCallback(async (pagina: number = 1, resetar: boolean = true) => {
    try {
      if (resetar) {
        setLoading(true);
        setPaginaAtual(1);
        setTemMaisPaginas(true);
      } else {
        setCarregandoMais(true);
      }

      const response: AudiosPaginados = await ApiService.getAudios(pagina, 20);
      
      if (resetar) {
        setAudios(response.audios);
        setTotalAudios(response.paginacao.total);
        setTotalPaginas(response.paginacao.totalPaginas);
        setTemMaisPaginas(pagina < response.paginacao.totalPaginas);
      } else {
        setAudios(prev => [...prev, ...response.audios]);
        setTemMaisPaginas(pagina < response.paginacao.totalPaginas);
      }
    } catch (error) {
      console.error('Erro ao carregar áudios:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os áudios. Tente novamente.');
      }
    } finally {
      setLoading(false);
      setCarregandoMais(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarAudios(1, true);
    setRefreshing(false);
  }, [carregarAudios]);

  const buscarAudioAleatorio = useCallback(async () => {
    try {
      setSearching(true);
      setPaginaAtual(1); // Resetar paginação
      const audioAleatorio = await ApiService.getAudioAleatorio();
      
      if (audioAleatorio) {
        setAudios([audioAleatorio]);
        setTemMaisPaginas(false);
        setTotalAudios(1);
        setTotalPaginas(1);
        setSearchText('🎲 Áudio Aleatório');
      } else {
        Alert.alert('Erro', 'Não foi possível buscar um áudio aleatório');
      }
    } catch (error) {
      console.error('Erro ao buscar áudio aleatório:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível buscar um áudio aleatório. Tente novamente.');
      }
    } finally {
      setSearching(false);
    }
  }, []);

  const buscarAudios = useCallback(async () => {
    if (!searchText.trim()) {
      // Resetar para a lista completa
      setPaginaAtual(1);
      await carregarAudios(1, true);
      return;
    }

    try {
      setSearching(true);
      setPaginaAtual(1); // Resetar paginação para nova busca

      // Verificar se é uma busca por número
      const numeroHino = parseInt(searchText.trim());
      if (!isNaN(numeroHino) && numeroHino > 0 && numeroHino <= 640) {
        // Busca por número específico
        const audioEncontrado = await ApiService.getAudioPorHino(numeroHino);
        
        if (audioEncontrado) {
          setAudios([audioEncontrado]);
          setTemMaisPaginas(false);
          setTotalAudios(1);
          setTotalPaginas(1);
        } else {
          setAudios([]);
          setTemMaisPaginas(false);
          setTotalAudios(0);
          setTotalPaginas(0);
          Alert.alert('Áudio não encontrado', `O áudio do hino número ${numeroHino} não foi encontrado.`);
        }
      } else if (!isNaN(numeroHino) && numeroHino > 640) {
        Alert.alert('Número inválido', 'O número máximo de hinos é 640.');
        setAudios([]);
        setTemMaisPaginas(false);
        setTotalAudios(0);
        setTotalPaginas(0);
      } else if (!isNaN(numeroHino) && numeroHino <= 0) {
        Alert.alert('Número inválido', 'Digite um número válido de hino (1-640).');
        setAudios([]);
        setTemMaisPaginas(false);
        setTotalAudios(0);
        setTotalPaginas(0);
      } else {
        // Busca por texto
        const response: AudiosPaginados = await ApiService.buscarAudiosPorTexto(searchText, 1, 20);
        
        setAudios(response.audios);
        setTemMaisPaginas(response.paginacao.pagina < response.paginacao.totalPaginas);
        setTotalAudios(response.paginacao.total);
        setTotalPaginas(response.paginacao.totalPaginas);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível realizar a busca. Tente novamente.');
      }
    } finally {
      setSearching(false);
    }
  }, [searchText, carregarAudios]);

  const carregarMaisAudios = useCallback(async () => {
    if (carregandoMais || !temMaisPaginas) {
      return;
    }

    const proximaPagina = paginaAtual + 1;
    
    try {
      setCarregandoMais(true);
      
      if (searchText.trim()) {
        // Se há uma busca ativa, carregar mais resultados da busca
        const response: AudiosPaginados = await ApiService.buscarAudiosPorTexto(searchText, proximaPagina, 20);
        setAudios(prev => [...prev, ...response.audios]);
        setTemMaisPaginas(proximaPagina < response.paginacao.totalPaginas);
      } else {
        // Carregar mais áudios da lista completa
        const response: AudiosPaginados = await ApiService.getAudios(proximaPagina, 20);
        setAudios(prev => [...prev, ...response.audios]);
        setTemMaisPaginas(proximaPagina < response.paginacao.totalPaginas);
      }
      
      setPaginaAtual(proximaPagina);
    } catch (error) {
      console.error('Erro ao carregar mais áudios:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar mais áudios. Tente novamente.');
      }
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoMais, temMaisPaginas, searchText, paginaAtual]);

  const alternarFavoritoLocal = useCallback(async (audio: Audio) => {
    try {
      const itemFavorito = {
        numero: audio.numero,
        titulo: audio.titulo,
        autor: audio.autor
      };
      
      await alternarFavorito(itemFavorito);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível alterar o favorito');
    }
  }, [alternarFavorito]);

  const reproduzirAudio = useCallback(async (audio: Audio) => {
    try {
      // Navegar para a tela de detalhes do áudio
      navigation.navigate('AudioDetalhe', { audio });
    } catch (error) {
      console.error('Erro ao navegar para detalhes do áudio:', error);
      Alert.alert('Erro', 'Não foi possível abrir os detalhes do áudio. Tente novamente.');
    }
  }, [navigation]);

  const navegarParaDetalhes = useCallback((audio: Audio) => {
    console.log('Tentando navegar para AudioDetalhe com:', audio);
    // Como estamos dentro do AudioStack, vamos tentar navegar usando o nome da rota pai
    navigation.navigate('Audio', { screen: 'AudioDetalhe', params: { audio } });
  }, [navigation]);

  const renderAudioItem = useCallback(({ item }: { item: Audio }) => {
    const isFavorito = verificarFavoritoSync(item.numero);
    const hasAudio = item.audioUrl && item.audioUrl.trim() !== '';
    
    console.log('Renderizando item de áudio:', item.numero, item.titulo);
    
    return (
      <HymnItem
        title={item.titulo}
        number={item.numero}
        isFavorite={isFavorito}
        onPress={() => {
          console.log('Clicou no item:', item.numero);
          navegarParaDetalhes(item);
        }}
        onFavoritePress={() => alternarFavoritoLocal(item)}
        showPlayButton={true}
        onPlayPress={() => reproduzirAudio(item)}
      />
    );
  }, [favoritos, colors, navigation, reproduzirAudio, alternarFavoritoLocal, navegarParaDetalhes]);

  const renderFooter = useCallback(() => {
    console.log(`renderFooter - Carregando: ${carregandoMais}, Tem mais: ${temMaisPaginas}, Áudios: ${audios.length}`);
    
    if (!carregandoMais && !temMaisPaginas) return null;
    
    if (!temMaisPaginas && audios.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Todos os áudios foram carregados
          </Text>
        </View>
      );
    }
    
    if (carregandoMais) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando mais áudios...
          </Text>
        </View>
      );
    }
    
    return null;
  }, [carregandoMais, temMaisPaginas, audios.length, colors]);

  const renderEmptyState = useCallback(() => {
    if (searching || loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Feather name="music" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {searchText.trim() 
            ? 'Nenhum áudio encontrado para sua busca' 
            : 'Nenhum áudio disponível'
          }
        </Text>
      </View>
    );
  }, [searching, loading, searchText, colors]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando áudios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Áudios</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={buscarAudioAleatorio}>
            <Feather name="shuffle" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setSearchText('');
            setPaginaAtual(1);
            setTemMaisPaginas(true);
            carregarAudios(1, true);
          }}>
            <Feather name={searchText.trim() ? "x" : "search"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.searchBackground, borderWidth: 1, borderColor: colors.border }]}>
          <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar áudios ou digite um número"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={buscarAudios}
            returnKeyType="search"
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={buscarAudios}
            activeOpacity={0.7}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>
          {searchText.trim() 
            ? `Resultados da Busca (${audios.length} de ${totalAudios})` 
            : `Todos os Áudios: ${totalAudios}`
          }
        </Text>
        {searching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Buscando...</Text>
          </View>
        ) : (
          <FlatList
            data={audios}
            renderItem={renderAudioItem}
            keyExtractor={(item, index) => `${item.numero}-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
            onEndReached={() => {
              console.log('onEndReached chamado');
              carregarMaisAudios();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={20}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 15,
  },
  separator: {
    height: 1,
    marginVertical: 8,
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
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
});