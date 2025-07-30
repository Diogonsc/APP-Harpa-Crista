import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getThemeClass } from '../utils/colors';
import { useTheme } from '../contexts/ThemeContext';

interface HymnItemProps {
  title: string;
  number: number;
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
  showPlayButton?: boolean;
  onPlayPress?: () => void;
}

export function HymnItem({ 
  title, 
  number, 
  isFavorite = false, 
  onPress, 
  onFavoritePress,
  showPlayButton = false,
  onPlayPress 
}: HymnItemProps) {
  const { isDarkMode, colors } = useTheme();

  return (
    <View 
      className={`flex-row items-center p-4 rounded-lg ${getThemeClass(isDarkMode, 'surface')} mb-3`}
    >
      {/* Ícone musical ou botão de play */}
      <View className={`w-12 h-12 rounded-full items-center justify-center ${getThemeClass(isDarkMode, 'searchBackground')} mr-4`}>
        {showPlayButton ? (
          <TouchableOpacity onPress={() => {
            onPlayPress?.();
          }}>
            <Feather 
              name="music" 
              size={20} 
              color={colors.text}
            />
          </TouchableOpacity>
        ) : (
          <Text className="text-white text-xl">♪</Text>
        )}
      </View>

      {/* Conteúdo do hino */}
      <TouchableOpacity 
        className="flex-1" 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text className={`text-base font-bold ${getThemeClass(isDarkMode, 'text')}`}>
          {title}
        </Text>
        <Text className={`text-sm ${getThemeClass(isDarkMode, 'textSecondary')}`}>
          Hino {number}
        </Text>
      </TouchableOpacity>

      {/* Botões de ação */}
      <View className="flex-row items-center space-x-2">        
        {/* Botão de play adicional (para tela de áudio) */}
        {showPlayButton && onPlayPress && (
          <TouchableOpacity onPress={() => {
            onPlayPress();
          }} className="p-2">
            <Feather 
              name="play" 
              size={20} 
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 