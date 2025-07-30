import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAudio } from '../contexts/AudioContext';
import ExpandedPlayer from './ExpandedPlayer';

const { width } = Dimensions.get('window');

const FloatingPlayer: React.FC = () => {
  const { colors } = useTheme();
  const { 
    currentAudio, 
    isPlaying, 
    isLoading, 
    duration, 
    position, 
    pauseAudio, 
    resumeAudio,
    nextTrack,
    previousTrack
  } = useAudio();
  const [showExpandedPlayer, setShowExpandedPlayer] = useState(false);

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await pauseAudio();
      } else {
        await resumeAudio();
      }
    } catch (error) {
      console.error('Erro ao controlar áudio:', error);
    }
  };

  const handleNextTrack = async () => {
    try {
      await nextTrack();
    } catch (error) {
      console.error('Erro ao pular para próxima:', error);
    }
  };

  const handlePreviousTrack = async () => {
    try {
      await previousTrack();
    } catch (error) {
      console.error('Erro ao pular para anterior:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  if (!currentAudio) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.container, { backgroundColor: colors.surface }]}
        onPress={() => setShowExpandedPlayer(true)}
        activeOpacity={0.8}
      >
      {/* Barra de progresso superior */}
      <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: colors.primary, width: `${progress}%` }
          ]}
        />
      </View>

      <View style={styles.content}>
        {/* Informações do áudio */}
        <View style={styles.audioInfo}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentAudio.titulo}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {currentAudio.hino?.titulo || 'Harpa Cristã'}
          </Text>
        </View>

        {/* Controles */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={handlePreviousTrack}
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            disabled={isLoading}
          >
            <Feather
              name="skip-back"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayPause}
            style={[styles.playButton, { backgroundColor: colors.primary }]}
            disabled={isLoading}
          >
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={colors.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextTrack}
            style={[styles.controlButton, { backgroundColor: colors.surface }]}
            disabled={isLoading}
          >
            <Feather
              name="skip-forward"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
      
      <ExpandedPlayer
        visible={showExpandedPlayer}
        onClose={() => setShowExpandedPlayer(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  progressBar: {
    height: 2,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  audioInfo: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingPlayer; 