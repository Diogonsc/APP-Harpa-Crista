import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getThemeClass } from '../utils/colors';
import { useTheme } from '../contexts/ThemeContext';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
}

export function SearchBar({ placeholder, value, onChangeText, onSearch }: SearchBarProps) {
  const { isDarkMode, colors } = useTheme();

  return (
    <View className={`flex-row items-center px-4 py-3 rounded-lg border ${getThemeClass(isDarkMode, 'searchBackground')} ${getThemeClass(isDarkMode, 'border')} mb-4`}>
      <Feather 
        name="search" 
        size={20} 
        color={colors.icon}
        style={{ marginRight: 12 }}
      />
      <TextInput
        className={`flex-1 text-base ${getThemeClass(isDarkMode, 'text')}`}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
        style={{ fontSize: 16 }}
      />
      {onSearch && (
        <TouchableOpacity onPress={onSearch}>
          <Feather 
            name="search" 
            size={20} 
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
} 