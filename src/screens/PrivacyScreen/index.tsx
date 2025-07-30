import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBar } from '../../components/StatusBar';

type PrivacyScreenProps = {
  navigation: any;
};

export function PrivacyScreen({ navigation }: PrivacyScreenProps) {
  const { isDarkMode, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Política de Privacidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introdução */}
        <View style={styles.introSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Política de Privacidade - Harpa Cristã
          </Text>
          
          <Text style={[styles.updateDate, { color: colors.textSecondary }]}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {/* Seção 1 - Informações Coletadas */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Informações que Coletamos
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O Harpa Cristã coleta apenas informações necessárias para o funcionamento do aplicativo:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • <Text style={styles.boldText}>Dados de Uso:</Text> Informações sobre como você usa o aplicativo (hinos favoritados, configurações de tema)
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • <Text style={styles.boldText}>Dados do Dispositivo:</Text> Informações técnicas do seu dispositivo para otimização
            </Text>
          </View>
        </View>

        {/* Seção 2 - Como Usamos as Informações */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. Como Usamos suas Informações
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Utilizamos suas informações para:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • Fornecer e melhorar nossos serviços
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Personalizar sua experiência no aplicativo
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Salvar suas preferências (favoritos, tema)
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Resolver problemas técnicos
            </Text>
          </View>
        </View>

        {/* Seção 3 - Compartilhamento de Dados */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. Compartilhamento de Dados
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • Quando exigido por lei
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Para proteger nossos direitos e segurança
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Com prestadores de serviços confiáveis (apenas dados necessários)
            </Text>
          </View>
        </View>

        {/* Seção 4 - Segurança */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Segurança dos Dados
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Implementamos medidas de segurança adequadas para proteger suas informações:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • Criptografia de dados em trânsito
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Armazenamento seguro local
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Acesso limitado aos dados
            </Text>
          </View>
        </View>

        {/* Seção 5 - Seus Direitos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. Seus Direitos
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Você tem o direito de:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • Acessar suas informações pessoais
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Corrigir dados imprecisos
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Solicitar a exclusão de seus dados
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Revogar consentimento a qualquer momento
            </Text>
          </View>
        </View>

        {/* Seção 6 - Cookies e Tecnologias */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. Cookies e Tecnologias Similares
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O aplicativo pode usar tecnologias de armazenamento local para:
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 12 }]}>
              • Salvar suas preferências
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Melhorar a performance
            </Text>
            
            <Text style={[styles.cardText, { color: colors.textSecondary, marginTop: 8 }]}>
              • Manter sua sessão ativa
            </Text>
          </View>
        </View>

        {/* Seção 7 - Menores de Idade */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. Menores de Idade
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O aplicativo não coleta intencionalmente informações de menores de 13 anos. 
              Se você é pai ou responsável e acredita que seu filho forneceu informações pessoais, 
              entre em contato conosco imediatamente.
            </Text>
          </View>
        </View>

        {/* Seção 8 - Alterações */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. Alterações na Política
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Podemos atualizar esta Política de Privacidade periodicamente. 
              Notificaremos sobre mudanças significativas através do aplicativo ou email.
            </Text>
          </View>
        </View>

        {/* Seção 9 - Contato */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            9. Contato
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco 
              através da seção "Sobre o Desenvolvedor" nas configurações do aplicativo.
            </Text>
          </View>
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
  introSection: {
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  updateDate: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
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
  boldText: {
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 80,
  },
}); 