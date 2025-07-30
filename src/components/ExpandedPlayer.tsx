import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAudio } from '../contexts/AudioContext';

const { width, height } = Dimensions.get('window');

interface ExpandedPlayerProps {
  visible: boolean;
  onClose: () => void;
}

const ExpandedPlayer: React.FC<ExpandedPlayerProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const { 
    currentAudio, 
    isPlaying, 
    isLoading, 
    duration, 
    position, 
    pauseAudio, 
    resumeAudio,
    seekTo,
    nextTrack,
    previousTrack
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
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (position / duration) * 100 : 0;

  const handleSeek = (event: any) => {
    const { locationX } = event.nativeEvent;
    const seekBarWidth = width - 64; // 32px padding on each side
    const seekPercentage = locationX / seekBarWidth;
    const newPosition = seekPercentage * duration;
    seekTo(newPosition);
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

  if (!currentAudio) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="chevron-down" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Tocando agora
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Album Art Placeholder */}
            <View style={[styles.albumArt, { backgroundColor: colors.primary }]}>
              <Feather name="music" size={48} color={colors.background} />
            </View>

            {/* Song Info */}
            <View style={styles.songInfo}>
              <Text style={[styles.songTitle, { color: colors.text }]} numberOfLines={2}>
                {currentAudio.titulo}
              </Text>
              <Text style={[styles.songSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
                {currentAudio.hino?.titulo || 'Harpa Cristã'}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <TouchableOpacity
                style={styles.seekBar}
                onPress={handleSeek}
                activeOpacity={0.8}
              >
                <View style={[styles.progressBar, { backgroundColor: colors.separator }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: colors.primary, width: `${progress}%` }
                    ]}
                  />
                </View>
              </TouchableOpacity>
              
              <View style={styles.timeContainer}>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {formatTime(position)}
                </Text>
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {formatTime(duration)}
                </Text>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handlePreviousTrack}
              >
                <Feather name="skip-back" size={24} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={togglePlayPause}
                style={[styles.playButton, { backgroundColor: colors.primary }]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color={colors.background} />
                ) : (
                  <Feather
                    name={isPlaying ? 'pause' : 'play'}
                    size={32}
                    color={colors.background}
                  />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={handleNextTrack}
              >
                <Feather name="skip-forward" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Additional Controls */}
            <View style={styles.additionalControls}>
              <TouchableOpacity style={styles.additionalButton}>
                <Feather name="repeat" size={20} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.additionalButton}>
                <Feather name="shuffle" size={20} color={colors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.additionalButton}>
                <Feather name="list" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  songTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  songSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  seekBar: {
    width: '100%',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  controlButton: {
    padding: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  additionalButton: {
    padding: 12,
  },
});

export default ExpandedPlayer; 