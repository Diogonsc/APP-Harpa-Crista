// Script para testar a funcionalidade offline
console.log('🧪 Testando funcionalidade offline...');

// Simular dados que seriam salvos no localStorage
const mockHinoCompleto = {
  numero: 1,
  titulo: "Chuvas De Graça",
  autor: "CPAD / J.R.",
  letra: "1. Deus prometeu com certeza\nChuvas de graça mandar;\nEle nos dá fortaleza,\nE ricas bênçãos sem par\n\nChuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.\n\n2. Cristo nos tem concedido\nO santo Consolador,\nDe plena paz nos enchido,\nPara o reinado de amor.\n\nChuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.\n\n3. Dá-nos, Senhor, amplamente,\nTeu grande gozo e poder;\nFonte de amor permanente,\nPõe dentro de nosso ser.\n\nChuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.\n\n4. Faze os teus servos piedosos,\nDá-lhes virtude e valor,\nDando os teus dons preciosos,\nDo santo Preceptor.\n\nChuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.",
  verses: [
    {
      sequence: 1,
      lyrics: "Deus prometeu com certeza\nChuvas de graça mandar;\nEle nos dá fortaleza,\nE ricas bênçãos sem par",
      chorus: false
    },
    {
      sequence: 2,
      lyrics: "Chuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.",
      chorus: true
    },
    {
      sequence: 3,
      lyrics: "Cristo nos tem concedido\nO santo Consolador,\nDe plena paz nos enchido,\nPara o reinado de amor.",
      chorus: false
    },
    {
      sequence: 4,
      lyrics: "Dá-nos, Senhor, amplamente,\nTeu grande gozo e poder;\nFonte de amor permanente,\nPõe dentro de nosso ser.",
      chorus: false
    },
    {
      sequence: 5,
      lyrics: "Faze os teus servos piedosos,\nDá-lhes virtude e valor,\nDando os teus dons preciosos,\nDo santo Preceptor.",
      chorus: false
    }
  ],
  coro: "Chuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.",
  audioUrl: "https://harpa.nyc3.digitaloceanspaces.com/1.mp3"
};

console.log('📋 Dados do hino completo:');
console.log(`   Número: ${mockHinoCompleto.numero}`);
console.log(`   Título: ${mockHinoCompleto.titulo}`);
console.log(`   Autor: ${mockHinoCompleto.autor}`);
console.log(`   Tem letra: ${!!mockHinoCompleto.letra}`);
console.log(`   Tamanho da letra: ${mockHinoCompleto.letra.length} caracteres`);
console.log(`   Número de versos: ${mockHinoCompleto.verses.length}`);
console.log(`   Tem coro: ${!!mockHinoCompleto.coro}`);
console.log(`   Tem áudio: ${!!mockHinoCompleto.audioUrl}`);

console.log('\n📝 Primeiros 200 caracteres da letra:');
console.log(mockHinoCompleto.letra.substring(0, 200) + '...');

console.log('\n🎵 Versos:');
mockHinoCompleto.verses.forEach((verso, index) => {
  console.log(`   ${index + 1}. ${verso.chorus ? '[CORO]' : `[VERSO ${verso.sequence}]`}: ${verso.lyrics.substring(0, 50)}...`);
});

console.log('\n🎶 Coro:');
console.log(mockHinoCompleto.coro);

console.log('\n✅ Teste de dados completos concluído!');
console.log('📱 Estes dados devem estar disponíveis offline no app.');
console.log('🔍 Para testar:');
console.log('   1. Abra o app com internet');
console.log('   2. Aguarde a sincronização inicial');
console.log('   3. Desligue a internet');
console.log('   4. Tente abrir o hino 1');
console.log('   5. A letra deve aparecer mesmo offline'); 