export const API_CONFIG = {
  BASE_URL: 'https://api-harpa-crista-uzgo.vercel.app',
  TIMEOUT: 10000, // 10 segundos
  AUDIO_TIMEOUT: 5000, // 5 segundos para áudio
  ENDPOINTS: {
    HINO_POR_NUMERO: (numero: number) => `/api/hinos/${numero}`,
    HINOS: '/api/hinos',
    BUSCAR_HINOS: '/api/hinos/buscar',
    HINO_ALEATORIO: '/api/hinos/aleatorio',
    ESTATISTICAS: '/api/hinos/estatisticas',
    HINOS_POR_AUTOR: (autor: string) => `/api/hinos/autor/${encodeURIComponent(autor)}`,
    HINOS_POR_FAIXA: (inicio: number, fim: number) => `/api/hinos/faixa/${inicio}/${fim}`,
    AUDIO: (filename: string) => `/audio/${filename}`,
  },
  // Configurações para áudio
  AUDIO: {
    VALID_PROTOCOLS: ['http:', 'https:'],
    VALID_CONTENT_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 segundo
  },
  // Configurações de logging
  LOGGING: {
    ENABLED: __DEV__, // Apenas em desenvolvimento
    AUDIO_ERRORS: true,
    API_ERRORS: true,
  },
};

export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const buildAudioUrl = (filename: string): string => {
  return `${API_CONFIG.BASE_URL}/audio/${filename}`;
};

// Função utilitária para logging
export const logError = (context: string, error: any, additionalInfo?: any) => {
  if (API_CONFIG.LOGGING.ENABLED) {
    console.error(`[${context}]`, error, additionalInfo);
  }
};

// Função para validar URL de áudio
export const validateAudioUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    const urlObj = new URL(url);
    return API_CONFIG.AUDIO.VALID_PROTOCOLS.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Função para testar acessibilidade de URL de áudio
export const testAudioUrl = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.AUDIO_TIMEOUT);

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    logError('Audio URL Test', error, { url });
    return false;
  }
}; 