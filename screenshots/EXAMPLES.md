# Exemplos de Nomenclatura das Screenshots

## 📱 Estrutura de Arquivos Sugerida

Baseado nas screenshots fornecidas, aqui estão os nomes sugeridos para cada arquivo:

### Android - Tema Escuro
```
screenshots/android/home/home-dark-1080x1920.png
screenshots/android/favorites/favorites-dark-1080x1920.png
screenshots/android/audio/audio-dark-1080x1920.png
screenshots/android/settings/settings-dark-1080x1920.png
screenshots/android/hymn-details/hymn-details-dark-1080x1920.png
screenshots/android/audio-details/audio-details-dark-1080x1920.png
```

### Android - Tema Claro
```
screenshots/android/home/home-light-1080x1920.png
screenshots/android/favorites/favorites-light-1080x1920.png
screenshots/android/audio/audio-light-1080x1920.png
screenshots/android/settings/settings-light-1080x1920.png
screenshots/android/hymn-details/hymn-details-light-1080x1920.png
screenshots/android/audio-details/audio-details-light-1080x1920.png
```

### iOS - Tema Escuro
```
screenshots/ios/home/home-dark-1170x2532.png
screenshots/ios/favorites/favorites-dark-1170x2532.png
screenshots/ios/audio/audio-dark-1170x2532.png
screenshots/ios/settings/settings-dark-1170x2532.png
screenshots/ios/hymn-details/hymn-details-dark-1170x2532.png
screenshots/ios/audio-details/audio-details-dark-1170x2532.png
```

### iOS - Tema Claro
```
screenshots/ios/home/home-light-1170x2532.png
screenshots/ios/favorites/favorites-light-1170x2532.png
screenshots/ios/audio/audio-light-1170x2532.png
screenshots/ios/settings/settings-light-1170x2532.png
screenshots/ios/hymn-details/hymn-details-light-1170x2532.png
screenshots/ios/audio-details/audio-details-light-1170x2532.png
```

## 🎯 Padrão de Nomenclatura

### Formato: `{tela}-{tema}-{resolucao}.png`

- **{tela}**: home, favorites, audio, settings, hymn-details, audio-details
- **{tema}**: dark, light
- **{resolucao}**: 1080x1920 (Android), 1170x2532 (iOS)

## 📋 Mapeamento das Screenshots Fornecidas

### Screenshot 1: Tela Principal
- **Conteúdo**: Lista de hinos com "Hinos" no header
- **Nome sugerido**: `home-dark-1080x1920.png`
- **Pasta**: `screenshots/android/home/`

### Screenshot 2: Tela de Favoritos (Vazia)
- **Conteúdo**: Estado vazio com ícone de coração
- **Nome sugerido**: `favorites-dark-1080x1920.png`
- **Pasta**: `screenshots/android/favorites/`

### Screenshot 3: Tela de Áudio
- **Conteúdo**: Lista de áudios com ícones de play
- **Nome sugerido**: `audio-dark-1080x1920.png`
- **Pasta**: `screenshots/android/audio/`

### Screenshot 4: Tela de Configurações
- **Conteúdo**: Configurações com toggles e links
- **Nome sugerido**: `settings-dark-1080x1920.png`
- **Pasta**: `screenshots/android/settings/`

### Screenshot 5: Detalhes do Hino (Letra)
- **Conteúdo**: Letra do hino "Chuvas De Graça"
- **Nome sugerido**: `hymn-details-dark-1080x1920.png`
- **Pasta**: `screenshots/android/hymn-details/`

### Screenshot 6: Detalhes do Áudio (Player)
- **Conteúdo**: Player de áudio do hino
- **Nome sugerido**: `audio-details-dark-1080x1920.png`
- **Pasta**: `screenshots/android/audio-details/`

## 🔧 Comandos Úteis

### Para renomear screenshots existentes:
```bash
# Exemplo para renomear uma screenshot da tela principal
mv screenshot1.png screenshots/android/home/home-dark-1080x1920.png

# Exemplo para renomear uma screenshot de favoritos
mv screenshot2.png screenshots/android/favorites/favorites-dark-1080x1920.png
```

### Para verificar a estrutura:
```bash
# Listar todas as screenshots organizadas
find screenshots -name "*.png" | sort

# Contar screenshots por plataforma
find screenshots/android -name "*.png" | wc -l
find screenshots/ios -name "*.png" | wc -l
``` 