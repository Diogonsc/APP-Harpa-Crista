#!/usr/bin/env node

/**
 * Script de teste para verificar a implementação de áudio em segundo plano
 * Execute este script para verificar se todas as dependências e configurações estão corretas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando implementação de áudio em segundo plano...\n');

// Verificar se react-native-track-player está instalado
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasTrackPlayer = packageJson.dependencies && packageJson.dependencies['react-native-track-player'];

if (hasTrackPlayer) {
  console.log('✅ react-native-track-player está instalado');
} else {
  console.log('❌ react-native-track-player NÃO está instalado');
  console.log('   Execute: npm install react-native-track-player');
}

// Verificar configurações no app.json
const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
const iosConfig = appJson.expo.ios;
const androidConfig = appJson.expo.android;

let iosOk = false;
let androidOk = false;

if (iosConfig && iosConfig.infoPlist && iosConfig.infoPlist.UIBackgroundModes) {
  if (iosConfig.infoPlist.UIBackgroundModes.includes('audio')) {
    console.log('✅ Configuração iOS para áudio em segundo plano está correta');
    iosOk = true;
  } else {
    console.log('❌ Configuração iOS para áudio em segundo plano está incorreta');
  }
} else {
  console.log('❌ Configuração iOS para áudio em segundo plano não encontrada');
}

if (androidConfig && androidConfig.permissions) {
  const hasWakeLock = androidConfig.permissions.includes('WAKE_LOCK');
  const hasModifyAudio = androidConfig.permissions.includes('android.permission.MODIFY_AUDIO_SETTINGS');
  
  if (hasWakeLock && hasModifyAudio) {
    console.log('✅ Configuração Android para áudio em segundo plano está correta');
    androidOk = true;
  } else {
    console.log('❌ Configuração Android para áudio em segundo plano está incorreta');
  }
} else {
  console.log('❌ Configuração Android para áudio em segundo plano não encontrada');
}

// Verificar arquivos de implementação
const filesToCheck = [
  'src/services/trackPlayerService.ts',
  'src/services/trackPlayerEvents.ts',
  'src/contexts/AudioContext.tsx',
  'src/components/FloatingPlayer.tsx',
  'src/components/ExpandedPlayer.tsx',
  'index.js'
];

let filesOk = 0;
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
    filesOk++;
  } else {
    console.log(`❌ ${file} NÃO existe`);
  }
});

// Resumo
console.log('\n📊 Resumo:');
console.log(`- TrackPlayer instalado: ${hasTrackPlayer ? 'Sim' : 'Não'}`);
console.log(`- Configuração iOS: ${iosOk ? 'OK' : 'Problema'}`);
console.log(`- Configuração Android: ${androidOk ? 'OK' : 'Problema'}`);
console.log(`- Arquivos de implementação: ${filesOk}/${filesToCheck.length}`);

if (hasTrackPlayer && iosOk && androidOk && filesOk === filesToCheck.length) {
  console.log('\n🎉 Tudo configurado corretamente!');
  console.log('A implementação de áudio em segundo plano deve funcionar.');
} else {
  console.log('\n⚠️  Há problemas na configuração.');
  console.log('Verifique os itens marcados com ❌ acima.');
}

console.log('\n📝 Próximos passos:');
console.log('1. Execute: npm start');
console.log('2. Teste a reprodução de um áudio');
console.log('3. Saia do app e verifique se a notificação aparece');
console.log('4. Use os controles da notificação para controlar o áudio'); 