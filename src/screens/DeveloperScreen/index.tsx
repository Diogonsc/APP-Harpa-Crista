import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBar } from '../../components/StatusBar';

type DeveloperScreenProps = {
  navigation: any;
};

export function DeveloperScreen({ navigation }: DeveloperScreenProps) {
  const { isDarkMode, colors } = useTheme();

  const handleWhatsApp = async () => {
    try {
      const phoneNumber = '5521973819373';
      const message = 'Olá! Gostaria de falar sobre o app Harpa Cristã.';
      const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', 'WhatsApp não está instalado no dispositivo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o WhatsApp');
    }
  };

  const handleEmail = async () => {
    try {
      const email = 'diogos.nascimento@outlook.com';
      const subject = 'Contato - App Harpa Cristã';
      const body = 'Olá! Gostaria de entrar em contato sobre o app Harpa Cristã.';
      const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o email');
    }
  };

  const handlePhone = async () => {
    try {
      const phoneNumber = '5511999999999';
      const url = `tel:${phoneNumber}`;
      
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer a ligação');
    }
  };

  const handleGitHub = async () => {
    try {
      const url = 'https://github.com/diogonsc';
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o GitHub');
    }
  };

  const handleLinkedIn = async () => {
    try {
      const url = 'https://www.linkedin.com/in/diogonsc/';
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o LinkedIn');
    }
  };

  const handleSuggestions = () => {
    Alert.alert(
      'Sugestões',
      'Para enviar sugestões, entre em contato através do WhatsApp ou email disponíveis nesta tela.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Sobre o Desenvolvedor</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Foto e Informações Pessoais */}
        <View style={styles.profileSection}>
          <View style={[styles.profileImage, { backgroundColor: colors.surface }]}>
            <Image
              source={{ uri: 'https://github.com/diogonsc.png' }}
              style={styles.image}
              defaultSource={require('../../../assets/icon.png')}
            />
          </View>
          
          <Text style={[styles.developerName, { color: colors.text }]}>
            Diogo Nascimento
          </Text>
          
          <Text style={[styles.developerTitle, { color: colors.textSecondary }]}>
            Desenvolvedor Full Stack
          </Text>
        </View>

        {/* Contatos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contatos
          </Text>
          
          <View style={[styles.contactCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[styles.contactItem, { borderBottomColor: colors.border }]}
              onPress={handleGitHub}
            >
              <Feather name="github" size={20} color={colors.text} />
              <Text style={[styles.contactText, { color: colors.text }]}>
                GitHub
              </Text>
              <Text style={[styles.contactInfo, { color: colors.textSecondary }]}>
                @diogonsc
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactItem, { borderBottomColor: colors.border }]}
              onPress={handleLinkedIn}
            >
              <Feather name="linkedin" size={20} color="#007AFF" />
              <Text style={[styles.contactText, { color: colors.text }]}>
                LinkedIn
              </Text>
              <Text style={[styles.contactInfo, { color: colors.textSecondary }]}>
                linkedin.com/in/diogonsc
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactItem, { borderBottomColor: colors.border }]}
              onPress={handleWhatsApp}
            >
              <Feather name="message-circle" size={20} color="#25D366" />
              <Text style={[styles.contactText, { color: colors.text }]}>
                WhatsApp
              </Text>
              <Text style={[styles.contactInfo, { color: colors.textSecondary }]}>
                (21) 97381-9373
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmail}
            >
              <Feather name="mail" size={20} color="#007AFF" />
              <Text style={[styles.contactText, { color: colors.text }]}>
                Email
              </Text>
              <Text style={[styles.contactInfo, { color: colors.textSecondary }]}>
                diogos.nascimento@outlook.com
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sobre o App */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sobre o App
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O Harpa Cristã é um aplicativo desenvolvido com o objetivo de proporcionar 
              uma experiência completa e acessível para todos os cristãos que desejam 
              ter acesso aos hinos tradicionais da Harpa Cristã.
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              O app oferece recursos como busca por número ou título, favoritos, 
              modo leitura otimizado, player de áudio integrado e suporte a temas 
              claro e escuro para melhor experiência do usuário.
            </Text>
          </View>
        </View>

        {/* Sugestões */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sugestões e Melhorias
          </Text>
          
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.surface }]}
            onPress={handleSuggestions}
          >
            <View style={styles.suggestionItem}>
              <Feather name="edit-3" size={20} color="#FFD700" />
              <Text style={[styles.suggestionText, { color: colors.text }]}>
                Enviar Sugestões
              </Text>
              <Feather name="chevron-right" size={20} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Versão */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Versão 1.0.0
          </Text>
        </View>

        {/* Espaço extra */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  developerTitle: {
    fontSize: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  contactCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  contactInfo: {
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
  bottomSpacing: {
    height: 80,
  },
}); 