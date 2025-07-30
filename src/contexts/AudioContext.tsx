import React, { createContext, useContext, useState, useEffect } from 'react';
import AudioServiceEnhanced from '../services/audioServiceEnhanced';
import { Audio as AudioType } from '../types/api';

interface AudioContextType {
  currentAudio: AudioType | null;
  isPlaying: boolean;
  isLoading: boolean;
  isDownloading: boolean;
  duration: number;
  position: number;
  playAudio: (audio: AudioType) => Promise<void>;
  pauseAudio: () => Promise<void>;
  resumeAudio: () => Promise<void>;
  stopAudio: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  closeAudio: () => void;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<AudioType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);

  useEffect(() => {
    // Configurar o áudio de forma assíncrona
    const setupAudio = async () => {
      try {
        // Aguardar um pouco para garantir que o app está pronto
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await AudioServiceEnhanced.setupAudio();
        setIsAudioReady(true);
        console.log('AudioServiceEnhanced configurado com sucesso');
      } catch (error) {
        console.error('Erro ao configurar AudioServiceEnhanced:', error);
        setIsAudioReady(false);
      }
    };

    setupAudio();
  }, []);

  // Atualizar posição periodicamente
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && currentAudio && isAudioReady) {
      interval = setInterval(async () => {
        try {
          const currentPosition = await AudioServiceEnhanced.getPosition();
          const currentDuration = await AudioServiceEnhanced.getDuration();
          setPosition(currentPosition);
          setDuration(currentDuration);
        } catch (error) {
          console.error('Erro ao atualizar posição:', error);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, currentAudio, isAudioReady]);

  // Monitorar mudanças de estado do áudio
  useEffect(() => {
    if (!isAudioReady) return;

    const checkAudioState = async () => {
      try {
        const state = await AudioServiceEnhanced.getState();
        const isCurrentlyPlaying = state === 'playing';
        
        if (isCurrentlyPlaying !== isPlaying) {
          setIsPlaying(isCurrentlyPlaying);
        }
      } catch (error) {
        console.error('Erro ao verificar estado do áudio:', error);
      }
    };

    const stateInterval = setInterval(checkAudioState, 1000);
    return () => clearInterval(stateInterval);
  }, [isPlaying, isAudioReady]);

  const playAudio = async (audio: AudioType) => {
    try {
      setIsLoading(true);
      setCurrentAudio(audio);
      
      await AudioServiceEnhanced.loadAudio(audio);
      await AudioServiceEnhanced.play();
      
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao reproduzir áudio:', error);
      setCurrentAudio(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const pauseAudio = async () => {
    try {
      await AudioServiceEnhanced.safePause();
      setIsPlaying(false);
    } catch (error) {
      console.warn('Erro ao pausar áudio (ignorado):', error);
    }
  };

  const resumeAudio = async () => {
    try {
      await AudioServiceEnhanced.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao resumir áudio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      await AudioServiceEnhanced.safeStop();
      await AudioServiceEnhanced.unload();
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setCurrentAudio(null);
    } catch (error) {
      console.warn('Erro ao parar áudio (ignorado):', error);
    }
  };

  const seekTo = async (newPosition: number) => {
    try {
      await AudioServiceEnhanced.seekTo(newPosition);
      setPosition(newPosition);
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
    }
  };

  const closeAudio = () => {
    stopAudio();
  };

  const nextTrack = async () => {
    // Implementar lógica para próxima música
    console.log('Próxima música');
  };

  const previousTrack = async () => {
    // Implementar lógica para música anterior
    console.log('Música anterior');
  };

  return (
    <AudioContext.Provider
      value={{
        currentAudio,
        isPlaying,
        isLoading,
        isDownloading,
        duration,
        position,
        playAudio,
        pauseAudio,
        resumeAudio,
        stopAudio,
        seekTo,
        closeAudio,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 