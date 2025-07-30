import React from 'react';
import { View, Text } from 'react-native';

export function ThemeTest() {
  return (
    <View className="flex-1 bg-red-500 p-4">
      <Text className="text-white text-lg font-bold">Teste Tailwind</Text>
      <View className="bg-blue-500 p-2 mt-4 rounded">
        <Text className="text-white">mt-4 funcionando</Text>
      </View>
      <View className="bg-green-500 p-2 mt-8 rounded">
        <Text className="text-white">mt-8 funcionando</Text>
      </View>
    </View>
  );
} 