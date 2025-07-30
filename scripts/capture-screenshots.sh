#!/bin/bash

# Script para capturar screenshots do Harpa Cristã
# Execute este script após iniciar o app no simulador/emulador

echo "📱 Capturando screenshots do Harpa Cristã..."

# Criar diretório para screenshots
mkdir -p screenshots/ios
mkdir -p screenshots/android

echo "📂 Diretórios criados: screenshots/ios e screenshots/android"

echo ""
echo "🎯 Próximos passos:"
echo ""
echo "📱 Para iOS:"
echo "1. Abra o simulador: xcrun simctl boot 'iPhone 14'"
echo "2. Execute o app: npm run ios"
echo "3. Navegue pelas telas e pressione Cmd+S para capturar"
echo "4. Salve as imagens em screenshots/ios/"
echo ""
echo "🤖 Para Android:"
echo "1. Abra o emulador Android"
echo "2. Execute o app: npm run android"
echo "3. Use o comando: adb shell screencap -p /sdcard/screenshot.png"
echo "4. Baixe: adb pull /sdcard/screenshot.png screenshots/android/"
echo ""
echo "📋 Telas necessárias:"
echo "- Tela Principal (Home)"
echo "- Tela de Detalhes do Hino"
echo "- Tela de Favoritos"
echo "- Tela de Configurações"
echo "- Tela de Player de Áudio"
echo ""
echo "📏 Resoluções:"
echo "- iPhone: 1170x2532 px"
echo "- iPad: 1640x2360 px"
echo "- Android Phone: 1080x1920 px"
echo "- Android Tablet: 1200x1920 px"
echo ""
echo "✅ Após capturar, renomeie os arquivos para:"
echo "- home-iphone.png"
echo "- details-iphone.png"
echo "- favorites-iphone.png"
echo "- settings-iphone.png"
echo "- player-iphone.png"
echo ""
echo "🎨 Para editar screenshots, use:"
echo "- Figma (gratuito)"
echo "- Canva (gratuito)"
echo "- Photoshop (pago)"
echo ""
echo "📝 Dicas:"
echo "- Mantenha consistência visual"
echo "- Mostre as principais funcionalidades"
echo "- Use texto claro e legível"
echo "- Teste em dispositivos reais" 