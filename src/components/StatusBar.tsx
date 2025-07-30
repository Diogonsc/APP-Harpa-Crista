import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';

interface StatusBarProps {
  backgroundColor?: string;
}

export function StatusBar({ backgroundColor }: StatusBarProps) {
  const { isDarkMode, colors } = useTheme();
  
  return (
    <ExpoStatusBar 
      style={isDarkMode ? "light" : "dark"} 
      backgroundColor={backgroundColor || colors.background}
      translucent={true}
    />
  );
} 