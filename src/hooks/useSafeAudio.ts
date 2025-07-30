import { useCallback } from 'react';
import { Audio } from 'expo-av';

interface UseSafeAudioProps {
  sound: Audio.Sound | null;
  isLoaded: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export function useSafeAudio({ sound, isLoaded, isPlaying, setIsPlaying }: UseSafeAudioProps) {
  
  const safePause = useCallback(async () => {
    try {
      if (!sound || !isLoaded) {
        console.log('Áudio não está carregado, não é possível pausar');
        return false;
      }

      // Verificar se o áudio ainda está carregado
      if (sound._loaded) {
        await sound.pauseAsync();
        setIsPlaying(false);
        console.log('Áudio pausado com sucesso');
        return true;
      } else {
        console.log('Áudio não está mais carregado');
        setIsPlaying(false);
        return false;
      }
    } catch (error) {
      console.warn('Erro ao pausar áudio (ignorado):', error);
      setIsPlaying(false);
      return false;
    }
  }, [sound, isLoaded, setIsPlaying]);

  const safePlay = useCallback(async () => {
    try {
      if (!sound || !isLoaded) {
        console.log('Áudio não está carregado, não é possível reproduzir');
        return false;
      }

      // Verificar se o áudio ainda está carregado
      if (sound._loaded) {
        await sound.playAsync();
        setIsPlaying(true);
        console.log('Áudio reproduzido com sucesso');
        return true;
      } else {
        console.log('Áudio não está mais carregado');
        return false;
      }
    } catch (error) {
      console.warn('Erro ao reproduzir áudio (ignorado):', error);
      return false;
    }
  }, [sound, isLoaded, setIsPlaying]);

  const safeStop = useCallback(async () => {
    try {
      if (!sound || !isLoaded) {
        console.log('Áudio não está carregado, não é possível parar');
        return false;
      }

      // Verificar se o áudio ainda está carregado
      if (sound._loaded) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        console.log('Áudio parado com sucesso');
        return true;
      } else {
        console.log('Áudio não está mais carregado');
        setIsPlaying(false);
        return false;
      }
    } catch (error) {
      console.warn('Erro ao parar áudio (ignorado):', error);
      setIsPlaying(false);
      return false;
    }
  }, [sound, isLoaded, setIsPlaying]);

  const safeSeek = useCallback(async (position: number) => {
    try {
      if (!sound || !isLoaded) {
        console.log('Áudio não está carregado, não é possível buscar posição');
        return false;
      }

      // Verificar se o áudio ainda está carregado
      if (sound._loaded) {
        await sound.setPositionAsync(position);
        console.log('Posição alterada com sucesso');
        return true;
      } else {
        console.log('Áudio não está mais carregado');
        return false;
      }
    } catch (error) {
      console.warn('Erro ao buscar posição (ignorado):', error);
      return false;
    }
  }, [sound, isLoaded]);

  const safeUnload = useCallback(async () => {
    try {
      if (sound) {
        if (sound._loaded) {
          await sound.unloadAsync();
        }
        console.log('Áudio descarregado com sucesso');
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Erro ao descarregar áudio (ignorado):', error);
      return false;
    }
  }, [sound]);

  return {
    safePause,
    safePlay,
    safeStop,
    safeSeek,
    safeUnload,
  };
} 