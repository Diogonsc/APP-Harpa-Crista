import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getThemeClass } from '../utils/colors';

interface ColorExampleProps {
  isDarkMode?: boolean;
}

export const ColorExample: React.FC<ColorExampleProps> = ({ isDarkMode = false }) => {
  return (
    <View className={`flex-1 p-4 ${getThemeClass(isDarkMode, 'background')}`}>
      {/* Exemplo usando classes do Tailwind */}
      <View className={`p-4 rounded-lg border mb-4 ${getThemeClass(isDarkMode, 'surface')} ${getThemeClass(isDarkMode, 'border')}`}>
        <Text className={`text-lg font-bold mb-2 ${getThemeClass(isDarkMode, 'text')}`}>
          Título Principal
        </Text>
        
        <Text className={`text-sm mb-4 ${getThemeClass(isDarkMode, 'textSecondary')}`}>
          Subtítulo secundário
        </Text>
        
        <TouchableOpacity className={`p-3 rounded-md ${getThemeClass(isDarkMode, 'primary')} items-center`}>
          <Text className="text-white font-semibold">Botão Primário</Text>
        </TouchableOpacity>
      </View>

      {/* Exemplo usando classes do Tailwind */}
      <View className={`p-4 rounded-lg border ${getThemeClass(isDarkMode, 'surface')} ${getThemeClass(isDarkMode, 'border')}`}>
        <Text className={`text-lg font-bold ${getThemeClass(isDarkMode, 'text')}`}>
          Usando Tailwind Classes
        </Text>
        
        <Text className={`text-sm ${getThemeClass(isDarkMode, 'textSecondary')}`}>
          Este texto usa as classes do Tailwind configuradas
        </Text>
      </View>
    </View>
  );
}; 