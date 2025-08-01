import AsyncStorage from '@react-native-async-storage/async-storage';
import { HinoLocal, HinosPaginados, HinoCompleto } from '../types/api';

const HINOS_STORAGE_KEY = '@harpa_crista_hinos_cache';
const HINOS_COMPLETOS_STORAGE_KEY = '@harpa_crista_hinos_completos_cache';
const HINOS_LAST_UPDATE_KEY = '@harpa_crista_hinos_last_update';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

export class LocalStorageService {
  /**
   * Salva a lista completa de hinos no storage local
   */
  static async saveHinos(hinos: HinoLocal[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HINOS_STORAGE_KEY, JSON.stringify(hinos));
      await AsyncStorage.setItem(HINOS_LAST_UPDATE_KEY, Date.now().toString());
      console.log(`Salvos ${hinos.length} hinos no cache local`);
    } catch (error) {
      console.error('Erro ao salvar hinos no cache local:', error);
      throw error;
    }
  }

  /**
   * Salva dados completos dos hinos (incluindo letra e versos) no storage local
   */
  static async saveHinosCompletos(hinosCompletos: HinoCompleto[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HINOS_COMPLETOS_STORAGE_KEY, JSON.stringify(hinosCompletos));
      console.log(`Salvos ${hinosCompletos.length} hinos completos no cache local`);
    } catch (error) {
      console.error('Erro ao salvar hinos completos no cache local:', error);
      throw error;
    }
  }

  /**
   * Carrega todos os hinos do storage local
   */
  static async loadHinos(): Promise<HinoLocal[]> {
    try {
      const hinosData = await AsyncStorage.getItem(HINOS_STORAGE_KEY);
      if (hinosData) {
        const hinos = JSON.parse(hinosData);
        console.log(`Carregados ${hinos.length} hinos do cache local`);
        return hinos;
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar hinos do cache local:', error);
      return [];
    }
  }

  /**
   * Carrega dados completos dos hinos do storage local
   */
  static async loadHinosCompletos(): Promise<HinoCompleto[]> {
    try {
      const hinosCompletosData = await AsyncStorage.getItem(HINOS_COMPLETOS_STORAGE_KEY);
      if (hinosCompletosData) {
        const hinosCompletos = JSON.parse(hinosCompletosData);
        console.log(`Carregados ${hinosCompletos.length} hinos completos do cache local`);
        return hinosCompletos;
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar hinos completos do cache local:', error);
      return [];
    }
  }

  /**
   * Busca um hino completo por número no cache local
   */
  static async getHinoCompletoByNumber(numero: number): Promise<HinoCompleto | null> {
    try {
      const hinosCompletos = await this.loadHinosCompletos();
      return hinosCompletos.find(hino => hino.numero === numero) || null;
    } catch (error) {
      console.error('Erro ao buscar hino completo no cache local:', error);
      return null;
    }
  }

  /**
   * Verifica se o cache local está válido (não expirou)
   */
  static async isCacheValid(): Promise<boolean> {
    try {
      const lastUpdate = await AsyncStorage.getItem(HINOS_LAST_UPDATE_KEY);
      if (!lastUpdate) return false;

      const lastUpdateTime = parseInt(lastUpdate);
      const now = Date.now();
      const isValid = (now - lastUpdateTime) < CACHE_DURATION;

      console.log(`Cache local válido: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('Erro ao verificar validade do cache:', error);
      return false;
    }
  }

  /**
   * Busca hinos por texto no cache local
   */
  static async searchHinos(query: string): Promise<HinoLocal[]> {
    try {
      const hinos = await this.loadHinos();
      const searchTerm = query.toLowerCase().trim();
      
      return hinos.filter(hino => 
        hino.titulo.toLowerCase().includes(searchTerm) ||
        hino.autor?.toLowerCase().includes(searchTerm) ||
        hino.numero.toString().includes(searchTerm)
      );
    } catch (error) {
      console.error('Erro ao buscar hinos no cache local:', error);
      return [];
    }
  }

  /**
   * Busca um hino específico por número no cache local
   */
  static async getHinoByNumber(numero: number): Promise<HinoLocal | null> {
    try {
      const hinos = await this.loadHinos();
      return hinos.find(hino => hino.numero === numero) || null;
    } catch (error) {
      console.error('Erro ao buscar hino no cache local:', error);
      return null;
    }
  }

  /**
   * Busca hinos por autor no cache local
   */
  static async getHinosByAuthor(autor: string): Promise<HinoLocal[]> {
    try {
      const hinos = await this.loadHinos();
      const searchTerm = autor.toLowerCase().trim();
      
      return hinos.filter(hino => 
        hino.autor?.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Erro ao buscar hinos por autor no cache local:', error);
      return [];
    }
  }

  /**
   * Busca hinos por faixa de números no cache local
   */
  static async getHinosByRange(inicio: number, fim: number): Promise<HinoLocal[]> {
    try {
      const hinos = await this.loadHinos();
      return hinos.filter(hino => 
        hino.numero >= inicio && hino.numero <= fim
      ).sort((a, b) => a.numero - b.numero);
    } catch (error) {
      console.error('Erro ao buscar hinos por faixa no cache local:', error);
      return [];
    }
  }

  /**
   * Retorna um hino aleatório do cache local
   */
  static async getRandomHino(): Promise<HinoLocal | null> {
    try {
      const hinos = await this.loadHinos();
      if (hinos.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * hinos.length);
      return hinos[randomIndex];
    } catch (error) {
      console.error('Erro ao buscar hino aleatório no cache local:', error);
      return null;
    }
  }

  /**
   * Limpa o cache local
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(HINOS_STORAGE_KEY);
      await AsyncStorage.removeItem(HINOS_COMPLETOS_STORAGE_KEY);
      await AsyncStorage.removeItem(HINOS_LAST_UPDATE_KEY);
      console.log('Cache local limpo');
    } catch (error) {
      console.error('Erro ao limpar cache local:', error);
      throw error;
    }
  }

  /**
   * Retorna estatísticas do cache local
   */
  static async getCacheStats(): Promise<{ totalHinos: number; lastUpdate: Date | null }> {
    try {
      const hinos = await this.loadHinos();
      const lastUpdateData = await AsyncStorage.getItem(HINOS_LAST_UPDATE_KEY);
      const lastUpdate = lastUpdateData ? new Date(parseInt(lastUpdateData)) : null;
      
      return {
        totalHinos: hinos.length,
        lastUpdate
      };
    } catch (error) {
      console.error('Erro ao obter estatísticas do cache:', error);
      return { totalHinos: 0, lastUpdate: null };
    }
  }
} 