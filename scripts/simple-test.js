#!/usr/bin/env node

console.log('🔍 Verificando implementação de áudio em segundo plano...\n');

// Verificar se react-native-track-player está instalado
try {
  const packageJson = require('../package.json');
  const hasTrackPlayer = packageJson.dependencies && packageJson.dependencies['react-native-track-player'];

  if (hasTrackPlayer) {
    console.log('✅ react-native-track-player está instalado');
  } else {
    console.log('❌ react-native-track-player NÃO está instalado');
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
  'src/services/trackPlayerService.ts',
  'src/services/trackPlayerEvents.ts',
  'src/contexts/AudioContext.tsx',
  'src/components/FloatingPlayer.tsx',
  'src/components/ExpandedPlayer.tsx',
  'index.js'
];

console.log('\n📁 Verificando arquivos de implementação:');
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} NÃO existe`);
  }
});

console.log('\n🎉 Verificação concluída!'); 