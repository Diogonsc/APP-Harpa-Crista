import { 
  ApiResponse, 
  HinoLocal, 
  Audio, 
  Estatisticas, 
  BuscaResponse,
  HinosPaginados,
  AudiosPaginados
} from '../types/api';
import { API_CONFIG, buildApiUrl, buildAudioUrl } from '../config/api';
import { LocalStorageService } from './localStorageService';

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export class ApiService {
  // ===== UTILITÁRIOS =====
  
  private static getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}${params ? JSON.stringify(params) : ''}`;
  }

  private static getFromCache(key: string): any | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private static setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  private static async makeRequest<T>(url: string, options?: RequestInit): Promise<T> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        
        // Se é um AbortError ou timeout, tentar novamente
        if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
          console.warn(`Tentativa ${attempt} falhou, tentando novamente...`);
          if (attempt < maxRetries) {
            // Aguardar um pouco antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
        }
        
        // Para outros tipos de erro, não tentar novamente
        break;
      }
    }

    console.error('Erro na requisição após todas as tentativas:', lastError);
    throw lastError;
  }

  /**
   * Verifica se há conexão com a internet
   */
  private static async checkInternetConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://httpbin.org/get', { 
        method: 'GET',
        timeout: 3000 
      });
      return response.ok;
    } catch (error) {
      console.log('Sem conexão com a internet');
      return false;
    }
  }

  // ===== ENDPOINTS DE HINOS =====
  
  static async getHinos(pagina: number = 1, limit: number = 20): Promise<HinosPaginados> {
    const cacheKey = this.getCacheKey('/api/hinos', { pagina, limit });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Verificar conectividade antes de tentar a API
    const hasInternet = await this.checkInternetConnection();
    
    if (!hasInternet) {
      console.log('Sem conexão com a internet, usando dados locais');
      try {
        const localHinos = await LocalStorageService.loadHinos();
        if (localHinos.length > 0) {
          console.log(`Usando ${localHinos.length} hinos do cache local`);
          
          // Aplicar paginação nos dados locais
          const startIndex = (pagina - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedHinos = localHinos.slice(startIndex, endIndex);
          
          const result: HinosPaginados = {
            hinos: paginatedHinos,
            paginacao: {
              pagina,
              porPagina: limit,
              total: localHinos.length,
              totalPaginas: Math.ceil(localHinos.length / limit)
            }
          };
          
          return result;
        } else {
          throw new Error('Sem dados locais disponíveis');
        }
      } catch (localError) {
        console.error('Erro ao carregar dados locais:', localError);
        throw new Error('Sem conexão e sem dados locais disponíveis');
      }
    }

    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.HINOS)}?page=${pagina}&limit=${limit}`;
      const data: any = await this.makeRequest(url);
      
      // Verificar se a resposta tem a estrutura esperada
      if (!data || !data.hinos) {
        throw new Error('Resposta da API inválida');
      }
      
      // Mapear os dados da API para o formato local
      const hinosMapeados: HinoLocal[] = data.hinos.map((hino: any) => ({
        numero: hino.number,
        titulo: hino.title,
        autor: hino.author,
        audio: hino.audioUrl,
        audioUrl: hino.audioUrl ? hino.audioUrl : undefined
      }));
      
      const result: HinosPaginados = {
        hinos: hinosMapeados,
        paginacao: {
          pagina: data.paginacao?.pagina || data.currentPage || pagina,
          porPagina: data.paginacao?.porPagina || limit,
          total: data.paginacao?.total || data.totalHinos || hinosMapeados.length,
          totalPaginas: data.paginacao?.totalPaginas || data.totalPages || 1
        }
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar hinos da API, tentando usar dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHinos = await LocalStorageService.loadHinos();
        if (localHinos.length > 0) {
          console.log('Usando dados locais como fallback');
          
          // Aplicar paginação nos dados locais
          const startIndex = (pagina - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedHinos = localHinos.slice(startIndex, endIndex);
          
          const result: HinosPaginados = {
            hinos: paginatedHinos,
            paginacao: {
              pagina,
              porPagina: limit,
              total: localHinos.length,
              totalPaginas: Math.ceil(localHinos.length / limit)
            }
          };
          
          return result;
        }
      } catch (localError) {
        console.error('Erro ao carregar dados locais:', localError);
      }
      
      throw error;
    }
  }

  static async getHinoPorNumero(numero: number): Promise<HinoLocal | null> {
    const cacheKey = this.getCacheKey(`/api/hinos/${numero}`);
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.HINO_POR_NUMERO(numero));
      const data: any = await this.makeRequest(url);
      
      if (data && data.number) {
        const result = {
          numero: data.number,
          titulo: data.title,
          autor: data.author,
          audio: data.audioUrl,
          audioUrl: data.audioUrl
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar hino por número na API, tentando dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHino = await LocalStorageService.getHinoByNumber(numero);
        if (localHino) {
          console.log('Usando dados locais como fallback para hino por número');
          return localHino;
        }
      } catch (localError) {
        console.error('Erro ao buscar hino local:', localError);
      }
      
      return null;
    }
  }

  static async buscarHinosPorTexto(query: string, pagina: number = 1, limit: number = 20): Promise<HinosPaginados> {
    const cacheKey = this.getCacheKey('/api/hinos/buscar', { q: query, pagina, limit });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.BUSCAR_HINOS)}?q=${encodeURIComponent(query)}&page=${pagina}&limit=${limit}`;
      const data: any = await this.makeRequest(url);
      
      if (data && data.hinos && Array.isArray(data.hinos)) {
        const result: HinosPaginados = {
          hinos: data.hinos.map((hino: any) => ({
            numero: hino.number,
            titulo: hino.title,
            autor: hino.author,
            audio: hino.audioUrl,
            audioUrl: hino.audioUrl
          })),
          paginacao: {
            pagina: data.paginacao?.pagina || data.currentPage || pagina,
            porPagina: data.paginacao?.porPagina || limit,
            total: data.paginacao?.total || data.totalHinos || data.hinos.length,
            totalPaginas: data.paginacao?.totalPaginas || data.totalPages || 1
          }
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar hinos por texto na API, tentando dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHinos = await LocalStorageService.searchHinos(query);
        if (localHinos.length > 0) {
          console.log('Usando busca local como fallback');
          
          // Aplicar paginação nos resultados locais
          const startIndex = (pagina - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedHinos = localHinos.slice(startIndex, endIndex);
          
          const result: HinosPaginados = {
            hinos: paginatedHinos,
            paginacao: {
              pagina,
              porPagina: limit,
              total: localHinos.length,
              totalPaginas: Math.ceil(localHinos.length / limit)
            }
          };
          
          return result;
        }
      } catch (localError) {
        console.error('Erro ao buscar dados locais:', localError);
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    }
  }

  static async getHinoAleatorio(): Promise<HinoLocal | null> {
    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.HINO_ALEATORIO);
      const data: any = await this.makeRequest(url);
      
      if (data && data.number) {
        return {
          numero: data.number,
          titulo: data.title,
          autor: data.author,
          audio: data.audioUrl,
          audioUrl: data.audioUrl
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar hino aleatório na API, tentando dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHino = await LocalStorageService.getRandomHino();
        if (localHino) {
          console.log('Usando dados locais como fallback para hino aleatório');
          return localHino;
        }
      } catch (localError) {
        console.error('Erro ao buscar hino aleatório local:', localError);
      }
      
      return null;
    }
  }

  static async getEstatisticas(): Promise<Estatisticas | null> {
    const cacheKey = this.getCacheKey('/api/hinos/estatisticas');
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = buildApiUrl(API_CONFIG.ENDPOINTS.ESTATISTICAS);
      const data: any = await this.makeRequest(url);
      
      if (data) {
        const result = {
          totalHinos: data.totalHinos || 0,
          totalAudios: data.hinosComAudio || 0,
          hinosComAudio: data.hinosComAudio || 0,
          hinosSemAudio: (data.totalHinos || 0) - (data.hinosComAudio || 0),
          porcentagemComAudio: data.porcentagemComAudio || 0
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  static async getHinosPorAutor(autor: string, pagina: number = 1, limit: number = 20): Promise<HinosPaginados> {
    const cacheKey = this.getCacheKey(`/api/hinos/autor/${autor}`, { pagina, limit });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.HINOS_POR_AUTOR(autor))}?page=${pagina}&limit=${limit}`;
      const data: any = await this.makeRequest(url);
      
      if (data && data.hinos && Array.isArray(data.hinos)) {
        const result: HinosPaginados = {
          hinos: data.hinos.map((hino: any) => ({
            numero: hino.number,
            titulo: hino.title,
            autor: hino.author,
            audio: hino.audioUrl,
            audioUrl: hino.audioUrl
          })),
          paginacao: {
            pagina: data.paginacao?.pagina || data.currentPage || pagina,
            porPagina: data.paginacao?.porPagina || limit,
            total: data.paginacao?.total || data.totalHinos || data.hinos.length,
            totalPaginas: data.paginacao?.totalPaginas || data.totalPages || 1
          }
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar hinos por autor na API, tentando dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHinos = await LocalStorageService.getHinosByAuthor(autor);
        if (localHinos.length > 0) {
          console.log('Usando dados locais como fallback para hinos por autor');
          
          // Aplicar paginação nos resultados locais
          const startIndex = (pagina - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedHinos = localHinos.slice(startIndex, endIndex);
          
          const result: HinosPaginados = {
            hinos: paginatedHinos,
            paginacao: {
              pagina,
              porPagina: limit,
              total: localHinos.length,
              totalPaginas: Math.ceil(localHinos.length / limit)
            }
          };
          
          return result;
        }
      } catch (localError) {
        console.error('Erro ao buscar hinos por autor local:', localError);
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    }
  }

  static async getHinosPorFaixa(inicio: number, fim: number, pagina: number = 1, limit: number = 20): Promise<HinosPaginados> {
    const cacheKey = this.getCacheKey(`/api/hinos/faixa/${inicio}/${fim}`, { pagina, limit });
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.HINOS_POR_FAIXA(inicio, fim))}?page=${pagina}&limit=${limit}`;
      const data: any = await this.makeRequest(url);
      
      if (data && data.hinos && Array.isArray(data.hinos)) {
        const result: HinosPaginados = {
          hinos: data.hinos.map((hino: any) => ({
            numero: hino.number,
            titulo: hino.title,
            autor: hino.author,
            audio: hino.audioUrl,
            audioUrl: hino.audioUrl
          })),
          paginacao: {
            pagina: data.paginacao?.pagina || data.currentPage || pagina,
            porPagina: data.paginacao?.porPagina || limit,
            total: data.paginacao?.total || data.totalHinos || data.hinos.length,
            totalPaginas: data.paginacao?.totalPaginas || data.totalPages || 1
          }
        };
        
        this.setCache(cacheKey, result);
        return result;
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    } catch (error) {
      console.error('Erro ao buscar hinos por faixa na API, tentando dados locais:', error);
      
      // Tentar usar dados locais como fallback
      try {
        const localHinos = await LocalStorageService.getHinosByRange(inicio, fim);
        if (localHinos.length > 0) {
          console.log('Usando dados locais como fallback para hinos por faixa');
          
          // Aplicar paginação nos resultados locais
          const startIndex = (pagina - 1) * limit;
          const endIndex = startIndex + limit;
          const paginatedHinos = localHinos.slice(startIndex, endIndex);
          
          const result: HinosPaginados = {
            hinos: paginatedHinos,
            paginacao: {
              pagina,
              porPagina: limit,
              total: localHinos.length,
              totalPaginas: Math.ceil(localHinos.length / limit)
            }
          };
          
          return result;
        }
      } catch (localError) {
        console.error('Erro ao buscar hinos por faixa local:', localError);
      }
      
      return {
        hinos: [],
        paginacao: {
          pagina,
          porPagina: limit,
          total: 0,
          totalPaginas: 0
        }
      };
    }
  }

  // ===== ENDPOINTS DE ÁUDIOS =====

  static async getAudios(pagina: number = 1, limit: number = 20): Promise<AudiosPaginados> {
    try {
      // Buscar estatísticas para obter o total de áudios disponíveis
      let totalAudios = 0;
      let totalPaginas = 0;
      
      try {
        const estatisticas = await this.getEstatisticas();
        if (estatisticas) {
          totalAudios = estatisticas.hinosComAudio;
          totalPaginas = Math.ceil(totalAudios / limit);
        }
      } catch (error) {
        console.warn('Erro ao buscar estatísticas para total de áudios:', error);
      }
      
      // Buscar todos os hinos (ou uma quantidade grande) para filtrar os que têm áudio
      const response = await this.getHinos(1, 640); // Buscar todos os hinos
      
      // Filtrar apenas hinos que têm áudio
      const hinosComAudio = response.hinos.filter(hino => hino.audioUrl && hino.audioUrl.trim() !== '');
      
      // Pegar apenas os áudios da página atual
      const inicio = (pagina - 1) * limit;
      const fim = inicio + limit;
      const audiosDaPagina = hinosComAudio.slice(inicio, fim);
      
      const audiosMapeados: Audio[] = audiosDaPagina.map((hino) => ({
        numero: hino.numero,
        titulo: hino.titulo,
        autor: hino.autor,
        audioUrl: hino.audioUrl || '',
        filename: hino.audioUrl || ''
      }));
      
      // Se não temos estatísticas, usar os dados disponíveis
      if (totalAudios === 0) {
        totalAudios = hinosComAudio.length;
        totalPaginas = Math.ceil(totalAudios / limit);
      }
      
      console.log(`getAudios - Página: ${pagina}, Áudios encontrados: ${audiosMapeados.length}, Total: ${totalAudios}, Páginas: ${totalPaginas}`);
      
      return {
        audios: audiosMapeados,
        paginacao: {
          pagina: pagina,
          porPagina: limit,
          total: totalAudios,
          totalPaginas: totalPaginas
        }
      };
    } catch (error) {
      console.error('Erro ao buscar áudios:', error);
      throw error;
    }
  }

  static async getAudioPorHino(numero: number): Promise<Audio | null> {
    try {
      const hino = await this.getHinoPorNumero(numero);
      
      if (hino && hino.audioUrl) {
                 return {
           numero: hino.numero,
           titulo: hino.titulo,
           autor: hino.autor,
           audioUrl: hino.audioUrl || '',
           filename: hino.audio || ''
         };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar áudio por hino:', error);
      throw error;
    }
  }

  static async getAudioAleatorio(): Promise<Audio | null> {
    try {
      const hinoAleatorio = await this.getHinoAleatorio();
      
             if (hinoAleatorio && hinoAleatorio.audioUrl) {
         return {
           numero: hinoAleatorio.numero,
           titulo: hinoAleatorio.titulo,
           autor: hinoAleatorio.autor,
           audioUrl: hinoAleatorio.audioUrl || '',
           filename: hinoAleatorio.audio || ''
         };
       }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar áudio aleatório:', error);
      throw error;
    }
  }

  // ===== ACESSO DIRETO AOS ARQUIVOS DE ÁUDIO =====

  static getAudioFileUrl(filename: string): string {
    return buildAudioUrl(filename);
  }

  // ===== MÉTODOS AUXILIARES =====

  static async buscarAudiosPorTexto(query: string, pagina: number = 1, limit: number = 20): Promise<AudiosPaginados> {
    try {
      // Buscar hinos por texto e depois verificar se têm áudio
      const response = await this.buscarHinosPorTexto(query, pagina, limit);
      const audios: Audio[] = [];

      for (const hino of response.hinos) {
        if (hino.audioUrl) {
          audios.push({
            numero: hino.numero,
            titulo: hino.titulo,
            autor: hino.autor,
            audioUrl: hino.audioUrl || '',
            filename: hino.audio || ''
          });
        }
      }

      return {
        audios,
        paginacao: response.paginacao
      };
    } catch (error) {
      console.error('Erro ao buscar áudios por texto:', error);
      throw error;
    }
  }

  // ===== LIMPEZA DE CACHE =====
  
  static clearCache(): void {
    cache.clear();
  }

     static clearCacheForEndpoint(endpoint: string): void {
     for (const key of cache.keys()) {
       if (key.startsWith(endpoint)) {
         cache.delete(key);
       }
     }
   }
} 