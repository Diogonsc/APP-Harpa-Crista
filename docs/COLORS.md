# Guia de Cores - Harpa Cristã

Este documento explica como usar corretamente a paleta de cores configurada no projeto.

## Configuração do Tailwind

As cores estão configuradas no arquivo `tailwind.config.js` e podem ser usadas de duas formas:

### 1. Classes do Tailwind

```tsx
// Exemplo de uso com classes do Tailwind
<View className="bg-light-background dark:bg-dark-background">
  <Text className="text-light-text dark:text-dark-text">
    Texto que se adapta ao tema
  </Text>
</View>
```

### 2. Utilitários JavaScript

```tsx
import { getThemeColor, getTailwindClasses } from '../utils/colors';

// Usando função utilitária
const backgroundColor = getThemeColor(isDarkMode, 'background');

// Usando classes do Tailwind
const colors = getTailwindClasses(isDarkMode);
<View className={colors.surface}>
```

## Paleta de Cores

### Tema Claro
- **Background**: `#f5f5f5` - Fundo principal
- **Surface**: `#ffffff` - Superfícies de componentes
- **Primary**: `#007AFF` - Cor primária (botões, links)
- **Text**: `#333333` - Texto principal
- **TextSecondary**: `#666666` - Texto secundário
- **Border**: `#e0e0e0` - Bordas e separadores
- **Icon**: `#666666` - Ícones
- **SearchBackground**: `#f8f8f8` - Fundo de campos de busca

### Tema Escuro
- **Background**: `#121212` - Fundo principal
- **Surface**: `#1e1e1e` - Superfícies de componentes
- **Primary**: `#0A84FF` - Cor primária (botões, links)
- **Text**: `#ffffff` - Texto principal
- **TextSecondary**: `#b0b0b0` - Texto secundário
- **Border**: `#2c2c2c` - Bordas e separadores
- **Icon**: `#b0b0b0` - Ícones
- **SearchBackground**: `#2c2c2c` - Fundo de campos de busca

## Exemplos de Uso

### Componente com StyleSheet

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getThemeColor } from '../utils/colors';

interface MyComponentProps {
  isDarkMode: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ isDarkMode }) => {
  return (
    <View style={[
      styles.container,
      { backgroundColor: getThemeColor(isDarkMode, 'background') }
    ]}>
      <Text style={[
        styles.title,
        { color: getThemeColor(isDarkMode, 'text') }
      ]}>
        Título
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

### Componente com Tailwind

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { getTailwindClasses } from '../utils/colors';

interface MyComponentProps {
  isDarkMode: boolean;
}

export const MyComponent: React.FC<MyComponentProps> = ({ isDarkMode }) => {
  const colors = getTailwindClasses(isDarkMode);
  
  return (
    <View className={`p-4 rounded-lg ${colors.surface} ${colors.border}`}>
      <Text className={`text-lg font-bold ${colors.text}`}>
        Título
      </Text>
      <Text className={`text-sm ${colors.textSecondary}`}>
        Descrição
      </Text>
    </View>
  );
};
```

## Boas Práticas

1. **Sempre use as cores do tema**: Nunca use cores hardcoded
2. **Considere o modo escuro**: Sempre teste em ambos os temas
3. **Use os utilitários**: Utilize as funções `getThemeColor` e `getTailwindClasses`
4. **Mantenha consistência**: Use as mesmas cores para elementos similares
5. **Teste a acessibilidade**: Verifique o contraste das cores

## Detecção de Tema

Para detectar automaticamente o tema do sistema:

```tsx
import { useColorScheme } from 'react-native';

export const MyComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  // Use isDarkMode com as funções de cores
};
```

## Adicionando Novas Cores

Para adicionar novas cores ao tema:

1. Adicione a cor no `tailwind.config.js`
2. Atualize o arquivo `src/utils/colors.ts`
3. Documente o uso da nova cor
4. Teste em ambos os temas 