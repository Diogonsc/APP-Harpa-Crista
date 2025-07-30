import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAudio } from '../contexts/AudioContext';

interface AudioPlayerProps {
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const { 
    currentAudio, 
    isPlaying, 
    isLoading, 
    isDownloading, 
    duration, 
    position, 
    pauseAudio, 
    resumeAudio, 
    stopAudio, 
    seekTo 
  } = useAudio();

  const togglePlayPause = async () => {
    try {
      if (isPlaying) {
        await pauseAudio();
      } else {
        await resumeAudio();
      }
    } catch (error) {
      console.error('Erro ao controlar áudio:', error);
      Alert.alert('Erro', 'Não foi possível controlar o áudio');
    }
  };

  const handleClose = () => {
    stopAudio();
    onClose();
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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {currentAudio.titulo}
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Feather name="x" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={togglePlayPause}
          style={[styles.playButton, { backgroundColor: colors.primary }]}
          disabled={isLoading || isDownloading}
        >
          {isLoading || isDownloading ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Feather
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={colors.background}
            />
          )}
        </TouchableOpacity>
      </View>

      {isDownloading && (
        <View style={styles.downloadContainer}>
          <Text style={[styles.downloadText, { color: colors.textSecondary }]}>
            Baixando áudio...
          </Text>
        </View>
      )}

      {duration > 0 && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primary, width: `${progress}%` }
              ]}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 4,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 16,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
  },
});

export default AudioPlayer; 