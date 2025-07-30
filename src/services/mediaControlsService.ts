import { Audio } from 'expo-av';
import { Audio as AudioType } from '../types/api';

class MediaControlsService {
  private static instance: MediaControlsService;
  private currentAudio: AudioType | null = null;
  private isPlaying: boolean = false;

  static getInstance(): MediaControlsService {
    if (!MediaControlsService.instance) {
      MediaControlsService.instance = new MediaControlsService();
    }
    return MediaControlsService.instance;
  }

  async setupMediaSession() {
    try {
      // Configurar controles de mídia para iOS
      // A configuração principal do áudio já está no AudioContext
      console.log('Controles de mídia configurados');
    } catch (error) {
      console.error('Erro ao configurar controles de mídia:', error);
    }
  }

  updatePlaybackState(audio: AudioType | null, playing: boolean) {
    this.currentAudio = audio;
    this.isPlaying = playing;

    // Aqui você pode implementar controles de mídia específicos da plataforma
    // Para iOS, você pode usar expo-av com controles de mídia
    // Para Android, você pode usar react-native-track-player
    
    if (audio) {
      console.log('Atualizando estado de reprodução:', {
        titulo: audio.titulo,
        isPlaying: playing
      });
    }
  }

  async handleMediaControl(action: 'play' | 'pause' | 'stop') {
    // Este método será chamado pelos controles de mídia do sistema
    console.log('Controle de mídia acionado:', action);
    
    // Aqui você pode implementar a lógica para responder aos controles
    // Por exemplo, emitir eventos para o contexto de áudio
    return action;
  }
}

export default MediaControlsService.getInstance(); 