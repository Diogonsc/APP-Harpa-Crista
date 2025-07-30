#!/usr/bin/env node

console.log('🔍 Verificando implementação de áudio apenas com expo-av...\n');

// Verificar se expo-av está instalado
try {
  const packageJson = require('../package.json');
  const hasExpoAv = packageJson.dependencies && packageJson.dependencies['expo-av'];
  const hasTrackPlayer = packageJson.dependencies && packageJson.dependencies['react-native-track-player'];

  if (hasExpoAv) {
    console.log('✅ expo-av está instalado');
  } else {
    console.log('❌ expo-av NÃO está instalado');
  }

  if (hasTrackPlayer) {
    console.log('⚠️  react-native-track-player ainda está instalado (será removido)');
  } else {
    console.log('✅ react-native-track-player foi removido');
  }
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// Verificar configurações no app.json
try {
  const appJson = require('../app.json');
  const iosConfig = appJson.expo.ios;
  const androidConfig = appJson.expo.android;

  if (iosConfig && iosConfig.infoPlist && iosConfig.infoPlist.UIBackgroundModes) {
    if (iosConfig.infoPlist.UIBackgroundModes.includes('audio')) {
      console.log('✅ Configuração iOS para áudio em segundo plano está correta');
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
    } else {
      console.log('❌ Configuração Android para áudio em segundo plano está incorreta');
    }
  } else {
    console.log('❌ Configuração Android para áudio em segundo plano não encontrada');
  }
} catch (error) {
  console.log('❌ Erro ao ler app.json:', error.message);
}

// Verificar arquivos de implementação
const fs = require('fs');
const filesToCheck = [
  'src/services/audioServiceEnhanced.ts',
  'src/contexts/AudioContext.tsx',
  'src/components/FloatingPlayer.tsx',
  'src/components/ExpandedPlayer.tsx',
  'src/components/MediaNotification.tsx',
  'index.js'
];

const filesToRemove = [
  'src/services/trackPlayerService.ts',
  'src/services/trackPlayerEvents.ts',
  'src/services/trackPlayerInit.ts'
];

console.log('\n📁 Verificando arquivos de implementação:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} NÃO existe`);
  }
});

console.log('\n🗑️  Verificando arquivos removidos:');
filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`⚠️  ${file} ainda existe (deve ser removido)`);
  } else {
    console.log(`✅ ${file} foi removido`);
  }
});

console.log('\n🎉 Verificação concluída!');
console.log('\n📝 Próximos passos:');
console.log('1. Execute: npm start');
console.log('2. Teste a reprodução de um áudio');
console.log('3. Saia do app e verifique se o áudio continua');
console.log('4. Teste os controles no FloatingPlayer e ExpandedPlayer');
console.log('5. Verifique se não há mais erros de runtime'); 