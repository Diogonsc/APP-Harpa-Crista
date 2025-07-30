# Harpa Cristã - App Mobile

![Harpa Cristã](https://harpacrista.com/logo.png)

Um aplicativo mobile moderno e completo para acessar o hinário Harpa Cristã, desenvolvido com React Native e Expo.

## 📱 Sobre o Projeto

O Harpa Cristã é um app que oferece acesso completo ao hinário tradicional, com funcionalidades avançadas de reprodução de áudio, busca inteligente e interface moderna. O app foi desenvolvido pensando na experiência do usuário e na facilidade de uso.

## ✨ Funcionalidades

### 🎵 Reprodução de Áudio
- **Player avançado** similar ao Spotify
- **Reprodução em background** - continue ouvindo mesmo com o app fechado
- **Controles de mídia** do sistema (iOS/Android)
- **Notificações de mídia** com controles na tela de bloqueio
- **Controles de fones bluetooth**
- **Seek/avançar/retroceder** na música

### 🔍 Busca e Navegação
- **Busca inteligente** por título, número ou letra
- **Filtros avançados** para encontrar hinos rapidamente
- **Histórico de reprodução**
- **Favoritos** - salve seus hinos preferidos

### 🎨 Interface Moderna
- **Design responsivo** e adaptável
- **Tema claro/escuro** automático
- **Animações suaves** e transições
- **Interface intuitiva** e fácil de usar

### 📱 Recursos Mobile
- **Modo offline** - funcionalidades básicas sem internet
- **Otimização de performance**
- **Compatibilidade** com iOS e Android
- **Atualizações OTA** via Expo

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **NativeWind** - Estilização com Tailwind CSS
- **React Navigation** - Navegação entre telas

### Áudio e Mídia
- **react-native-track-player** - Player de áudio avançado
- **expo-av** - APIs de áudio do Expo
- **Media Controls** - Controles de mídia do sistema

### Estado e Dados
- **React Context** - Gerenciamento de estado
- **AsyncStorage** - Armazenamento local
- **API REST** - Integração com backend

### Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **TypeScript** - Tipagem estática

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Android Studio (para builds nativos)
- Xcode (para builds iOS - apenas macOS)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/harpa-crista.git
cd harpa-crista
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure o ambiente**
```bash
# Instale o Expo CLI globalmente
npm install -g @expo/cli

# Faça login na sua conta Expo
expo login
```

### Executando o Projeto

#### Desenvolvimento com Expo Go
```bash
# Inicie o servidor de desenvolvimento
npm start
# ou
expo start

# Escaneie o QR code com o app Expo Go
```

#### Build de Desenvolvimento
```bash
# Build para Android
npm run build:android

# Build para iOS
npm run build:ios

# Build para ambas as plataformas
npm run build:all
```

#### Build de Produção
```bash
# Build de produção para Android
eas build --platform android

# Build de produção para iOS
eas build --platform ios
```

## 🏗️ Estrutura do Projeto

```
harpa-crista/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── screens/            # Telas do aplicativo
│   ├── contexts/           # Contextos React
│   ├── services/           # Serviços e APIs
│   ├── hooks/              # Custom hooks
│   ├── types/              # Definições TypeScript
│   └── utils/              # Utilitários
├── assets/                 # Imagens e recursos
├── docs/                   # Documentação
├── screenshots/            # Screenshots do app
└── scripts/                # Scripts de automação
```

## 🎯 Funcionalidades Principais

### Player de Áudio
- Reprodução contínua em background
- Controles de mídia do sistema
- Notificações de mídia
- Integração com fones bluetooth
- Seek e controle de volume

### Sistema de Busca
- Busca por título do hino
- Busca por número
- Busca por letra da música
- Filtros avançados
- Histórico de buscas

### Favoritos
- Salvar hinos favoritos
- Lista de favoritos
- Sincronização local
- Organização por categorias

### Temas
- Tema claro/escuro
- Detecção automática
- Persistência de preferência
- Transições suaves

## 📱 Compatibilidade

- **Android**: 6.0 (API 23) ou superior
- **iOS**: 12.0 ou superior
- **Expo**: SDK 53

## 🚀 Deploy e Distribuição

### Expo Application Services (EAS)
```bash
# Configurar EAS
eas build:configure

# Build de desenvolvimento
eas build --profile development --platform android

# Build de produção
eas build --platform android

# Submeter para lojas
eas submit --platform android
```

### Atualizações OTA
```bash
# Publicar atualização
expo publish

# Ou usando EAS
eas update --branch production
```

## 📊 Versões

- **Versão atual**: 1.0.1
- **Build Android**: 2
- **Build iOS**: 2

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@harpacrista.com
- **Website**: https://harpacrista.com
- **Documentação**: [docs/](docs/)

## 🙏 Agradecimentos

- Comunidade React Native
- Expo Team
- Contribuidores do projeto
- Usuários que testaram e reportaram bugs

---

**Desenvolvido com ❤️ para a comunidade cristã**
