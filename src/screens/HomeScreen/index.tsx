import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../contexts/ThemeContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { ApiService } from '../../services/api';
import { SyncService } from '../../services/syncService';
import { HinoLocal, Estatisticas, Audio, HinosPaginados } from '../../types/api';
import HinoItem from '../../components/HinoItem';
import { StatusBar } from '../../components/StatusBar';
import { SyncStatus } from '../../components/SyncStatus';
import { InitialSyncModal } from '../../components/InitialSyncModal';
import { LocalStorageService } from '../../services/localStorageService';

type InicioProps = {
  navigation: any;
};

const InicioScreen = ({ navigation }: InicioProps) => {
  const { isDarkMode, colors } = useTheme();
  const { favoritos, alternarFavorito, verificarFavoritoSync } = useFavoritos();
  
  const [hinos, setHinos] = useState<HinoLocal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [temMaisPaginas, setTemMaisPaginas] = useState(true);
  const [totalHinos, setTotalHinos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(false);

  useEffect(() => {
    inicializarApp();
  }, []);

  const inicializarApp = useCallback(async () => {
    try {
      setLoading(true);
      
      // Verificar se há dados locais
      const stats = await LocalStorageService.getCacheStats();
      const hinosCompletos = await LocalStorageService.loadHinosCompletos();
      
      if (stats.totalHinos === 0 || hinosCompletos.length === 0) {
        console.log('Nenhum dado local encontrado, iniciando sincronização em segundo plano...');
        
        // Carregar hinos e estatísticas primeiro
        await Promise.all([
          carregarHinos(),
          carregarEstatisticas()
        ]);
        
        // Iniciar sincronização em segundo plano
        SyncService.syncIfNeeded().then((syncResult) => {
          if (syncResult.success) {
            console.log(`Sincronização em segundo plano concluída com ${syncResult.totalHinos} hinos`);
            // Recarregar hinos após sincronização
            carregarHinos();
          } else {
            console.log('Sincronização em segundo plano falhou');
          }
        }).catch((error) => {
          console.error('Erro na sincronização em segundo plano:', error);
        });
        
      } else {
        console.log(`Dados locais encontrados: ${stats.totalHinos} hinos básicos, ${hinosCompletos.length} hinos completos`);
        
        // Verificar se precisa sincronizar em segundo plano
        SyncService.syncIfNeeded().then((syncResult) => {
          if (syncResult.success) {
            console.log(`Sincronização em segundo plano concluída com ${syncResult.totalHinos} hinos`);
          } else {
            console.log('Sincronização em segundo plano não necessária');
          }
        }).catch((error) => {
          console.error('Erro na sincronização em segundo plano:', error);
        });
      }
      
      // Carregar hinos e estatísticas
      await Promise.all([
        carregarHinos(),
        carregarEstatisticas()
      ]);
    } catch (error) {
      console.error('Erro durante inicialização:', error);
      // Continuar mesmo com erro, tentando carregar dados locais
      await carregarHinos();
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarHinos = useCallback(async (pagina: number = 1, resetar: boolean = true) => {
    try {
      if (resetar) {
        setLoading(true);
        setPaginaAtual(1);
        setTemMaisPaginas(true);
      } else {
        setCarregandoMais(true);
      }

      const response: HinosPaginados = await ApiService.getHinos(pagina, 20);
      
      if (resetar) {
        setHinos(response.hinos);
        setTotalHinos(response.paginacao.total);
        setTotalPaginas(response.paginacao.totalPaginas);
        setTemMaisPaginas(pagina < response.paginacao.totalPaginas);
      } else {
        setHinos(prev => [...prev, ...response.hinos]);
        setTemMaisPaginas(pagina < response.paginacao.totalPaginas);
      }
    } catch (error) {
      console.error('Erro ao carregar hinos:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar os hinos. Tente novamente.');
      }
    } finally {
      if (resetar) {
        setLoading(false);
      }
      setCarregandoMais(false);
    }
  }, []);

  const carregarEstatisticas = useCallback(async () => {
    try {
      const stats = await ApiService.getEstatisticas();
      setEstatisticas(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      carregarHinos(1, true),
      carregarEstatisticas()
    ]);
    setRefreshing(false);
  }, [carregarHinos, carregarEstatisticas]);



  // Função removida - sincronização agora acontece em segundo plano

  const buscarHinoAleatorio = useCallback(async () => {
    try {
      setSearching(true);
      setPaginaAtual(1); // Resetar paginação
      const hinoAleatorio = await ApiService.getHinoAleatorio();
      
      if (hinoAleatorio) {
        setHinos([hinoAleatorio]);
        setTemMaisPaginas(false);
        setTotalHinos(1);
        setTotalPaginas(1);
        setSearchText('🎲 Hino Aleatório');
      } else {
        Alert.alert('Erro', 'Não foi possível buscar um hino aleatório');
      }
    } catch (error) {
      console.error('Erro ao buscar hino aleatório:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível buscar um hino aleatório. Tente novamente.');
      }
    } finally {
      setSearching(false);
    }
  }, []);

  const buscarHinos = useCallback(async () => {
    if (!searchText.trim()) {
      // Resetar para a lista completa
      setPaginaAtual(1);
      await carregarHinos(1, true);
      return;
    }

    try {
      setSearching(true);
      setPaginaAtual(1); // Resetar paginação para nova busca

      // Verificar se é uma busca por número
      const numeroHino = parseInt(searchText.trim());
      if (!isNaN(numeroHino) && numeroHino > 0 && numeroHino <= 640) {
        // Busca por número específico
        const hinoEncontrado = await ApiService.getHinoPorNumero(numeroHino);
        
        if (hinoEncontrado) {
          setHinos([hinoEncontrado]);
          setTemMaisPaginas(false);
          setTotalHinos(1);
          setTotalPaginas(1);
        } else {
          setHinos([]);
          setTemMaisPaginas(false);
          setTotalHinos(0);
          setTotalPaginas(0);
          Alert.alert('Hino não encontrado', `O hino número ${numeroHino} não foi encontrado.`);
        }
      } else if (!isNaN(numeroHino) && numeroHino > 640) {
        Alert.alert('Número inválido', 'O número máximo de hinos é 640.');
        setHinos([]);
        setTemMaisPaginas(false);
        setTotalHinos(0);
        setTotalPaginas(0);
      } else if (!isNaN(numeroHino) && numeroHino <= 0) {
        Alert.alert('Número inválido', 'Digite um número válido de hino (1-640).');
        setHinos([]);
        setTemMaisPaginas(false);
        setTotalHinos(0);
        setTotalPaginas(0);
      } else {
        // Busca por texto
        const response: HinosPaginados = await ApiService.buscarHinosPorTexto(searchText, 1, 20);
        
        setHinos(response.hinos);
        setTemMaisPaginas(response.paginacao.pagina < response.paginacao.totalPaginas);
        setTotalHinos(response.paginacao.total);
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
  }, [searchText, carregarHinos]);

  const carregarMaisHinos = useCallback(async () => {
    if (carregandoMais || !temMaisPaginas) {
      return;
    }

    const proximaPagina = paginaAtual + 1;
    
    try {
      setCarregandoMais(true);
      
      if (searchText.trim()) {
        // Se há uma busca ativa, carregar mais resultados da busca
        const response: HinosPaginados = await ApiService.buscarHinosPorTexto(searchText, proximaPagina, 20);
        setHinos(prev => [...prev, ...response.hinos]);
        setTemMaisPaginas(proximaPagina < response.paginacao.totalPaginas);
      } else {
        // Carregar mais hinos da lista completa
        await carregarHinos(proximaPagina, false);
      }
      
      setPaginaAtual(proximaPagina);
    } catch (error) {
      console.error('Erro ao carregar mais hinos:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível carregar mais hinos. Tente novamente.');
      }
    } finally {
      setCarregandoMais(false);
    }
  }, [carregandoMais, temMaisPaginas, searchText, paginaAtual, carregarHinos]);

  const alternarFavoritoLocal = useCallback(async (hino: HinoLocal) => {
    try {
      const itemFavorito = {
        numero: hino.numero,
        titulo: hino.titulo,
        autor: hino.autor
      };
      
      await alternarFavorito(itemFavorito);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível alterar o favorito');
    }
  }, [alternarFavorito]);

  const reproduzirAudio = useCallback(async (hino: HinoLocal) => {
    try {
      // Buscar o áudio do hino
      const audio = await ApiService.getAudioPorHino(hino.numero);
      
      if (audio && audio.audioUrl) {
        // Navegar para a tela de detalhes do áudio
        navigation.navigate('Audio', { screen: 'AudioDetalhe', params: { audio } });
      } else {
        Alert.alert('Áudio não disponível', 'Este hino não possui áudio disponível.');
      }
    } catch (error) {
      console.error('Erro ao buscar áudio:', error);
      
      // Verificar se é um erro de rede ou timeout
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.'
        );
      } else {
        Alert.alert('Erro', 'Não foi possível buscar o áudio. Tente novamente.');
      }
    }
  }, [navigation]);

  const renderEstatisticas = useCallback(() => {
    if (!estatisticas || !mostrarEstatisticas) return null;

    return (
      <View style={[styles.estatisticasContainer, { backgroundColor: colors.surface }]}>
        <View style={styles.estatisticasHeader}>
          <Text style={[styles.estatisticasTitle, { color: colors.text }]}>Estatísticas</Text>
          <TouchableOpacity onPress={() => setMostrarEstatisticas(false)}>
            <Feather name="x" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.estatisticasGrid}>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaValor, { color: colors.primary }]}>{estatisticas.totalHinos}</Text>
            <Text style={[styles.estatisticaLabel, { color: colors.textSecondary }]}>Total de Hinos</Text>
          </View>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaValor, { color: colors.primary }]}>{estatisticas.hinosComAudio}</Text>
            <Text style={[styles.estatisticaLabel, { color: colors.textSecondary }]}>Com Áudio</Text>
          </View>
          <View style={styles.estatisticaItem}>
            <Text style={[styles.estatisticaValor, { color: colors.primary }]}>{estatisticas.porcentagemComAudio}%</Text>
            <Text style={[styles.estatisticaLabel, { color: colors.textSecondary }]}>Cobertura</Text>
          </View>
        </View>
      </View>
    );
  }, [estatisticas, mostrarEstatisticas, colors]);

  const renderHinoItem = useCallback(({ item }: { item: HinoLocal }) => {
    const isFavorito = verificarFavoritoSync(item.numero);
    const hasAudio = item.audioUrl && item.audioUrl.trim() !== '';
    
    return (
      <HinoItem
        item={item}
        isFavorito={isFavorito}
        onPress={(hino) => navigation.navigate('HinoDetalhe', { hino })}
        onFavoritePress={alternarFavoritoLocal}
        onPlayPress={reproduzirAudio}
        hasAudio={!!hasAudio}
        colors={colors}
      />
    );
  }, [favoritos, colors, navigation, reproduzirAudio, alternarFavoritoLocal]);

  const renderFooter = useCallback(() => {
    if (!carregandoMais && !temMaisPaginas) return null;
    
    if (!temMaisPaginas && hinos.length > 0) {
      return (
        <View style={styles.loadingFooter}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Todos os hinos foram carregados
          </Text>
        </View>
      );
    }
    
    if (carregandoMais) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando mais hinos...
          </Text>
        </View>
      );
    }
    
    return null;
  }, [carregandoMais, temMaisPaginas, hinos.length, colors]);

  const renderEmptyState = useCallback(() => {
    if (searching || loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Feather name="search" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {searchText.trim() 
            ? 'Nenhum hino encontrado para sua busca' 
            : 'Nenhum hino disponível'
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
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Carregando hinos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Hinos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => setMostrarEstatisticas(!mostrarEstatisticas)}>
            <Feather name="bar-chart-2" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={buscarHinoAleatorio}>
            <Feather name="shuffle" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setSearchText('');
            setPaginaAtual(1);
            setTemMaisPaginas(true);
            carregarHinos(1, true);
          }}>
            <Feather name={searchText.trim() ? "x" : "search"} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {renderEstatisticas()}

      <SyncStatus />

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.searchBackground, borderWidth: 1, borderColor: colors.border }]}>
          <Feather name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                     <TextInput
             style={[styles.searchInput, { color: colors.text }]}
             placeholder="Buscar hinos ou digite um número"
             placeholderTextColor={colors.textSecondary}
             value={searchText}
             onChangeText={(text) => {
               setSearchText(text);
               // Se o texto foi apagado completamente, recarregar a lista
               if (!text.trim()) {
                 setPaginaAtual(1);
                 setTemMaisPaginas(true);
                 carregarHinos(1, true);
               }
             }}
             onSubmitEditing={buscarHinos}
             returnKeyType="search"
             keyboardType="default"
           />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={buscarHinos}
            activeOpacity={0.7}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>
          {`Todos os Hinos: ${totalHinos}`
          }
        </Text>
        {searching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Buscando...</Text>
          </View>
        ) : (
          <FlatList
            data={hinos}
            renderItem={renderHinoItem}
            keyExtractor={(item, index) => `${item.numero}-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
            onEndReached={carregarMaisHinos}
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
      
      {/* Modal de sincronização inicial removido - sincronização agora acontece em segundo plano */}
    </SafeAreaView>
  );
};

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
  estatisticasContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    padding: 16,
  },
  estatisticasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  estatisticasTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  estatisticasGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  estatisticaItem: {
    alignItems: 'center',
  },
  estatisticaValor: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  estatisticaLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default InicioScreen;