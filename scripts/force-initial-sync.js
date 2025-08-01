const { LocalStorageService } = require('../src/services/localStorageService');

// Dados fornecidos pelo usuário
const hinosData = {
  "hinos": [
    {
      "_id": {"$oid": "65d722b8fc66c875dc0edfe2"},
      "title": "Chuvas De Graça",
      "verses": [
        {
          "sequence": 1,
          "lyrics": "Deus prometeu com certeza\nChuvas de graça mandar;\nEle nos dá fortaleza,\nE ricas bênçãos sem par",
          "chorus": false
        },
        {
          "sequence": 2,
          "lyrics": "Chuvas de graça,\nChuvas pedimos, Senhor;\nManda-nos chuva constantes,\nChuvas do Consolador.",
          "chorus": true
        },
        {
          "sequence": 3,
          "lyrics": "Cristo nos tem concedido\nO santo Consolador,\nDe plena paz nos enchido,\nPara o reinado de amor.",
          "chorus": false
        },
        {
          "sequence": 4,
          "lyrics": "Dá-nos, Senhor, amplamente,\nTeu grande gozo e poder;\nFonte de amor permanente,\nPõe dentro de nosso ser.",
          "chorus": false
        },
        {
          "sequence": 5,
          "lyrics": "Faze os teus servos piedosos,\nDá-lhes virtude e valor,\nDando os teus dons preciosos,\nDo santo Preceptor.",
          "chorus": false
        }
      ],
      "author": "CPAD / J.R.",
      "number": 1,
      "audioUrl": "https://harpa.nyc3.digitaloceanspaces.com/1.mp3"
    },
    {
      "_id": {"$oid": "65d722b8fc66c875dc0edfe3"},
      "title": "Saudosa Lembrança",
      "verses": [
        {
          "sequence": 1,
          "lyrics": "Oh! que saudosa lembrança\nTenho de ti, o Sião,\nTerra que eu tanto amo,\nPois és do meu coração.\nEu para ti voarei,\nQuando Senhor meu voltar;\nPois Ele foi para o céu,\nE brave vem me buscar.",
          "chorus": false
        },
        {
          "sequence": 2,
          "lyrics": "Sim, eu porfiarei por essa terra de além;\nE lá terminarei as muitas lutas de aquém;\nLá está meu bom Senhor, ao qual eu desejo ver;\nEle é tudo p'ra mim, e sem Ele não posso viver.",
          "chorus": true
        },
        {
          "sequence": 3,
          "lyrics": "Bela, mui bela é a esperança,\nDos que vigiam por ti,\nPois eles recebem força,\nQue só se encontra ali;\nOs que procuram chegar\nAo teu regaço, ó Sião,\nLivres serão de pecar\nE de toda a tentação.",
          "chorus": false
        },
        {
          "sequence": 4,
          "lyrics": "Diz a Sagrada Escritura,\nQue são formosos os pés\nDaqueles que boas novas\nLevam para os infiéis;\nE, se tão belo é falar\nDessas grandezas, aqui,\nQue não será o gozar\nA graça que existe ali!",
          "chorus": false
        }
      ],
      "author": "CPAD / A.N.",
      "number": 2,
      "audioUrl": "https://harpa.nyc3.digitaloceanspaces.com/2.mp3"
    }
  ],
  "paginacao": {
    "pagina": 1,
    "porPagina": 20,
    "total": 640,
    "totalPaginas": 32
  }
};

async function forceInitialSync() {
  console.log('🚀 Forçando sincronização inicial com dados fornecidos...');
  
  try {
    // Converter dados para formato local
    const hinosLocais = hinosData.hinos.map(hino => ({
      numero: hino.number,
      titulo: hino.title,
      autor: hino.author,
      audio: hino.audioUrl,
      audioUrl: hino.audioUrl
    }));
    
    // Converter para formato completo
    const hinosCompletos = hinosData.hinos.map(hino => {
      let coro = '';
      if (hino.verses && Array.isArray(hino.verses) && hino.verses.length > 0) {
        const coroVerso = hino.verses.find((verso) => verso.chorus === true);
        if (coroVerso) coro = coroVerso.lyrics;
      }

      let letraCompleta = '';
      if (hino.verses && Array.isArray(hino.verses) && hino.verses.length > 0) {
        hino.verses.forEach((verso, index) => {
          if (verso.lyrics) {
            if (!verso.chorus) letraCompleta += `${verso.sequence}. `;
            letraCompleta += verso.lyrics;
            if (index < hino.verses.length - 1) letraCompleta += '\n\n';
          }
        });
      }

      return {
        numero: hino.number,
        titulo: hino.title,
        autor: hino.author,
        letra: letraCompleta,
        verses: hino.verses,
        coro,
        audioUrl: hino.audioUrl,
      };
    });
    
    console.log(`📝 Convertendo ${hinosLocais.length} hinos...`);
    
    // Salvar dados locais
    await LocalStorageService.saveHinos(hinosLocais);
    console.log('✅ Hinos básicos salvos');
    
    // Salvar dados completos
    await LocalStorageService.saveHinosCompletos(hinosCompletos);
    console.log('✅ Hinos completos salvos');
    
    // Verificar se salvou corretamente
    const hinosSalvos = await LocalStorageService.loadHinos();
    const hinosCompletosSalvos = await LocalStorageService.loadHinosCompletos();
    
    console.log(`📊 Verificação:`);
    console.log(`   Hinos básicos salvos: ${hinosSalvos.length}`);
    console.log(`   Hinos completos salvos: ${hinosCompletosSalvos.length}`);
    
    // Testar busca de hinos específicos
    const hino1 = await LocalStorageService.getHinoCompletoByNumber(1);
    const hino2 = await LocalStorageService.getHinoCompletoByNumber(2);
    
    if (hino1) {
      console.log('✅ Hino 1 disponível offline:');
      console.log(`   Título: ${hino1.titulo}`);
      console.log(`   Tem letra: ${!!hino1.letra}`);
      console.log(`   Tem versos: ${hino1.verses ? hino1.verses.length : 0}`);
      console.log(`   Tem coro: ${!!hino1.coro}`);
    }
    
    if (hino2) {
      console.log('✅ Hino 2 disponível offline:');
      console.log(`   Título: ${hino2.titulo}`);
      console.log(`   Tem letra: ${!!hino2.letra}`);
      console.log(`   Tem versos: ${hino2.verses ? hino2.verses.length : 0}`);
      console.log(`   Tem coro: ${!!hino2.coro}`);
    }
    
    console.log('🎉 Sincronização inicial concluída com sucesso!');
    console.log('📱 Agora o app deve funcionar offline com os hinos 1 e 2');
    
  } catch (error) {
    console.error('❌ Erro durante sincronização inicial:', error);
  }
}

// Executar a sincronização inicial
forceInitialSync(); 