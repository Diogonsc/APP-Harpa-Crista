import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import InicioScreen from "../../screens/HomeScreen";
import { FavoritiesScreen } from "../../screens/FavoritiesScreen";
import { SettingScreen } from "../../screens/SettingScreen";
import { TermsScreen } from "../../screens/TermsScreen";
import { PrivacyScreen } from "../../screens/PrivacyScreen";
import { DeveloperScreen } from "../../screens/DeveloperScreen";
import { Feather } from "@expo/vector-icons";
import { AudioScreen } from "../../screens/AudioScreen";
import HinoDetailsScreen from "../../screens/HinoDetailsScreen";
import { AudioDetailsScreen } from "../../screens/AudioDetailsScreen";
import { Text, View, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../contexts/ThemeContext";
import { useAudio } from "../../contexts/AudioContext";
import { HinoLocal } from "../../types/api";
import { Audio } from "../../types/api";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

type HomeStackParamList = {
  InicioMain: undefined;
  HinoDetalhe: { hino: HinoLocal };
};

type AudioStackParamList = {
  AudioMain: undefined;
  AudioDetalhe: { audio: Audio };
};

type FavoritosStackParamList = {
  FavoritosMain: undefined;
  HinoDetalhe: { hino: HinoLocal };
};

type SettingsStackParamList = {
  SettingsMain: undefined;
  TermsScreen: undefined;
  PrivacyScreen: undefined;
  DeveloperScreen: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const AudioStack = createStackNavigator<AudioStackParamList>();
const FavoritosStack = createStackNavigator<FavoritosStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="InicioMain" component={InicioScreen} />
      <HomeStack.Screen name="HinoDetalhe" component={HinoDetailsScreen} />
    </HomeStack.Navigator>
  );
}

function AudioStackScreen() {
  return (
    <AudioStack.Navigator screenOptions={{ headerShown: false }}>
      <AudioStack.Screen name="AudioMain" component={AudioScreen} />
      <AudioStack.Screen name="AudioDetalhe" component={AudioDetailsScreen} />
    </AudioStack.Navigator>
  );
}

function FavoritosStackScreen() {
  return (
    <FavoritosStack.Navigator screenOptions={{ headerShown: false }}>
      <FavoritosStack.Screen name="FavoritosMain" component={FavoritiesScreen} />
      <FavoritosStack.Screen name="HinoDetalhe" component={HinoDetailsScreen} />
    </FavoritosStack.Navigator>
  );
}

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="SettingsMain" component={SettingScreen} />
      <SettingsStack.Screen name="TermsScreen" component={TermsScreen} />
      <SettingsStack.Screen name="PrivacyScreen" component={PrivacyScreen} />
      <SettingsStack.Screen name="DeveloperScreen" component={DeveloperScreen} />
    </SettingsStack.Navigator>
  );
}

export function TabBar() {
  const { isDarkMode, colors } = useTheme();
  const { currentAudio } = useAudio();

  // Função auxiliar para criar labels com cores do tema
  const createTabLabel = (label: string) => ({ focused }: { focused: boolean }) => (
    <Text style={{
      fontSize: 12,
      fontWeight: focused ? '600' : '400',
      color: focused ? colors.primary : colors.icon,
    }}>
      {label}
    </Text>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 0 : 0,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: currentAudio ? 80 : (Platform.OS === 'ios' ? 0 : 0),
          elevation: Platform.OS === 'android' ? 8 : 0,
          shadowColor: Platform.OS === 'ios' ? '#000' : 'transparent',
          shadowOffset: {
            width: 0,
            height: Platform.OS === 'ios' ? -2 : 0,
          },
          shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
          shadowRadius: Platform.OS === 'ios' ? 3 : 0,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
      >
        <Tab.Screen
          name="Inicio"
          component={HomeStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
            tabBarLabel: createTabLabel("Inicio"),
          }}
        />
        <Tab.Screen
          name="Favoritos"
          component={FavoritosStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="heart" color={color} size={size} />
            ),
            tabBarLabel: createTabLabel("Favoritos"),
          }}
        />
        <Tab.Screen
          name="Audio"
          component={AudioStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="music" color={color} size={size} />
            ),
            tabBarLabel: createTabLabel("Audio"),
          }}
        />
        <Tab.Screen
          name="Configurações"
          component={SettingsStackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" color={color} size={size} />
            ),
            tabBarLabel: createTabLabel("Configurações"),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
