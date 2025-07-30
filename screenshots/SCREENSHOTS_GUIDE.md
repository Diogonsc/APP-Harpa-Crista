# Guia de Organização das Screenshots

Baseado nas descrições das screenshots fornecidas, aqui está como elas devem ser organizadas:

## 📱 Screenshots Identificadas

### 1. Tela Principal (Home) - Tema Escuro
**Arquivo sugerido**: `screenshots/android/home/home-dark-1080x1920.png`

**Características identificadas**:
- Título "Hinos" no header
- Barra de pesquisa com placeholder "Buscar hinos ou digite um número"
- Contador "Todos os Hinos: 640"
- Lista de hinos com ícones de música e coração
- Tab "Início" ativo (azul)
- Hinos visíveis: Chuvas De Graça, Saudosa Lembrança, Plena Paz, etc.

### 2. Tela de Favoritos - Tema Escuro
**Arquivo sugerido**: `screenshots/android/favorites/favorites-dark-1080x1920.png`

**Características identificadas**:
- Título "Favoritos" no header
- Barra de pesquisa com placeholder "Buscar favoritos ou digite um número"
- Contador "Todos os Favoritos: 0"
- Estado vazio com ícone de coração grande
- Mensagem "Nenhum hino favoritado ainda"
- Tab "Favoritos" ativo (azul)

### 3. Tela de Áudio - Tema Escuro
**Arquivo sugerido**: `screenshots/android/audio/audio-dark-1080x1920.png`

**Características identificadas**:
- Título "Áudios" no header
- Barra de pesquisa com placeholder "Buscar áudios ou digite um número"
- Contador "Todos os Áudios: 640"
- Lista com ícones de play (triângulo azul)
- Tab "Audio" ativo (azul)
- Áudios visíveis: Chuvas De Graça, Saudosa Lembrança, Plena Paz, etc.

### 4. Tela de Configurações - Tema Escuro
**Arquivo sugerido**: `screenshots/android/settings/settings-dark-1080x1920.png`

**Características identificadas**:
- Título "Configurações" no header
- Seção "Aparência" com toggle "Tema Escuro" ativo
- Seção "Notificações" com toggle desativado
- Seção "Sobre o App" com links para avaliar, compartilhar, termos, etc.
- Tab "Configurações" ativo (azul)

### 5. Tela de Detalhes do Hino - Tema Escuro
**Arquivo sugerido**: `screenshots/android/hymn-details/hymn-details-dark-1080x1920.png`

**Características identificadas**:
- Header com "1 - Chuvas De Graça" e "CPAD / J.R."
- Letra completa do hino com versos numerados
- Coro destacado em caixa azul
- Controles de fonte (A- e A+)
- Botão "Coro" destacado
- Botão "Leitura"
- Tab "Inicio" ativo (azul)

### 6. Tela de Detalhes do Áudio - Tema Escuro
**Arquivo sugerido**: `screenshots/android/audio-details/audio-details-dark-1080x1920.png`

**Características identificadas**:
- Header com "1 - Chuvas De Graça" e "CPAD / J.R."
- Player com ícone de música grande
- Botão "Reproduzir" azul
- Progress bar com tempo 0:00 / 2:32
- Botões "Compartilhar" e "Baixar"
- Seção "Informações do Áudio" com formato e duração
- Tab "Audio" ativo (azul)

## 🎨 Versões em Tema Claro

Para cada screenshot acima, você também deve criar versões em tema claro:

- `screenshots/android/home/home-light-1080x1920.png`
- `screenshots/android/favorites/favorites-light-1080x1920.png`
- `screenshots/android/audio/audio-light-1080x1920.png`
- `screenshots/android/settings/settings-light-1080x1920.png`
- `screenshots/android/hymn-details/hymn-details-light-1080x1920.png`
- `screenshots/android/audio-details/audio-details-light-1080x1920.png`

## 📱 Versões iOS

Quando disponíveis, criar a mesma estrutura para iOS:

- `screenshots/ios/home/home-dark-1170x2532.png`
- `screenshots/ios/favorites/favorites-dark-1170x2532.png`
- etc.

## 🔧 Como Usar o Script

1. Coloque suas screenshots em uma pasta temporária
2. Execute o script:
   ```bash
   ./scripts/organize-screenshots.sh /caminho/para/suas/screenshots
   ```

## 📋 Checklist de Organização

- [ ] Screenshots renomeadas seguindo o padrão
- [ ] Organizadas nas pastas corretas por tela
- [ ] Separadas por plataforma (Android/iOS)
- [ ] Versões em tema claro e escuro
- [ ] Resoluções corretas documentadas
- [ ] README.md atualizado 