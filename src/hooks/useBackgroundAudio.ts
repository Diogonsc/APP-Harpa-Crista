import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAudio } from '../contexts/AudioContext';

export const useBackgroundAudio = () => {
  const { currentAudio, isPlaying, pauseAudio, resumeAudio } = useAudio();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App voltou para o primeiro plano
        console.log('App voltou para o primeiro plano');
      } else if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App foi para segundo plano
        console.log('App foi para segundo plano');
        
        // Se há áudio tocando, manter a reprodução
        if (currentAudio && isPlaying) {
          console.log('Mantendo reprodução em segundo plano');
        }
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [currentAudio, isPlaying]);

  return {
    isInBackground: appState.current !== 'active',
  };
}; 