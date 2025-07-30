// Utilitários para cores do tema usando Tailwind CSS
export const themeColors = {
  light: {
    background: 'bg-gray-50',
    surface: 'bg-white',
    primary: 'bg-blue-500',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textTertiary: 'text-gray-500',
    border: 'border-gray-200',
    separator: 'border-gray-200',
    icon: 'text-gray-500',
    searchBackground: 'bg-white',
    cardBackground: 'bg-white',
    headerBackground: 'bg-white',
  },
  dark: {
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    primary: 'bg-blue-500',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    border: 'border-gray-700',
    separator: 'border-gray-700',
    icon: 'text-gray-400',
    searchBackground: 'bg-gray-800',
    cardBackground: 'bg-gray-800',
    headerBackground: 'bg-gray-800',
  },
};

// Hook para obter classes baseado no tema
export const useThemeClasses = (isDarkMode: boolean) => {
  return isDarkMode ? themeColors.dark : themeColors.light;
};

// Função para obter classe específica baseada no tema
export const getThemeClass = (
  isDarkMode: boolean,
  colorKey: keyof typeof themeColors.light
) => {
  return isDarkMode ? themeColors.dark[colorKey] : themeColors.light[colorKey];
};

// Classes do Tailwind para uso direto
export const tailwindClasses = {
  light: {
    background: 'bg-gray-50',
    surface: 'bg-white',
    primary: 'bg-blue-500',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textTertiary: 'text-gray-500',
    border: 'border-gray-200',
    separator: 'border-gray-200',
    icon: 'text-gray-500',
    searchBackground: 'bg-white',
    cardBackground: 'bg-white',
    headerBackground: 'bg-white',
  },
  dark: {
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    primary: 'bg-blue-500',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    border: 'border-gray-700',
    separator: 'border-gray-700',
    icon: 'text-gray-400',
    searchBackground: 'bg-gray-800',
    cardBackground: 'bg-gray-800',
    headerBackground: 'bg-gray-800',
  },
};

// Função para obter classes do Tailwind baseadas no tema
export const getTailwindClasses = (isDarkMode: boolean) => {
  return isDarkMode ? tailwindClasses.dark : tailwindClasses.light;
}; 