import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HinoLocal } from '../types/api';

interface HinoItemProps {
  item: HinoLocal;
  isFavorito: boolean;
  onPress: (item: HinoLocal) => void;
  onFavoritePress: (item: HinoLocal) => void;
  onPlayPress?: (item: HinoLocal) => void;
  hasAudio?: boolean;
  colors: {
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    icon: string;
    searchBackground: string;
  };
}

const HinoItemComponent = memo<HinoItemProps>(({ 
  item, 
  isFavorito, 
  onPress, 
  onFavoritePress, 
  colors 
}) => {
  return (
    <TouchableOpacity
      style={[styles.hinoItem, { backgroundColor: colors.surface }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.hinoIcon, { backgroundColor: colors.searchBackground }]}>
        <Feather name="music" size={20} color={colors.icon} />
      </View>
      <View style={styles.hinoInfo}>
        <Text style={[styles.hinoTitulo, { color: colors.text }]}>{item.titulo}</Text>
        <Text style={[styles.hinoNumero, { color: colors.textSecondary }]}>Hino {item.numero}</Text>
        {item.autor && (
          <Text style={[styles.hinoAutor, { color: colors.textSecondary }]}>{item.autor}</Text>
        )}
      </View>
      <View style={styles.hinoActions}>
        <TouchableOpacity
          style={styles.favoritoButton}
          onPress={() => onFavoritePress(item)}
        >
          <Feather 
            name={isFavorito ? "heart" : "heart"} 
            size={20} 
            color={isFavorito ? "#ff6b6b" : colors.icon} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

// Criar componente animado para resolver o problema do VirtualizedList
const HinoItem = Animated.createAnimatedComponent(HinoItemComponent);

const styles = StyleSheet.create({
  hinoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  hinoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  hinoInfo: {
    flex: 1,
  },
  hinoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hinoNumero: {
    fontSize: 14,
    marginBottom: 2,
  },
  hinoAutor: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  hinoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    padding: 8,
    marginRight: 8,
  },
  favoritoButton: {
    padding: 8,
  },
});

HinoItem.displayName = 'HinoItem';

export default HinoItem; 