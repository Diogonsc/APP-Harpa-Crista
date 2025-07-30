
import React from 'react';
import { View } from 'react-native';
import "./global.css"
import { TabBar } from './src/components/TabBar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { FavoritosProvider } from './src/contexts/FavoritosContext';
import { AudioProvider } from './src/contexts/AudioContext';
import { StatusBar } from './src/components/StatusBar';
import FloatingPlayer from './src/components/FloatingPlayer';
import MediaNotification from './src/components/MediaNotification';
import { useBackgroundAudio } from './src/hooks/useBackgroundAudio';

function AppContent() {
  useBackgroundAudio();
  
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar />
        <NavigationContainer>
          <TabBar />
        </NavigationContainer>
        <FloatingPlayer />
        <MediaNotification />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritosProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </FavoritosProvider>
    </ThemeProvider>
  );
}

