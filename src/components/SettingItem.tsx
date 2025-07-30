import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getThemeClass } from '../utils/colors';
import { useTheme } from '../contexts/ThemeContext';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  type: 'toggle' | 'link' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export function SettingItem({ 
  title, 
  subtitle, 
  type, 
  value, 
  onPress, 
  onToggle 
}: SettingItemProps) {
  const { isDarkMode, colors } = useTheme();

  return (
    <TouchableOpacity 
      className={`flex-row items-center justify-between py-4 ${type === 'link' ? 'active:opacity-70' : ''}`}
      onPress={type === 'link' ? onPress : undefined}
      disabled={type === 'toggle' || type === 'info'}
    >
      <View className="flex-1">
        <Text className={`text-base font-medium ${getThemeClass(isDarkMode, 'text')}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm mt-1 ${getThemeClass(isDarkMode, 'textSecondary')}`}>
            {subtitle}
          </Text>
        )}
      </View>

      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ 
            false: colors.border, 
            true: colors.primary
          }}
          thumbColor={value ? '#ffffff' : (isDarkMode ? colors.textSecondary : '#ffffff')}
        />
      )}

      {type === 'link' && (
        <Feather 
          name="chevron-right" 
          size={20} 
          color={colors.icon}
        />
      )}

      {type === 'info' && (
        <Feather 
          name="check-circle" 
          size={20} 
          color={colors.primary}
        />
      )}
    </TouchableOpacity>
  );
} 