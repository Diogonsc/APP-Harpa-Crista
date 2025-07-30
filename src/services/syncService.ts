import { ApiService } from './api';
import { LocalStorageService } from './localStorageService';
import { HinoLocal } from '../types/api';

export interface SyncProgress {
  currentPage: number;
  totalPages: number;
  currentHinos: number;
  totalHinos: number;
  isComplete: boolean;
}

export interface SyncCallbacks {
  onProgress?: (progress: SyncProgress) => void;
  onComplete?: (result: { success: boolean; totalHinos: number; error?: string }) => void;
}

export class SyncService {
  /**
   * Sincroniza todos os hinos da API com o storage local
   */
  static async syncAllHinos(callbacks?: SyncCallbacks): Promise<{ success: boolean; totalHinos: number; error?: string }> {
    try {
      console.log('Iniciando sincronização de hinos...');
      
      const allHinos: HinoLocal[] = [];
      let pagina = 1;
      let hasMorePages = true;
      const limit = 100; // Buscar mais hinos por página para acelerar
      let totalPages = 0;
      let totalHinos = 0;

      // Primeira chamada para obter informações de paginação
      try {
        const firstResponse = await ApiService.getHinos(1, limit);
        totalPages = firstResponse.paginacao.totalPaginas;
        totalHinos = firstResponse.paginacao.total;
        allHinos.push(...firstResponse.hinos);
        
        // Notificar progresso inicial
        if (callbacks?.onProgress) {
          callbacks.onProgress({
            currentPage: 1,
            totalPages,
            currentHinos: allHinos.length,
            totalHinos,
            isComplete: false
          });
        }
        
        pagina = 2; // Começar da segunda página
      } catch (error) {
        console.error('Erro na primeira chamada da API:', error);
        throw error;
      }

      // Continuar baixando as páginas restantes
      while (hasMorePages && pagina <= totalPages) {
        console.log(`Baixando página ${pagina} de ${totalPages}...`);
        
        try {
          const response = await ApiService.getHinos(pagina, limit);
          allHinos.push(...response.hinos);
          
          // Notificar progresso
          if (callbacks?.onProgress) {
            callbacks.onProgress({
              currentPage: pagina,
              totalPages,
              currentHinos: allHinos.length,
              totalHinos,
              isComplete: false
            });
          }
          
          hasMorePages = pagina < totalPages;
          pagina++;
          
          // Pequena pausa para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Erro ao baixar página ${pagina}:`, error);
          // Continuar tentando as próximas páginas
          pagina++;
          if (pagina > totalPages) {
            hasMorePages = false;
          }
        }
      }

      // Salvar todos os hinos no storage local
      console.log(`Salvando ${allHinos.length} hinos no storage local...`);
      await LocalStorageService.saveHinos(allHinos);
      
      console.log(`Sincronização concluída! ${allHinos.length} hinos salvos localmente.`);
      
      const result = {
        success: true,
        totalHinos: allHinos.length
      };
      
      // Notificar conclusão
      if (callbacks?.onProgress) {
        callbacks.onProgress({
          currentPage: totalPages,
          totalPages,
          currentHinos: allHinos.length,
          totalHinos: allHinos.length,
          isComplete: true
        });
      }
      
      if (callbacks?.onComplete) {
        callbacks.onComplete(result);
      }
      
      return result;
    } catch (error) {
      console.error('Erro durante sincronização:', error);
      const result = {
        success: false,
        totalHinos: 0,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
      
      if (callbacks?.onComplete) {
        callbacks.onComplete(result);
      }
      
      return result;
    }
  }

  /**
   * Verifica se precisa sincronizar baseado na validade do cache
   */
  static async needsSync(): Promise<boolean> {
    const isCacheValid = await LocalStorageService.isCacheValid();
    return !isCacheValid;
  }

  /**
   * Força uma nova sincronização mesmo se o cache ainda for válido
   */
  static async forceSync(callbacks?: SyncCallbacks): Promise<{ success: boolean; totalHinos: number; error?: string }> {
    console.log('Forçando sincronização...');
    return this.syncAllHinos(callbacks);
  }

  /**
   * Sincroniza apenas se necessário (cache expirado ou vazio)
   */
  static async syncIfNeeded(callbacks?: SyncCallbacks): Promise<{ success: boolean; totalHinos: number; error?: string }> {
    const needsSync = await this.needsSync();
    
    if (needsSync) {
      console.log('Cache expirado ou vazio, iniciando sincronização...');
      return this.syncAllHinos(callbacks);
    } else {
      console.log('Cache ainda válido, pulando sincronização');
      const stats = await LocalStorageService.getCacheStats();
      const result = {
        success: true,
        totalHinos: stats.totalHinos
      };
      
      if (callbacks?.onComplete) {
        callbacks.onComplete(result);
      }
      
      return result;
    }
  }

  /**
   * Retorna estatísticas da sincronização
   */
  static async getSyncStats(): Promise<{
    hasLocalData: boolean;
    totalHinos: number;
    lastUpdate: Date | null;
    cacheValid: boolean;
  }> {
    const stats = await LocalStorageService.getCacheStats();
    const cacheValid = await LocalStorageService.isCacheValid();
    
    return {
      hasLocalData: stats.totalHinos > 0,
      totalHinos: stats.totalHinos,
      lastUpdate: stats.lastUpdate,
      cacheValid
    };
  }

  /**
   * Verifica se há conexão com a internet
   */
  static async checkInternetConnection(): Promise<boolean> {
    try {
      // Tentar fazer uma requisição simples para verificar conectividade
      const response = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        timeout: 5000 
      });
      return response.ok;
    } catch (error) {
      console.log('Sem conexão com a internet');
      return false;
    }
  }

  /**
   * Sincronização inteligente que verifica conectividade primeiro
   */
  static async smartSync(callbacks?: SyncCallbacks): Promise<{ success: boolean; totalHinos: number; error?: string }> {
    const hasInternet = await this.checkInternetConnection();
    
    if (!hasInternet) {
      console.log('Sem conexão com a internet, usando dados locais');
      const stats = await LocalStorageService.getCacheStats();
      
      if (stats.totalHinos > 0) {
        return {
          success: true,
          totalHinos: stats.totalHinos
        };
      } else {
        return {
          success: false,
          totalHinos: 0,
          error: 'Sem conexão com a internet e sem dados locais'
        };
      }
    }
    
    return this.syncIfNeeded(callbacks);
  }
} 