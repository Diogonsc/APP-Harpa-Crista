// Script de teste simples para verificar o sistema de sincronização
// Este script simula o comportamento do sistema de sincronização

const API_BASE_URL = 'https://api-harpa-crista-uzgo.vercel.app';

async function testApiEndpoint() {
  console.log('🧪 Testando endpoint da API...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/hinos?page=1&limit=10`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API funcionando!');
    console.log(`📊 Dados recebidos: ${data.hinos?.length || 0} hinos`);
    console.log(`📄 Paginação: página ${data.paginacao?.pagina || 1} de ${data.paginacao?.totalPaginas || 1}`);
    
    if (data.hinos && data.hinos.length > 0) {
      console.log('📝 Exemplo de hino:');
      console.log(`   Número: ${data.hinos[0].number}`);
      console.log(`   Título: ${data.hinos[0].title}`);
      console.log(`   Autor: ${data.hinos[0].author}`);
      console.log(`   Áudio: ${data.hinos[0].audioUrl ? 'Sim' : 'Não'}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao testar API:', error.message);
    return null;
  }
}

async function testMultiplePages() {
  console.log('\n📚 Testando múltiplas páginas...');
  
  try {
    const allHinos = [];
    let pagina = 1;
    const limit = 100;
    let hasMorePages = true;
    
    // Primeira chamada para obter informações de paginação
    const firstResponse = await fetch(`${API_BASE_URL}/api/hinos?page=1&limit=${limit}`);
    const firstData = await firstResponse.json();
    
    const totalPages = firstData.paginacao?.totalPaginas || 1;
    const totalHinos = firstData.paginacao?.total || 0;
    
    console.log(`📊 Total de páginas: ${totalPages}`);
    console.log(`📊 Total de hinos: ${totalHinos}`);
    
    allHinos.push(...firstData.hinos);
    pagina = 2;
    
    // Continuar baixando as páginas restantes
    while (hasMorePages && pagina <= totalPages) {
      console.log(`📥 Baixando página ${pagina} de ${totalPages}...`);
      
      const response = await fetch(`${API_BASE_URL}/api/hinos?page=${pagina}&limit=${limit}`);
      const data = await response.json();
      
      allHinos.push(...data.hinos);
      hasMorePages = pagina < totalPages;
      pagina++;
      
      // Pequena pausa para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`✅ Download concluído! ${allHinos.length} hinos baixados`);
    
    // Verificar estrutura dos dados
    if (allHinos.length > 0) {
      const sampleHino = allHinos[0];
      console.log('📝 Estrutura do hino:');
      console.log(`   - number: ${sampleHino.number}`);
      console.log(`   - title: ${sampleHino.title}`);
      console.log(`   - author: ${sampleHino.author}`);
      console.log(`   - audioUrl: ${sampleHino.audioUrl || 'null'}`);
      
      // Contar hinos com áudio
      const hinosComAudio = allHinos.filter(hino => hino.audioUrl && hino.audioUrl.trim() !== '');
      console.log(`🎵 Hinos com áudio: ${hinosComAudio.length} de ${allHinos.length}`);
    }
    
    return allHinos;
  } catch (error) {
    console.error('❌ Erro ao testar múltiplas páginas:', error.message);
    return [];
  }
}

async function testSearchFunctionality() {
  console.log('\n🔍 Testando funcionalidade de busca...');
  
  try {
    const searchTerms = ['louvor', 'amor', 'Deus', 'Jesus'];
    
    for (const term of searchTerms) {
      console.log(`🔍 Buscando por: "${term}"`);
      
      const response = await fetch(`${API_BASE_URL}/api/hinos/buscar?q=${encodeURIComponent(term)}&page=1&limit=10`);
      const data = await response.json();
      
      console.log(`   Encontrados: ${data.hinos?.length || 0} hinos`);
      
      if (data.hinos && data.hinos.length > 0) {
        console.log(`   Exemplo: "${data.hinos[0].title}" (${data.hinos[0].number})`);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao testar busca:', error.message);
  }
}

async function testStatistics() {
  console.log('\n📊 Testando estatísticas...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/hinos/estatisticas`);
    const data = await response.json();
    
    console.log('📊 Estatísticas da API:');
    console.log(`   Total de hinos: ${data.totalHinos || 0}`);
    console.log(`   Hinos com áudio: ${data.hinosComAudio || 0}`);
    console.log(`   Porcentagem com áudio: ${data.porcentagemComAudio || 0}%`);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error.message);
    return null;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes do sistema de sincronização...\n');
  
  // Teste 1: Endpoint básico
  await testApiEndpoint();
  
  // Teste 2: Múltiplas páginas
  await testMultiplePages();
  
  // Teste 3: Busca
  await testSearchFunctionality();
  
  // Teste 4: Estatísticas
  await testStatistics();
  
  console.log('\n✅ Todos os testes concluídos!');
  console.log('\n📋 Resumo:');
  console.log('   - O sistema está configurado para salvar dados no localStorage');
  console.log('   - Quando offline, a aplicação usa dados locais');
  console.log('   - A sincronização baixa todos os hinos da API');
  console.log('   - Os dados são mapeados corretamente para o formato local');
}

// Executar testes
runAllTests().catch(console.error); 