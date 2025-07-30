# Guia de Uso do Tema - Harpa Cristã

Este documento explica como usar o sistema de tema configurado no Tailwind CSS para o aplicativo Harpa Cristã.

## Configuração do Tema

O tema está configurado no arquivo `tailwind.config.js` com cores personalizadas para modo claro e escuro, baseadas na paleta elegante dos modais.

### Cores Disponíveis

#### Modo Claro (Light)
- `bg-gray-50` - Fundo principal (#f9fafb)
- `bg-white` - Superfície de cards (#ffffff)
- `bg-blue-500` - Cor primária (#007AFF)
- `text-gray-900` - Texto principal (#111827)
- `text-gray-700` - Texto secundário (#374151)
- `text-gray-500` - Texto terciário (#6b7280)
- `border-gray-200` - Bordas (#e5e7eb)
- `text-gray-500` - Ícones (#6b7280)
- `bg-white` - Fundo de busca (#ffffff)
- `bg-white` - Fundo de cards (#ffffff)
- `bg-white` - Fundo de header (#ffffff)

#### Modo Escuro (Dark)
- `bg-gray-900` - Fundo principal (#111827)
- `bg-gray-800` - Superfície de cards (#1f2937)
- `bg-blue-500` - Cor primária (#0A84FF)
- `text-white` - Texto principal (#ffffff)
- `text-gray-300` - Texto secundário (#d1d5db)
- `text-gray-400` - Texto terciário (#9ca3af)
- `border-gray-700` - Bordas (#374151)
- `text-gray-400` - Ícones (#9ca3af)
- `bg-gray-800` - Fundo de busca (#1f2937)
- `bg-gray-800` - Fundo de cards (#1f2937)
- `bg-gray-800` - Fundo de header (#1f2937)

## Como Usar

### 1. Importar as funções de tema

```typescript
import { useTheme } from "../contexts/ThemeContext";
import { getThemeClass } from "../utils/colors";
```

### 2. Detectar o modo escuro

```typescript
const { isDarkMode, colors } = useTheme();
```

### 3. Aplicar classes do tema

```typescript
// Exemplo de uso em um componente
<View className={`flex-1 ${getThemeClass(isDarkMode, 'background')} p-4`}>
  <Text className={`text-2xl font-bold ${getThemeClass(isDarkMode, 'text')}`}>
    Título
  </Text>
  <Text className={`text-base ${getThemeClass(isDarkMode, 'textSecondary')}`}>
    Texto secundário
  </Text>
</View>
```

## Exemplos Práticos

### Botão com tema
```typescript
<TouchableOpacity className={`p-3 rounded-lg ${getThemeClass(isDarkMode, 'primary')}`}>
  <Text className="text-white font-semibold">Botão</Text>
</TouchableOpacity>
```

### Card com tema
```typescript
<View className={`p-4 rounded-lg border ${getThemeClass(isDarkMode, 'surface')} ${getThemeClass(isDarkMode, 'border')}`}>
  <Text className={`text-lg font-bold ${getThemeClass(isDarkMode, 'text')}`}>
    Título do Card
  </Text>
  <Text className={`text-sm ${getThemeClass(isDarkMode, 'textSecondary')}`}>
    Descrição do card
  </Text>
</View>
```

### Badge com tema
```typescript
<View className={`px-3 py-1 rounded-full ${getThemeClass(isDarkMode, 'primary')}`}>
  <Text className="text-white text-xs font-medium">Badge</Text>
</View>
```

## Componente Button

O componente `Button` já está configurado para usar o tema automaticamente:

```typescript
import { Button } from "../components/Button";

<Button 
  title="Botão Primário" 
  variant="primary" 
  isDarkMode={isDarkMode}
/>

<Button 
  title="Botão Secundário" 
  variant="secondary" 
  isDarkMode={isDarkMode}
/>

<Button 
  title="Botão Outline" 
  variant="outline" 
  isDarkMode={isDarkMode}
/>
```

## Funções Utilitárias

### getThemeClass(isDarkMode, colorKey)
Retorna a classe do Tailwind baseada no modo escuro e na chave da cor.

```typescript
getThemeClass(true, 'primary') // Retorna 'bg-blue-500'
getThemeClass(false, 'text') // Retorna 'text-gray-900'
```

### useThemeClasses(isDarkMode)
Retorna todas as classes do tema para o modo especificado.

```typescript
const themeClasses = useThemeClasses(isDarkMode);
// Retorna objeto com todas as classes do tema
```

## Contexto de Tema

O contexto de tema fornece acesso direto às cores:

```typescript
const { isDarkMode, colors } = useTheme();

// Usar cores diretamente
<Text style={{ color: colors.text }}>Texto</Text>
<View style={{ backgroundColor: colors.surface }}>Card</View>
```

## Boas Práticas

1. **Sempre use as funções de tema** em vez de cores hardcoded
2. **Use o contexto de tema** para acesso direto às cores
3. **Combine classes do Tailwind** com as classes do tema
4. **Teste em ambos os modos** (claro e escuro)
5. **Use variáveis consistentes** para manter a coesão visual
6. **Prefira o contexto de tema** para cores dinâmicas

## Estrutura de Arquivos

- `tailwind.config.js` - Configuração do tema
- `src/utils/colors.ts` - Funções utilitárias do tema
- `src/contexts/ThemeContext.tsx` - Contexto de tema
- `global.css` - Importações do Tailwind
- `src/components/Button.tsx` - Exemplo de componente com tema 