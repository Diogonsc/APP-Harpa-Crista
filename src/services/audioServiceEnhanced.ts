import { Audio } from 'expo-av';
import { Audio as AudioType } from '../types/api';

class AudioServiceEnhanced {
  private static instance: AudioServiceEnhanced;
  private sound: Audio.Sound | null = null;
  private currentAudio: AudioType | null = null;
  private isPlaying: boolean = false;
  private position: number = 0;
  private duration: number = 0;
  private isInitialized: boolean = false;
  private isLoading: boolean = false;
  private isLoaded: boolean = false;

  static getInstance(): AudioServiceEnhanced {
    if (!AudioServiceEnhanced.instance) {
      AudioServiceEnhanced.instance = new AudioServiceEnhanced();
    }
    return AudioServiceEnhanced.instance;
  }

  async setupAudio() {
    try {
      // Configuração básica e compatível
      const audioMode = {
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      };

      // Adicionar configurações de interrupção se disponíveis
      try {
        // Tentar usar constantes se disponíveis
        if (Audio.InterruptionModeIOS && Audio.InterruptionModeIOS.DoNotMix !== undefined) {
          audioMode.interruptionModeIOS = Audio.InterruptionModeIOS.DoNotMix;
        } else {
          audioMode.interruptionModeIOS = 1; // DoNotMix
        }

        if (Audio.InterruptionModeAndroid && Audio.InterruptionModeAndroid.DoNotMix !== undefined) {
          audioMode.interruptionModeAndroid = Audio.InterruptionModeAndroid.DoNotMix;
        } else {
          audioMode.interruptionModeAndroid = 1; // DoNotMix
        }
      } catch (interruptionError) {
        console.warn('Configurações de interrupção não disponíveis, usando padrão:', interruptionError);
        audioMode.interruptionModeIOS = 1;
        audioMode.interruptionModeAndroid = 1;
      }

      await Audio.setAudioModeAsync(audioMode);
      
      this.isInitialized = true;
      console.log('AudioServiceEnhanced configurado com sucesso');
    } catch (error) {
      console.error('Erro ao configurar AudioServiceEnhanced:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  async loadAudio(audio: AudioType) {
    try {
      this.isLoading = true;
      this.isLoaded = false;

      // Descarregar áudio anterior se existir
      if (this.sound) {
        try {
          await this.sound.unloadAsync();
        } catch (error) {
          console.warn('Erro ao descarregar áudio anterior:', error);
        }
        this.sound = null;
      }

      this.currentAudio = audio;
      
      // Configurar metadados para notificações de mídia
      const metadata = {
        title: audio.titulo,
        artist: audio.hino?.titulo || 'Harpa Cristã',
        album: 'Harpa Cristã',
        artwork: audio.hino?.imagemUrl || 'https://harpacrista.com/logo.png',
      };

      // Configurações de reprodução com fallback para compatibilidade
      const playbackConfig: any = {
        shouldPlay: false,
        progressUpdateIntervalMillis: 1000,
        positionMillis: 0,
        rate: 1.0,
        shouldCorrectPitch: true,
      };

      // Adicionar pitchCorrectionQuality se disponível
      try {
        if (Audio.PitchCorrectionQuality && Audio.PitchCorrectionQuality.High !== undefined) {
          playbackConfig.pitchCorrectionQuality = Audio.PitchCorrectionQuality.High;
        } else {
          playbackConfig.pitchCorrectionQuality = 'High';
        }
      } catch (pitchError) {
        console.warn('PitchCorrectionQuality não disponível, usando padrão:', pitchError);
        playbackConfig.pitchCorrectionQuality = 'High';
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.audioUrl },
        playbackConfig,
        this.onPlaybackStatusUpdate.bind(this)
      );
      
      this.sound = sound;
      this.isLoaded = true;
      console.log('Audio carregado:', audio.titulo);
    } catch (error) {
      console.error('Erro ao carregar audio:', error);
      this.isLoaded = false;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying;
      this.position = status.positionMillis || 0;
      this.duration = status.durationMillis || 0;
      
      // Log para debug
      if (status.isPlaying) {
        console.log('Áudio tocando:', {
          position: this.position,
          duration: this.duration,
          title: this.currentAudio?.titulo
        });
      }
    }
  }

  async play() {
    try {
      if (!this.sound || !this.isLoaded) {
        console.warn('Tentativa de reproduzir áudio não carregado');
        return;
      }

      await this.sound.playAsync();
      this.isPlaying = true;
      console.log('Áudio iniciado');
    } catch (error) {
      console.error('Erro ao reproduzir:', error);
      throw error;
    }
  }

  async pause() {
    try {
      if (!this.sound || !this.isLoaded) {
        console.warn('Tentativa de pausar áudio não carregado');
        return;
      }

      await this.sound.pauseAsync();
      this.isPlaying = false;
      console.log('Áudio pausado');
    } catch (error) {
      console.error('Erro ao pausar:', error);
      // Não rethrow o erro para evitar crashes
    }
  }

  async stop() {
    try {
      if (!this.sound || !this.isLoaded) {
        console.warn('Tentativa de parar áudio não carregado');
        return;
      }

      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
      this.isPlaying = false;
      this.position = 0;
      console.log('Áudio parado');
    } catch (error) {
      console.error('Erro ao parar:', error);
      throw error;
    }
  }

  async seekTo(position: number) {
    try {
      if (!this.sound || !this.isLoaded) {
        console.warn('Tentativa de buscar posição em áudio não carregado');
        return;
      }

      await this.sound.setPositionAsync(position);
      this.position = position;
      console.log('Posição alterada para:', position);
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
      throw error;
    }
  }

  async getPosition(): Promise<number> {
    return this.position;
  }

  async getDuration(): Promise<number> {
    return this.duration;
  }

  async getState(): Promise<string> {
    if (!this.sound || !this.isLoaded) return 'none';
    return this.isPlaying ? 'playing' : 'paused';
  }

  async unload() {
    try {
      if (this.sound) {
        try {
          await this.sound.unloadAsync();
        } catch (error) {
          console.warn('Erro ao descarregar áudio:', error);
        }
        this.sound = null;
        this.currentAudio = null;
        this.isPlaying = false;
        this.position = 0;
        this.duration = 0;
        this.isLoaded = false;
        console.log('Áudio descarregado');
      }
    } catch (error) {
      console.error('Erro ao descarregar audio:', error);
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getCurrentAudio(): AudioType | null {
    return this.currentAudio;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Método para verificar se o áudio está carregado
  isAudioLoaded(): boolean {
    return this.sound !== null && this.isLoaded;
  }

  // Método para verificar se está carregando
  getIsLoading(): boolean {
    return this.isLoading;
  }

  // Método para obter informações do áudio atual
  getAudioInfo() {
    return {
      currentAudio: this.currentAudio,
      isPlaying: this.isPlaying,
      position: this.position,
      duration: this.duration,
      isReady: this.isInitialized,
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
    };
  }

  // Método seguro para pausar áudio
  async safePause(): Promise<boolean> {
    try {
      if (!this.sound || !this.isLoaded) {
        console.log('Áudio não está carregado, não é possível pausar');
        return false;
      }

      await this.sound.pauseAsync();
      this.isPlaying = false;
      console.log('Áudio pausado com sucesso');
      return true;
    } catch (error) {
      console.warn('Erro ao pausar áudio (ignorado):', error);
      return false;
    }
  }

  // Método seguro para parar áudio
  async safeStop(): Promise<boolean> {
    try {
      if (!this.sound || !this.isLoaded) {
        console.log('Áudio não está carregado, não é possível parar');
        return false;
      }

      await this.sound.stopAsync();
      await this.sound.setPositionAsync(0);
      this.isPlaying = false;
      this.position = 0;
      console.log('Áudio parado com sucesso');
      return true;
    } catch (error) {
      console.warn('Erro ao parar áudio (ignorado):', error);
      return false;
    }
  }
}

export default AudioServiceEnhanced.getInstance(); 