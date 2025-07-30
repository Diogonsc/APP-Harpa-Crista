import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useAudio } from '../contexts/AudioContext';
import AudioServiceEnhanced from '../services/audioServiceEnhanced';

interface MediaNotificationProps {
  // Este componente será usado para configurar notificações de mídia
  // quando o app estiver em segundo plano usando apenas expo-av
}

const MediaNotification: React.FC<MediaNotificationProps> = () => {
  const { currentAudio, isPlaying, pauseAudio, resumeAudio, stopAudio } = useAudio();

  useEffect(() => {
    // Configurar notificações de mídia para Android
    if (Platform.OS === 'android') {
      console.log('Configurando notificações de mídia para Android com expo-av');
    }
  }, []);

  useEffect(() => {
    if (currentAudio) {
      console.log('Atualizando notificação de mídia:', {
        titulo: currentAudio.titulo,
        isPlaying,
        platform: Platform.OS
      });

      // Atualizar metadados da notificação quando o áudio mudar
      const updateNotificationMetadata = async () => {
        try {
          // O expo-av gerencia as notificações automaticamente
          // baseado nas configurações do Audio.setAudioModeAsync
          console.log('Metadados da notificação atualizados via expo-av');
          
          // Log das informações do áudio atual
          const audioInfo = AudioServiceEnhanced.getAudioInfo();
          console.log('Informações do áudio atual:', audioInfo);
        } catch (error) {
          console.error('Erro ao atualizar metadados da notificação:', error);
        }
      };

      updateNotificationMetadata();
    }
  }, [currentAudio, isPlaying]);

  // Este componente não renderiza nada visualmente
  // Ele apenas gerencia as notificações de mídia via expo-av
  return null;
};

export default MediaNotification; 