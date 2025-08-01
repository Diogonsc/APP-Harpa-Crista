const { LocalStorageService } = require('../src/services/localStorageService');
const { SyncService } = require('../src/services/syncService');

async function testSyncComplete() {
  console.log('🧪 Testando sincronização completa...');
  
  try {
    // Verificar se há dados locais
    const stats = await LocalStorageService.getCacheStats();
    console.log('📊 Estatísticas atuais:', stats);
    
    // Verificar se há hinos completos salvos
    const hinosCompletos = await LocalStorageService.loadHinosCompletos();
    console.log(`📚 Hinos completos salvos: ${hinosCompletos.length}`);
    
    if (hinosCompletos.length > 0) {
      console.log('✅ Hinos completos encontrados!');
      
      // Testar busca de um hino específico
      const hino1 = await LocalStorageService.getHinoCompletoByNumber(1);
      if (hino1) {
        console.log('✅ Hino 1 encontrado localmente:');
        console.log(`   Título: ${hino1.titulo}`);
        console.log(`   Autor: ${hino1.autor}`);
        console.log(`   Tem letra: ${!!hino1.letra}`);
        console.log(`   Tem versos: ${hino1.verses ? hino1.verses.length : 0}`);
        console.log(`   Tem coro: ${!!hino1.coro}`);
        console.log(`   Tem áudio: ${!!hino1.audioUrl}`);
      } else {
        console.log('❌ Hino 1 não encontrado localmente');
      }
      
      const hino2 = await LocalStorageService.getHinoCompletoByNumber(2);
      if (hino2) {
        console.log('✅ Hino 2 encontrado localmente:');
        console.log(`   Título: ${hino2.titulo}`);
        console.log(`   Autor: ${hino2.autor}`);
        console.log(`   Tem letra: ${!!hino2.letra}`);
        console.log(`   Tem versos: ${hino2.verses ? hino2.verses.length : 0}`);
        console.log(`   Tem coro: ${!!hino2.coro}`);
        console.log(`   Tem áudio: ${!!hino2.audioUrl}`);
      } else {
        console.log('❌ Hino 2 não encontrado localmente');
      }
    } else {
      console.log('⚠️  Nenhum hino completo encontrado localmente');
      console.log('🔄 Iniciando sincronização...');
      
      // Iniciar sincronização
      const result = await SyncService.syncAllHinos({
        onProgress: (progress) => {
          console.log(`📥 Progresso: ${progress.currentHinos}/${progress.totalHinos} hinos (página ${progress.currentPage}/${progress.totalPages})`);
        },
        onComplete: (result) => {
          if (result.success) {
            console.log(`✅ Sincronização concluída com ${result.totalHinos} hinos`);
          } else {
            console.log(`❌ Sincronização falhou: ${result.error}`);
          }
        }
      });
      
      console.log('📊 Resultado da sincronização:', result);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste
testSyncComplete(); 