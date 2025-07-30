import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para armazenar a preferência do tema
const THEME_STORAGE_KEY = '@harpa_crista_theme_preference';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    separator: string;
    icon: string;
    searchBackground: string;
    cardBackground: string;
    headerBackground: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar preferência salva do AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          const themeData = JSON.parse(savedTheme);
          setIsDarkMode(themeData.isDarkMode);
          setIsManualOverride(themeData.isManualOverride);
        }
      } catch (error) {
        console.error('Erro ao carregar preferência do tema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Salvar preferência no AsyncStorage
  const saveThemePreference = async (isDark: boolean, isManual: boolean) => {
    try {
      const themeData = {
        isDarkMode: isDark,
        isManualOverride: isManual,
      };
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeData));
    } catch (error) {
      console.error('Erro ao salvar preferência do tema:', error);
    }
  };

  // Sincronizar com o tema do sistema quando não há override manual
  useEffect(() => {
    if (!isManualOverride && !isLoading) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isManualOverride, isLoading]);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsManualOverride(true);
    setIsDarkMode(newDarkMode);
    saveThemePreference(newDarkMode, true);
  };

  const setTheme = (isDark: boolean) => {
    setIsManualOverride(true);
    setIsDarkMode(isDark);
    saveThemePreference(isDark, true);
  };

  // Cores baseadas na paleta elegante dos modais
  const colors = {
    // Fundo principal (gray-900 / gray-50)
    background: isDarkMode ? '#111827' : '#f9fafb',
    
    // Superfície/cards (gray-800 / white)
    surface: isDarkMode ? '#1f2937' : '#ffffff',
    
    // Cor primária (azul)
    primary: isDarkMode ? '#0A84FF' : '#007AFF',
    
    // Texto principal (white / gray-900)
    text: isDarkMode ? '#ffffff' : '#111827',
    
    // Texto secundário (gray-300 / gray-700)
    textSecondary: isDarkMode ? '#d1d5db' : '#374151',
    
    // Texto terciário (gray-400 / gray-500)
    textTertiary: isDarkMode ? '#9ca3af' : '#6b7280',
    
    // Bordas (gray-700 / gray-200)
    border: isDarkMode ? '#374151' : '#e5e7eb',
    
    // Separadores (gray-700 / gray-200)
    separator: isDarkMode ? '#374151' : '#e5e7eb',
    
    // Ícones (gray-400 / gray-500)
    icon: isDarkMode ? '#9ca3af' : '#6b7280',
    
    // Fundo de busca (gray-800 / white)
    searchBackground: isDarkMode ? '#1f2937' : '#ffffff',
    
    // Fundo de cards (gray-800 / white)
    cardBackground: isDarkMode ? '#1f2937' : '#ffffff',
    
    // Fundo de header (gray-800 / white)
    headerBackground: isDarkMode ? '#1f2937' : '#ffffff',
  };

  // Não renderizar até carregar a preferência salva
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 