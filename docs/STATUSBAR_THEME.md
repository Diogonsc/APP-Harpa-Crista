# StatusBar Adaptativa ao Tema

## Visão Geral

A StatusBar foi implementada para se adaptar automaticamente aos temas dark e light, proporcionando melhor legibilidade e consistência visual.

## Implementação

### Componente AdaptiveStatusBar

```typescript
function AdaptiveStatusBar() {
  const { isDarkMode } = useTheme();
  
  return (
    <StatusBar 
      style={isDarkMode ? "light" : "dark"} 
      translucent 
      backgroundColor="transparent"
    />
  );
}
```

### Configurações

- **Tema Escuro**: `style="light"` - Ícones e texto brancos
- **Tema Claro**: `style="dark"` - Ícones e texto pretos
- **Translucent**: `true` - Permite que o conteúdo apareça sob a StatusBar
- **Background**: `transparent` - Fundo transparente

## Comportamento por Tema

### Tema Escuro (Dark Mode)
- **StatusBar Style**: `light`
- **Ícones**: Brancos
- **Texto**: Branco
- **Background**: Transparente
- **Resultado**: StatusBar clara sobre fundo escuro

### Tema Claro (Light Mode)
- **StatusBar Style**: `dark`
- **Ícones**: Pretos
- **Texto**: Preto
- **Background**: Transparente
- **Resultado**: StatusBar escura sobre fundo claro

## Benefícios

### 1. Legibilidade
- Contraste adequado em ambos os temas
- Ícones sempre visíveis
- Texto legível independente do tema

### 2. Consistência Visual
- StatusBar se adapta automaticamente
- Transição suave entre temas
- Integração perfeita com o design

### 3. Experiência do Usuário
- Feedback visual claro do tema atual
- StatusBar não interfere no conteúdo
- Comportamento nativo do sistema

## Integração

### Localização
- Componente definido em `App.tsx`
- Dentro do `ThemeProvider` para acesso ao contexto
- Renderizado antes do `NavigationContainer`

### Dependências
- `expo-status-bar` para StatusBar
- `useTheme()` do ThemeContext
- React Navigation para integração

## Compatibilidade

- ✅ **iOS**: Funciona perfeitamente
- ✅ **Android**: Funciona perfeitamente
- ✅ **Tema Claro**: StatusBar escura
- ✅ **Tema Escuro**: StatusBar clara
- ✅ **Transições**: Adaptação automática

## Detalhes Técnicos

### Props Utilizadas
```typescript
<StatusBar 
  style={isDarkMode ? "light" : "dark"}  // Cor dos ícones/texto
  translucent={true}                      // Permite conteúdo sob a barra
  backgroundColor="transparent"           // Fundo transparente
/>
```

### Estados Possíveis
- `style="light"`: Para fundos escuros
- `style="dark"`: Para fundos claros
- `style="auto"`: Detecção automática (não usado)

### Reatividade
- Muda automaticamente quando o tema é alterado
- Não requer reload do app
- Transição instantânea 