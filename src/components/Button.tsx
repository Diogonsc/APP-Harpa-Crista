import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { getThemeClass } from '../utils/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isDarkMode?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  isDarkMode = false,
  style,
  ...props
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'px-6 py-3 rounded-lg border min-h-[44px] items-center justify-center';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} ${getThemeClass(isDarkMode, 'primary')} border-primary`;
      case 'secondary':
        return `${baseClasses} ${getThemeClass(isDarkMode, 'surface')} ${getThemeClass(isDarkMode, 'border')}`;
      case 'outline':
        return `${baseClasses} bg-transparent border-primary`;
      default:
        return `${baseClasses} ${getThemeClass(isDarkMode, 'primary')} border-primary`;
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'primary':
        return 'text-white text-base font-semibold';
      case 'secondary':
        return `${getThemeClass(isDarkMode, 'text')} text-base font-semibold`;
      case 'outline':
        return `${getThemeClass(isDarkMode, 'primary')} text-base font-semibold`;
      default:
        return 'text-white text-base font-semibold';
    }
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      style={style}
      {...props}
    >
      <Text className={getTextClasses()}>{title}</Text>
    </TouchableOpacity>
  );
}; 