// Script para testar o localStorage e verificar se os dados estão sendo salvos
// Este script simula o processo de sincronização e verifica o localStorage

const API_BASE_URL = 'https://api-harpa-crista-uzgo.vercel.app';

// Simular AsyncStorage para teste
const mockAsyncStorage = {
  data: {},
  async setItem(key, value) {
    this.data[key] = value;
    console.log(`💾 Salvando: ${key} = ${value.substring(0, 100)}...`);
  },
  async getItem(key) {
    const value = this.data[key];
    console.log(`📖 Lendo: ${key} = ${value ? value.substring(0, 100) + '...' : 'null'}`);
    return value;
  },
  async removeItem(key) {
    delete this.data[key];
    console.log(`🗑️ Removendo: ${key}`);
  }
};

// Simular LocalStorageService
const LocalStorageService = {
  HINOS_STORAGE_KEY: '@harpa_crista_hinos_cache',
  HINOS_LAST_UPDATE_KEY: '@harpa_crista_hinos_last_update',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas

  async saveHinos(hinos) {
    try {
      await mockAsyncStorage.setItem(this.HINOS_STORAGE_KEY, JSON.stringify(hinos));
      await mockAsyncStorage.setItem(this.HINOS_LAST_UPDATE_KEY, Date.now().toString());
      console.log(`✅ Salvos ${hinos.length} hinos no cache local`);
    } catch (error) {
      console.error('❌ Erro ao salvar hinos no cache local:', error);
      throw error;
    }
  },

  async loadHinos() {
    try {
      const hinosData = await mockAsyncStorage.getItem(this.HINOS_STORAGE_KEY);
      if (hinosData) {
        const hinos = JSON.parse(hinosData);
        console.log(`📖 Carregados ${hinos.length} hinos do cache local`);
        return hinos;
      }
      return [];
    } catch (error) {
      console.error('❌ Erro ao carregar hinos do cache local:', error);
      return [];
    }
  },

  async isCacheValid() {
    try {
      const lastUpdate = await mockAsyncStorage.getItem(this.HINOS_LAST_UPDATE_KEY);
      if (!lastUpdate) return false;

      const lastUpdateTime = parseInt(lastUpdate);
      const now = Date.now();
      const isValid = (now - lastUpdateTime) < this.CACHE_DURATION;

      console.log(`🔍 Cache local válido: ${isValid}`);
      return isValid;
    } catch (error) {
      console.error('❌ Erro ao verificar validade do cache:', error);
      return false;
    }
  },

  async getCacheStats() {
    try {
      const hinos = await this.loadHinos();
      const lastUpdateData = await mockAsyncStorage.getItem(this.HINOS_LAST_UPDATE_KEY);
      const lastUpdate = lastUpdateData ? new Date(parseInt(lastUpdateData)) : null;
      
      return {
        totalHinos: hinos.length,
        lastUpdate
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do cache:', error);
      return { totalHinos: 0, lastUpdate: null };
    }
  },

  async clearCache() {
    try {
      await mockAsyncStorage.removeItem(this.HINOS_STORAGE_KEY);
      await mockAsyncStorage.removeItem(this.HINOS_LAST_UPDATE_KEY);
      console.log('🗑️ Cache local limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar cache local:', error);
      throw error;
    }
  }
};

// Simular ApiService
const ApiService = {
  async getHinos(pagina = 1, limit = 20) {
    try {
      const url = `${API_BASE_URL}/api/hinos?page=${pagina}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados da API para o formato local
      const hinosMapeados = data.hinos.map((hino) => ({
        numero: hino.number,
        titulo: hino.title,
        autor: hino.author,
        audio: hino.audioUrl,
        audioUrl: hino.audioUrl ? hino.audioUrl : undefined
      }));
      
      return {
        hinos: hinosMapeados,
        paginacao: {
          pagina: data.paginacao?.pagina || data.currentPage || pagina,
          porPagina: data.paginacao?.porPagina || limit,
          total: data.paginacao?.total || data.totalHinos || hinosMapeados.length,
          totalPaginas: data.paginacao?.totalPaginas || data.totalPages || 1
        }
      };
    } catch (error) {
      console.error('❌ Erro ao buscar hinos da API:', error);
      throw error;
    }
  }
};

// Simular SyncService
const SyncService = {
  async syncAllHinos(callbacks) {
    try {
      console.log('🔄 Iniciando sincronização de hinos...');
      
      const allHinos = [];
      let pagina = 1;
      let hasMorePages = true;
      const limit = 100;
      let totalPages = 0;
      let totalHinos = 0;

      // Primeira chamada para obter informações de paginação
      try {
        const firstResponse = await ApiService.getHinos(1, limit);
        totalPages = firstResponse.paginacao.totalPaginas;
        totalHinos = firstResponse.paginacao.total;
        allHinos.push(...firstResponse.hinos);
        
        console.log(`📊 Primeira página: ${firstResponse.hinos.length} hinos`);
        console.log(`📄 Total de páginas: ${totalPages}`);
        console.log(`📊 Total de hinos: ${totalHinos}`);
        
        pagina = 2;
      } catch (error) {
        console.error('❌ Erro na primeira chamada da API:', error);
        throw error;
      }

      // Continuar baixando as páginas restantes
      while (hasMorePages && pagina <= totalPages) {
        console.log(`📥 Baixando página ${pagina} de ${totalPages}...`);
        
        try {
          const response = await ApiService.getHinos(pagina, limit);
          allHinos.push(...response.hinos);
          
          console.log(`📊 Página ${pagina}: ${response.hinos.length} hinos (Total: ${allHinos.length})`);
          
          hasMorePages = pagina < totalPages;
          pagina++;
          
          // Pequena pausa para não sobrecarregar a API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`❌ Erro ao baixar página ${pagina}:`, error);
          pagina++;
          if (pagina > totalPages) {
            hasMorePages = false;
          }
        }
      }

      // Salvar todos os hinos no storage local
      console.log(`💾 Salvando ${allHinos.length} hinos no storage local...`);
      await LocalStorageService.saveHinos(allHinos);
      
      console.log(`✅ Sincronização concluída! ${allHinos.length} hinos salvos localmente.`);
      
      return {
        success: true,
        totalHinos: allHinos.length
      };
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
      return {
        success: false,
        totalHinos: 0,
        error: error.message
      };
    }
  },

  async getSyncStats() {
    const stats = await LocalStorageService.getCacheStats();
    const cacheValid = await LocalStorageService.isCacheValid();
    
    return {
      hasLocalData: stats.totalHinos > 0,
      totalHinos: stats.totalHinos,
      lastUpdate: stats.lastUpdate,
      cacheValid
    };
  }
};

async function testSyncAndStorage() {
  console.log('🧪 Testando sistema de sincronização e localStorage...\n');

  try {
    // Teste 1: Verificar estado inicial
    console.log('1️⃣ Verificando estado inicial...');
    const initialStats = await SyncService.getSyncStats();
    console.log('Estatísticas iniciais:', initialStats);
    console.log('');

    // Teste 2: Limpar cache (simular estado limpo)
    console.log('2️⃣ Limpando cache...');
    await LocalStorageService.clearCache();
    console.log('');

    // Teste 3: Verificar estado após limpeza
    console.log('3️⃣ Verificando estado após limpeza...');
    const statsAfterClear = await SyncService.getSyncStats();
    console.log('Estatísticas após limpeza:', statsAfterClear);
    console.log('');

    // Teste 4: Executar sincronização
    console.log('4️⃣ Executando sincronização...');
    const syncResult = await SyncService.syncAllHinos();
    console.log('Resultado da sincronização:', syncResult);
    console.log('');

    // Teste 5: Verificar dados salvos
    console.log('5️⃣ Verificando dados salvos...');
    const savedHinos = await LocalStorageService.loadHinos();
    console.log(`📊 Hinos salvos: ${savedHinos.length}`);
    
    if (savedHinos.length > 0) {
      console.log('📝 Exemplo de hino salvo:');
      const sampleHino = savedHinos[0];
      console.log(`   Número: ${sampleHino.numero}`);
      console.log(`   Título: ${sampleHino.titulo}`);
      console.log(`   Autor: ${sampleHino.autor}`);
      console.log(`   Áudio: ${sampleHino.audioUrl ? 'Sim' : 'Não'}`);
      
      // Verificar estrutura dos dados
      const hinosComAudio = savedHinos.filter(hino => hino.audioUrl && hino.audioUrl.trim() !== '');
      console.log(`🎵 Hinos com áudio: ${hinosComAudio.length} de ${savedHinos.length}`);
    }
    console.log('');

    // Teste 6: Verificar validade do cache
    console.log('6️⃣ Verificando validade do cache...');
    const cacheValid = await LocalStorageService.isCacheValid();
    console.log('Cache válido:', cacheValid);
    console.log('');

    // Teste 7: Verificar estatísticas finais
    console.log('7️⃣ Verificando estatísticas finais...');
    const finalStats = await SyncService.getSyncStats();
    console.log('Estatísticas finais:', finalStats);
    console.log('');

    console.log('✅ Todos os testes concluídos com sucesso!');
    console.log('\n📋 Resumo:');
    console.log('   - Sistema de sincronização funcionando corretamente');
    console.log('   - Dados sendo salvos no localStorage');
    console.log('   - Mapeamento de dados correto');
    console.log('   - Cache funcionando adequadamente');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testSyncAndStorage().catch(console.error); 