# 📱 Guia de Criação de Screenshots - Harpa Cristã

## 🎨 Baseado no Design dos Ícones

### **Paleta de Cores Identificada:**
- **Fundo**: Branco (#ffffff)
- **Elementos principais**: Provavelmente tons de azul/marrom (baseado no nome "Harpa Cristã")
- **Estilo**: Limpo, minimalista, focado na usabilidade

## 📱 Screenshots Necessários

### **1. Tela Principal (Home)**
**Resolução**: 1170 x 2532 px (iPhone 14)

**Elementos a incluir:**
- Header com título "Harpa Cristã"
- Lista de hinos populares
- Barra de pesquisa
- Navegação inferior
- Tema claro/escuro visível

**Texto sugerido:**
- "Encontre seus hinos favoritos"
- "Busque por número ou título"

### **2. Tela de Detalhes do Hino**
**Resolução**: 1170 x 2532 px (iPhone 14)

**Elementos a incluir:**
- Número e título do hino
- Letra completa visível
- Botões de controle de áudio
- Botão de favorito
- Opção de download

**Texto sugerido:**
- "Hino 001 - Louvai ao Senhor"
- "Reproduzir áudio"

### **3. Tela de Favoritos**
**Resolução**: 1170 x 2532 px (iPhone 14)

**Elementos a incluir:**
- Lista de hinos favoritados
- Ícone de coração preenchido
- Contador de favoritos
- Opção de organizar

**Texto sugerido:**
- "Seus hinos favoritos"
- "Organize sua coleção"

### **4. Tela de Configurações**
**Resolução**: 1170 x 2532 px (iPhone 14)

**Elementos a incluir:**
- Toggle de tema escuro/claro
- Informações sobre o app
- Links para política de privacidade
- Versão do app

**Texto sugerido:**
- "Configurações"
- "Tema Escuro"

### **5. Tela de Áudio/Player**
**Resolução**: 1170 x 2532 px (iPhone 14)

**Elementos a incluir:**
- Player de áudio em reprodução
- Controles de play/pause
- Barra de progresso
- Tempo atual/total
- Botão de download

**Texto sugerido:**
- "Reproduzindo: Hino 001"
- "02:34 / 04:12"

## 🖼️ Screenshots para iPad

### **iPad (1640 x 2360 px)**

**Versões das mesmas telas, mas adaptadas para:**
- Layout em duas colunas
- Elementos maiores
- Melhor aproveitamento do espaço
- Navegação lateral

## 📱 Screenshots para Android

### **Phone (1080 x 1920 px)**
- Mesmas telas do iPhone, mas adaptadas para:
- Material Design
- Botões com elevação
- Cores do tema Android

### **Tablet (1200 x 1920 px)**
- Layout adaptado para tela maior
- Navegação em abas
- Conteúdo em grid

## 🎯 Estratégia de Criação

### **Opção 1: Captura Real (Recomendada)**
```bash
# Para iOS
# 1. Abra o simulador do iPhone 14
xcrun simctl boot "iPhone 14"

# 2. Execute o app
npm run ios

# 3. Navegue pelas telas e capture screenshots
# 4. Use Cmd+S no simulador para capturar

# Para Android
# 1. Abra o emulador
npm run android

# 2. Capture screenshots usando:
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ~/Desktop/
```

### **Opção 2: Mockups (Alternativa)**
Se não conseguir capturar screenshots reais, crie mockups usando:

**Ferramentas recomendadas:**
- **Figma** (gratuito)
- **Canva** (gratuito)
- **Sketch** (pago)

**Template base:**
```
┌─────────────────────────┐
│     Header (Título)     │
├─────────────────────────┤
│                         │
│      Conteúdo           │
│      Principal          │
│                         │
│                         │
├─────────────────────────┤
│   Navegação Inferior    │
└─────────────────────────┘
```

## 🎨 Elementos Visuais a Incluir

### **Cores Sugeridas (baseado no ícone):**
- **Primária**: Azul (#3B82F6) ou Marrom (#8B4513)
- **Secundária**: Cinza claro (#F3F4F6)
- **Texto**: Preto (#000000) / Branco (#FFFFFF)
- **Fundo**: Branco (#FFFFFF) / Cinza escuro (#1F2937) para tema escuro

### **Tipografia:**
- **Títulos**: Sans-serif, bold
- **Corpo**: Sans-serif, regular
- **Números**: Monospace para números de hinos

### **Ícones:**
- **Play/Pause**: Triângulo/Círculo
- **Favorito**: Coração
- **Download**: Seta para baixo
- **Busca**: Lupa
- **Configurações**: Engrenagem

## 📋 Checklist de Screenshots

### **Apple App Store (Mínimo 2):**
- [ ] Tela Principal (iPhone 14 - 1170x2532)
- [ ] Tela de Detalhes (iPhone 14 - 1170x2532)
- [ ] Tela Principal (iPad - 1640x2360)
- [ ] Tela de Detalhes (iPad - 1640x2360)

### **Google Play Store (Mínimo 2):**
- [ ] Tela Principal (Phone - 1080x1920)
- [ ] Tela de Detalhes (Phone - 1080x1920)
- [ ] Tela Principal (Tablet - 1200x1920)
- [ ] Tela de Detalhes (Tablet - 1200x1920)

## 🚀 Próximos Passos

1. **Capture screenshots reais** do app em funcionamento
2. **Edite as imagens** para as resoluções corretas
3. **Adicione texto descritivo** se necessário
4. **Teste em diferentes dispositivos** para garantir qualidade
5. **Organize por plataforma** (iOS/Android)

## 💡 Dicas Importantes

- **Mantenha consistência** entre todas as screenshots
- **Mostre as principais funcionalidades** do app
- **Use texto claro e legível**
- **Evite elementos muito pequenos**
- **Teste em dispositivos reais** quando possível

## 🎯 Resultado Esperado

Com essas screenshots, sua aplicação estará **100% pronta** para submissão nas lojas, com:
- ✅ Configurações técnicas completas
- ✅ Ícones em todas as resoluções
- ✅ Screenshots para todas as plataformas
- ✅ Políticas e termos implementados 