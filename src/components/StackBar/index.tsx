import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../screens/HomeScreen";
import { FavoritiesScreen } from "../../screens/FavoritiesScreen";
import { AudioScreen } from "../../screens/AudioScreen";
import { SettingScreen } from "../../screens/SettingScreen";
import { AudioDetailsScreen } from "../../screens/AudioDetailsScreen";
import { HinoDetailsScreen } from "../../screens/HinoDetailsScreen";
import { useTheme } from "../../contexts/ThemeContext";
import { HinoLocal } from "../../types/api";

type RootStackParamList = {
  Home: undefined;
  Favoritos: undefined;
  Audio: undefined;
  Configurações: undefined;
  HinoDetalhe: { hino: HinoLocal };
  AudioDetalhe: { audio: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export function StackBar() {
  const { isDarkMode, colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.headerBackground,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Harpa Cristã',
        }}
      />
      <Stack.Screen 
        name="Favoritos" 
        component={FavoritiesScreen}
        options={{
          title: 'Favoritos',
        }}
      />
      <Stack.Screen 
        name="Audio" 
        component={AudioScreen}
        options={{
          title: 'Player de Áudio',
        }}
      />
      <Stack.Screen 
        name="Configurações" 
        component={SettingScreen}
        options={{
          title: 'Configurações',
        }}
      />
      <Stack.Screen 
        name="HinoDetalhe" 
        component={HinoDetailsScreen}
        options={{
          title: 'Detalhes do Hino',
        }}
      />
      <Stack.Screen 
        name="AudioDetalhe" 
        component={AudioDetailsScreen}
        options={{
          title: 'Detalhes do Áudio',
        }}
      />
    </Stack.Navigator>
  );
}