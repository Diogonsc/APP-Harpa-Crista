const { SyncService } = require('../src/services/syncService');
const { LocalStorageService } = require('../src/services/localStorageService');

async function testSyncSystem() {
  console.log('🧪 Iniciando testes do sistema de sincronização...\n');

  try {
    // Teste 1: Verificar estatísticas iniciais
    console.log('1️⃣ Verificando estatísticas iniciais...');
    const initialStats = await SyncService.getSyncStats();
    console.log('Estatísticas iniciais:', initialStats);
    console.log('');

    // Teste 2: Verificar se precisa sincronizar
    console.log('2️⃣ Verificando se precisa sincronizar...');
    const needsSync = await SyncService.needsSync();
    console.log('Precisa sincronizar:', needsSync);
    console.log('');

    // Teste 3: Verificar conectividade
    console.log('3️⃣ Verificando conectividade com a internet...');
    const hasInternet = await SyncService.checkInternetConnection();
    console.log('Tem internet:', hasInternet);
    console.log('');

    // Teste 4: Sincronização inteligente
    console.log('4️⃣ Testando sincronização inteligente...');
    const smartSyncResult = await SyncService.smartSync({
      onProgress: (progress) => {
        console.log(`📊 Progresso: ${progress.currentPage}/${progress.totalPages} páginas (${progress.currentHinos} hinos)`);
      },
      onComplete: (result) => {
        console.log('✅ Sincronização concluída:', result);
      }
    });
    console.log('Resultado da sincronização inteligente:', smartSyncResult);
    console.log('');

    // Teste 5: Verificar estatísticas após sincronização
    console.log('5️⃣ Verificando estatísticas após sincronização...');
    const finalStats = await SyncService.getSyncStats();
    console.log('Estatísticas finais:', finalStats);
    console.log('');

    // Teste 6: Testar busca local
    console.log('6️⃣ Testando busca local...');
    const localHinos = await LocalStorageService.loadHinos();
    console.log(`Total de hinos no cache local: ${localHinos.length}`);
    
    if (localHinos.length > 0) {
      const firstHino = localHinos[0];
      console.log('Primeiro hino:', firstHino);
      
      // Testar busca por número
      const hinoPorNumero = await LocalStorageService.getHinoByNumber(firstHino.numero);
      console.log('Hino encontrado por número:', hinoPorNumero ? 'Sim' : 'Não');
      
      // Testar busca por texto
      const buscaResult = await LocalStorageService.searchHinos('louvor');
      console.log(`Busca por "louvor" encontrou ${buscaResult.length} hinos`);
    }
    console.log('');

    // Teste 7: Verificar validade do cache
    console.log('7️⃣ Verificando validade do cache...');
    const cacheValid = await LocalStorageService.isCacheValid();
    console.log('Cache válido:', cacheValid);
    console.log('');

    console.log('✅ Todos os testes concluídos com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Função para testar cenários específicos
async function testSpecificScenarios() {
  console.log('\n🔍 Testando cenários específicos...\n');

  try {
    // Cenário 1: Simular sem internet
    console.log('📱 Cenário 1: Simulando sem internet...');
    // Aqui você pode simular desconexão de rede
    
    // Cenário 2: Testar limpeza de cache
    console.log('🗑️ Cenário 2: Testando limpeza de cache...');
    await LocalStorageService.clearCache();
    const statsAfterClear = await SyncService.getSyncStats();
    console.log('Estatísticas após limpeza:', statsAfterClear);
    
    // Cenário 3: Testar sincronização forçada
    console.log('🔄 Cenário 3: Testando sincronização forçada...');
    const forceSyncResult = await SyncService.forceSync({
      onProgress: (progress) => {
        console.log(`🔄 Forçando sincronização: ${progress.currentPage}/${progress.totalPages}`);
      }
    });
    console.log('Resultado da sincronização forçada:', forceSyncResult);

  } catch (error) {
    console.error('❌ Erro nos cenários específicos:', error);
  }
}

// Executar testes
async function runAllTests() {
  await testSyncSystem();
  await testSpecificScenarios();
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testSyncSystem,
  testSpecificScenarios,
  runAllTests
}; 