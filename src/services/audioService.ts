import { Audio } from 'expo-av';
import { Audio as AudioType } from '../types/api';

class AudioService {
  private static instance: AudioService;
  private sound: Audio.Sound | null = null;
  private currentAudio: AudioType | null = null;
  private isPlaying: boolean = false;
  private position: number = 0;
  private duration: number = 0;

  static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio configurado com sucesso');
    } catch (error) {
      console.error('Erro ao configurar audio:', error);
    }
  }

  async loadAudio(audio: AudioType) {
    try {
      if (this.sound) {
        try {
          await this.sound.unloadAsync();
        } catch (error) {
          console.warn('Erro ao descarregar áudio anterior:', error);
        }
      }

      this.currentAudio = audio;
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.audioUrl },
        { shouldPlay: false },
        this.onPlaybackStatusUpdate.bind(this)
      );
      
      this.sound = sound;
      console.log('Audio carregado:', audio.titulo);
    } catch (error) {
      console.error('Erro ao carregar audio:', error);
    }
  }

  private onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      this.isPlaying = status.isPlaying;
      this.position = status.positionMillis || 0;
      this.duration = status.durationMillis || 0;
    }
  }

  async play() {
    try {
      if (this.sound) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Erro ao reproduzir:', error);
    }
  }

  async pause() {
    try {
      if (this.sound) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Erro ao pausar:', error);
    }
  }

  async stop() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.setPositionAsync(0);
        this.isPlaying = false;
        this.position = 0;
      }
    } catch (error) {
      console.error('Erro ao parar:', error);
    }
  }

  async seekTo(position: number) {
    try {
      if (this.sound) {
        await this.sound.setPositionAsync(position);
        this.position = position;
      }
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
    }
  }

  async getPosition(): Promise<number> {
    return this.position;
  }

  async getDuration(): Promise<number> {
    return this.duration;
  }

  async getState(): Promise<string> {
    if (!this.sound) return 'none';
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
      }
    } catch (error) {
      console.error('Erro ao descarregar audio:', error);
    }
  }
}

export default AudioService.getInstance(); 