#!/bin/bash

# Script para organizar screenshots do App Harpa Cristã
# Uso: ./organize-screenshots.sh [pasta-com-screenshots]

SCREENSHOTS_DIR=${1:-"./screenshots-to-organize"}
TARGET_DIR="./screenshots"

# Criar estrutura de pastas se não existir
mkdir -p "$TARGET_DIR/android/home"
mkdir -p "$TARGET_DIR/android/favorites"
mkdir -p "$TARGET_DIR/android/audio"
mkdir -p "$TARGET_DIR/android/settings"
mkdir -p "$TARGET_DIR/android/hymn-details"
mkdir -p "$TARGET_DIR/android/audio-details"

mkdir -p "$TARGET_DIR/ios/home"
mkdir -p "$TARGET_DIR/ios/favorites"
mkdir -p "$TARGET_DIR/ios/audio"
mkdir -p "$TARGET_DIR/ios/settings"
mkdir -p "$TARGET_DIR/ios/hymn-details"
mkdir -p "$TARGET_DIR/ios/audio-details"

echo "📱 Organizando screenshots do App Harpa Cristã..."
echo "📁 Pasta de origem: $SCREENSHOTS_DIR"
echo "📁 Pasta de destino: $TARGET_DIR"

# Função para detectar o tema baseado no conteúdo da imagem
detect_theme() {
    local image_path="$1"
    # Por enquanto, assumimos tema escuro para as screenshots fornecidas
    # Em uma implementação real, você poderia usar ferramentas como ImageMagick
    # para analisar a cor dominante da imagem
    echo "dark"
}

# Função para detectar a plataforma
detect_platform() {
    local image_path="$1"
    # Por enquanto, assumimos Android
    # Em uma implementação real, você poderia analisar as dimensões da imagem
    echo "android"
}

# Função para detectar a tela baseado no conteúdo
detect_screen() {
    local image_path="$1"
    local filename=$(basename "$image_path" | tr '[:upper:]' '[:lower:]')
    
    # Detecção baseada no nome do arquivo ou análise de conteúdo
    if [[ $filename == *"home"* ]] || [[ $filename == *"inicio"* ]]; then
        echo "home"
    elif [[ $filename == *"favorit"* ]]; then
        echo "favorites"
    elif [[ $filename == *"audio"* ]]; then
        echo "audio"
    elif [[ $filename == *"config"* ]] || [[ $filename == *"setting"* ]]; then
        echo "settings"
    elif [[ $filename == *"letra"* ]] || [[ $filename == *"lyric"* ]]; then
        echo "hymn-details"
    elif [[ $filename == *"player"* ]] || [[ $filename == *"play"* ]]; then
        echo "audio-details"
    else
        echo "unknown"
    fi
}

# Função para obter resolução da imagem
get_resolution() {
    local image_path="$1"
    # Por enquanto, assumimos resolução padrão
    # Em uma implementação real, você usaria ferramentas como ImageMagick
    echo "1080x1920"
}

# Processar cada imagem na pasta de origem
if [ -d "$SCREENSHOTS_DIR" ]; then
    for image in "$SCREENSHOTS_DIR"/*.{png,jpg,jpeg}; do
        if [ -f "$image" ]; then
            echo "🖼️  Processando: $(basename "$image")"
            
            platform=$(detect_platform "$image")
            screen=$(detect_screen "$image")
            theme=$(detect_theme "$image")
            resolution=$(get_resolution "$image")
            
            # Gerar nome do arquivo
            new_name="${screen}-${theme}-${resolution}.png"
            target_path="$TARGET_DIR/$platform/$screen/$new_name"
            
            echo "   📱 Plataforma: $platform"
            echo "   🖥️  Tela: $screen"
            echo "   🌙 Tema: $theme"
            echo "   📐 Resolução: $resolution"
            echo "   📄 Novo nome: $new_name"
            
            # Copiar arquivo para pasta correta
            cp "$image" "$target_path"
            echo "   ✅ Movido para: $target_path"
            echo ""
        fi
    done
    
    echo "🎉 Organização concluída!"
    echo "📊 Resumo:"
    echo "   - Android: $(find $TARGET_DIR/android -name "*.png" | wc -l) screenshots"
    echo "   - iOS: $(find $TARGET_DIR/ios -name "*.png" | wc -l) screenshots"
else
    echo "❌ Pasta de origem não encontrada: $SCREENSHOTS_DIR"
    echo "💡 Dica: Execute o script com o caminho da pasta contendo as screenshots:"
    echo "   ./organize-screenshots.sh /caminho/para/screenshots"
fi 