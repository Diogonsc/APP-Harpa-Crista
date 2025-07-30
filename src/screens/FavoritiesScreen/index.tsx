import React, { useState, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  TextInput,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../contexts/ThemeContext";
import { useFavoritos } from "../../contexts/FavoritosContext";
import { Feather } from '@expo/vector-icons';
import HinoItem from "../../components/HinoItem";
import { HinoLocal } from "../../types/api";
import { StatusBar } from "../../components/StatusBar";

type FavoritiesScreenProps = {
  navigation: any;
};

export function FavoritiesScreen({ navigation }: FavoritiesScreenProps) {
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const { isDarkMode, colors } = useTheme();
  const { favoritos, alternarFavorito } = useFavoritos();

  const handleFavoritePress = useCallback(async (hino: HinoLocal) => {
    try {
      await alternarFavorito(hino);
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      Alert.alert('Erro', 'Não foi possível alterar o favorito');
    }
  }, [alternarFavorito]);

  const handleHymnPress = useCallback((hino: HinoLocal) => {
    navigation.navigate('HinoDetalhe', { hino });
  }, [navigation]);

  const buscarFavoritos = useCallback(() => {
    setSearching(true);
    // Simular busca para manter consistência com outras telas
    setTimeout(() => {
      setSearching(false);
    }, 500);
  }, []);

  const onRefresh = useCallback(() => {
    // Recarregar favoritos se necessário
    console.log('Recarregando favoritos...');
  }, []);

  const filteredFavorites = favoritos.filter(hino =>
    hino.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
    hino.numero.toString().includes(searchText)
  );

  const renderFavoriteItem = useCallback(({ item }: { item: any }) => {
    const hinoItem: HinoLocal = {
      numero: item.numero,
      titulo: item.titulo,
      autor: item.autor || '',
      audioUrl: '',
    };

    return (
      <HinoItem
        item={hinoItem}
        isFavorito={true}
        onPress={() => handleHymnPress(hinoItem)}
        onFavoritePress={handleFavoritePress}
        colors={colors}
      />
    );
  }, [handleHymnPress, handleFavoritePress, colors]);

  const renderEmptyState = useCallback(() => {
    if (searching) return null;
    
    if (searchText.trim() && filteredFavorites.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Feather name="search" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Nenhum favorito encontrado para sua busca
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Feather name="heart" size={48} color={colors.textSecondary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Nenhum hino favoritado ainda
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSecondary }]}>
          Adicione hinos aos favoritos para vê-los aqui
        </Text>
      </View>
    );
  }, [searchText, filteredFavorites.length, searching, colors]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Favoritos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => {
            setSearchText('');
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
            placeholder="Buscar favoritos ou digite um número"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={buscarFavoritos}
            returnKeyType="search"
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={buscarFavoritos}
            activeOpacity={0.7}
          >
            <Feather name="search" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 15 }]}>
          {searchText.trim() 
            ? `Resultados da Busca (${filteredFavorites.length} de ${favoritos.length})` 
            : `Todos os Favoritos: ${favoritos.length}`
          }
        </Text>
        {searching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Buscando...</Text>
          </View>
        ) : (
          <FlatList
            data={searchText.trim() ? filteredFavorites : favoritos}
            renderItem={renderFavoriteItem}
            keyExtractor={(item, index) => `${item.numero}-${index}`}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
            ListEmptyComponent={renderEmptyState}
            refreshControl={
              <RefreshControl
                refreshing={false}
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
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});