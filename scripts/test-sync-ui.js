// Script para testar a interface de sincronização
// Este script simula o comportamento da interface de sincronização

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

// Simular SyncService
const SyncService = {
  async getSyncStats() {
    const stats = await LocalStorageService.getCacheStats();
    const cacheValid = await LocalStorageService.isCacheValid();
    
    return {
      hasLocalData: stats.totalHinos > 0,
      totalHinos: stats.totalHinos,
      lastUpdate: stats.lastUpdate,
      cacheValid
    };
  },

  async forceSync() {
    console.log('🔄 Simulando sincronização forçada...');
    // Simular download de dados
    const mockHinos = [
      { numero: 1, titulo: 'Chuvas De Graça', autor: 'CPAD / J.R.', audioUrl: 'https://example.com/1.mp3' },
      { numero: 2, titulo: 'Hino de Louvor', autor: 'CPAD / J.R.', audioUrl: 'https://example.com/2.mp3' },
      { numero: 3, titulo: 'Adoração', autor: 'CPAD / J.R.', audioUrl: 'https://example.com/3.mp3' }
    ];
    
    await LocalStorageService.saveHinos(mockHinos);
    
    return {
      success: true,
      totalHinos: mockHinos.length
    };
  }
};

// Simular interface de usuário
const UI = {
  // Simular estado da interface
  state: {
    hasLocalData: false,
    isLoading: true,
    showSyncButton: true
  },

  // Verificar dados locais
  async checkLocalData() {
    console.log('🔍 Verificando dados locais...');
    
    try {
      const stats = await SyncService.getSyncStats();
      this.state.hasLocalData = stats.hasLocalData;
      this.state.showSyncButton = !stats.hasLocalData || !stats.cacheValid;
      
      console.log('📊 Status dos dados locais:');
      console.log(`   - Tem dados locais: ${stats.hasLocalData}`);
      console.log(`   - Cache válido: ${stats.cacheValid}`);
      console.log(`   - Total de hinos: ${stats.totalHinos}`);
      console.log(`   - Mostrar botão sincronizar: ${this.state.showSyncButton}`);
      
      return stats;
    } catch (error) {
      console.error('❌ Erro ao verificar dados locais:', error);
      return null;
    }
  },

  // Simular sincronização
  async syncHinos() {
    console.log('🔄 Iniciando sincronização...');
    
    try {
      const result = await SyncService.forceSync();
      
      if (result.success) {
        console.log(`✅ Sincronização concluída! ${result.totalHinos} hinos baixados`);
        
        // Atualizar estado da interface
        await this.checkLocalData();
        
        console.log('📱 Interface atualizada:');
        console.log(`   - Tem dados locais: ${this.state.hasLocalData}`);
        console.log(`   - Mostrar botão sincronizar: ${this.state.showSyncButton}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      return { success: false, error: error.message };
    }
  },

  // Simular limpeza de cache
  async clearCache() {
    console.log('🗑️ Limpando cache...');
    
    try {
      await LocalStorageService.clearCache();
      await this.checkLocalData();
      
      console.log('📱 Interface após limpeza:');
      console.log(`   - Tem dados locais: ${this.state.hasLocalData}`);
      console.log(`   - Mostrar botão sincronizar: ${this.state.showSyncButton}`);
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }
};

async function testSyncUI() {
  console.log('🧪 Testando interface de sincronização...\n');

  try {
    // Teste 1: Estado inicial (sem dados)
    console.log('1️⃣ Testando estado inicial (sem dados)...');
    await UI.checkLocalData();
    console.log('');

    // Teste 2: Sincronização inicial
    console.log('2️⃣ Testando sincronização inicial...');
    await UI.syncHinos();
    console.log('');

    // Teste 3: Verificar estado após sincronização
    console.log('3️⃣ Verificando estado após sincronização...');
    await UI.checkLocalData();
    console.log('');

    // Teste 4: Simular cache expirado
    console.log('4️⃣ Simulando cache expirado...');
    // Simular cache expirado alterando o timestamp
    await mockAsyncStorage.setItem('@harpa_crista_hinos_last_update', (Date.now() - 25 * 60 * 60 * 1000).toString());
    await UI.checkLocalData();
    console.log('');

    // Teste 5: Limpar cache
    console.log('5️⃣ Testando limpeza de cache...');
    await UI.clearCache();
    console.log('');

    console.log('✅ Todos os testes concluídos!');
    console.log('\n📋 Resumo do comportamento:');
    console.log('   - Botão de sincronização só aparece quando necessário');
    console.log('   - Interface se adapta ao estado dos dados locais');
    console.log('   - Cache expirado força nova sincronização');
    console.log('   - Limpeza de cache reseta o estado');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testSyncUI().catch(console.error); 