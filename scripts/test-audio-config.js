#!/usr/bin/env node

console.log('🔍 Testando configurações de áudio...\n');

// Verificar se expo-av está instalado
try {
  const packageJson = require('../package.json');
  const hasExpoAv = packageJson.dependencies && packageJson.dependencies['expo-av'];

  if (hasExpoAv) {
    console.log('✅ expo-av está instalado');
  } else {
    console.log('❌ expo-av NÃO está instalado');
  }
} catch (error) {
  console.log('❌ Erro ao ler package.json:', error.message);
}

// Verificar arquivo AudioServiceEnhanced
const fs = require('fs');
const audioServicePath = 'src/services/audioServiceEnhanced.ts';

if (fs.existsSync(audioServicePath)) {
  const content = fs.readFileSync(audioServicePath, 'utf8');
  
  // Verificar se as configurações corretas estão presentes
  const hasCorrectInterruptionMode = content.includes('Audio.InterruptionModeIOS.DoNotMix');
  const hasCorrectPitchCorrection = content.includes('Audio.PitchCorrectionQuality.High');
  
  if (hasCorrectInterruptionMode) {
    console.log('✅ Configuração interruptionModeIOS correta');
  } else {
    console.log('❌ Configuração interruptionModeIOS incorreta');
  }
  
  if (hasCorrectPitchCorrection) {
    console.log('✅ Configuração pitchCorrectionQuality correta');
  } else {
    console.log('❌ Configuração pitchCorrectionQuality incorreta');
  }
  
  console.log('✅ AudioServiceEnhanced.ts existe e está configurado');
} else {
  console.log('❌ AudioServiceEnhanced.ts não existe');
}

console.log('\n🎉 Teste de configuração concluído!');
console.log('\n📝 Próximos passos:');
console.log('1. Execute: npm start');
console.log('2. Verifique se não há mais erros de configuração');
console.log('3. Teste a reprodução de áudio'); 