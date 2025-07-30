import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HinoFavorito {
  numero: number;
  titulo: string;
  autor?: string;
}

interface FavoritosContextType {
  favoritos: HinoFavorito[];
  verificarFavorito: (numero: number) => Promise<boolean>;
  verificarFavoritoSync: (numero: number) => boolean;
  alternarFavorito: (hino: HinoFavorito) => Promise<void>;
  adicionarFavorito: (hino: HinoFavorito) => Promise<void>;
  removerFavorito: (numero: number) => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

const FAVORITOS_STORAGE_KEY = '@harpa_crista_favoritos';

export function FavoritosProvider({ children }: { children: React.ReactNode }) {
  const [favoritos, setFavoritos] = useState<HinoFavorito[]>([]);

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const favoritosSalvos = await AsyncStorage.getItem(FAVORITOS_STORAGE_KEY);
      if (favoritosSalvos) {
        setFavoritos(JSON.parse(favoritosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  };

  const salvarFavoritos = async (novosFavoritos: HinoFavorito[]) => {
    try {
      await AsyncStorage.setItem(FAVORITOS_STORAGE_KEY, JSON.stringify(novosFavoritos));
      setFavoritos(novosFavoritos);
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const verificarFavorito = async (numero: number): Promise<boolean> => {
    return favoritos.some(favorito => favorito.numero === numero);
  };

  const verificarFavoritoSync = (numero: number): boolean => {
    return favoritos.some(favorito => favorito.numero === numero);
  };

  const adicionarFavorito = async (hino: HinoFavorito) => {
    const novoFavorito = { ...hino };
    const novosFavoritos = [...favoritos, novoFavorito];
    await salvarFavoritos(novosFavoritos);
  };

  const removerFavorito = async (numero: number) => {
    const novosFavoritos = favoritos.filter(favorito => favorito.numero !== numero);
    await salvarFavoritos(novosFavoritos);
  };

  const alternarFavorito = async (hino: HinoFavorito) => {
    const isFavorito = verificarFavoritoSync(hino.numero);
    
    if (isFavorito) {
      await removerFavorito(hino.numero);
    } else {
      await adicionarFavorito(hino);
    }
  };

  return (
    <FavoritosContext.Provider 
      value={{ 
        favoritos, 
        verificarFavorito, 
        verificarFavoritoSync,
        alternarFavorito, 
        adicionarFavorito, 
        removerFavorito 
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const context = useContext(FavoritosContext);
  if (context === undefined) {
    throw new Error('useFavoritos must be used within a FavoritosProvider');
  }
  return context;
} 