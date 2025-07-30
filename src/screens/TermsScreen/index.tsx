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

type TermsScreenProps = {
  navigation: any;
};

export function TermsScreen({ navigation }: TermsScreenProps) {
  const { isDarkMode, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['left', 'right']}>
      <StatusBar />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Termos de Uso</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Introdução */}
        <View style={styles.introSection}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Termos de Uso - Harpa Cristã
          </Text>
          
          <Text style={[styles.updateDate, { color: colors.textSecondary }]}>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {/* Seção 1 - Aceitação dos Termos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Aceitação dos Termos
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Ao baixar, instalar ou usar o aplicativo Harpa Cristã, você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deve usar o aplicativo.
            </Text>
          </View>
        </View>

        {/* Seção 2 - Descrição do Serviço */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. Descrição do Serviço
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O Harpa Cristã é um aplicativo móvel que fornece acesso aos hinos tradicionais da Harpa Cristã. 
              O aplicativo inclui recursos como busca, favoritos, player de áudio e modo de leitura otimizado.
            </Text>
          </View>
        </View>

        {/* Seção 3 - Uso Aceitável */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. Uso Aceitável
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Você concorda em usar o aplicativo apenas para fins legais e de acordo com estes Termos. 
              Você não deve usar o aplicativo de qualquer forma que possa danificar, desabilitar, 
              sobrecarregar ou prejudicar nossos servidores ou redes.
            </Text>
          </View>
        </View>

        {/* Seção 4 - Propriedade Intelectual */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Propriedade Intelectual
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              O aplicativo e seu conteúdo são protegidos por direitos autorais, marcas comerciais e outras leis de propriedade intelectual. 
              Os hinos e letras são de propriedade de seus respectivos autores e editores.
            </Text>
          </View>
        </View>

        {/* Seção 5 - Privacidade */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            5. Privacidade
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Sua privacidade é importante para nós. Consulte nossa Política de Privacidade para entender 
              como coletamos, usamos e protegemos suas informações pessoais.
            </Text>
          </View>
        </View>

        {/* Seção 6 - Limitação de Responsabilidade */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            6. Limitação de Responsabilidade
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Em nenhuma circunstância seremos responsáveis por danos indiretos, incidentais, especiais, 
              consequenciais ou punitivos, incluindo perda de lucros, dados ou uso.
            </Text>
          </View>
        </View>

        {/* Seção 7 - Modificações */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            7. Modificações dos Termos
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Reservamo-nos o direito de modificar estes Termos a qualquer momento. 
              As modificações entrarão em vigor imediatamente após sua publicação no aplicativo.
            </Text>
          </View>
        </View>

        {/* Seção 8 - Contato */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            8. Contato
          </Text>
          
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardText, { color: colors.textSecondary }]}>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
              da seção "Sobre o Desenvolvedor" nas configurações do aplicativo.
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
  bottomSpacing: {
    height: 80,
  },
}); 