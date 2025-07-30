# 📱 Guia de Publicação - Harpa Cristã

## ✅ Checklist de Preparação

### 1. Configurações Básicas
- [x] Bundle Identifier configurado (`com.harpacrista.app`)
- [x] Package Name configurado (`com.harpacrista.app`)
- [x] Permissões necessárias adicionadas
- [x] Configurações de segurança implementadas

### 2. Assets Necessários

#### Ícones (✅ CONCLUÍDO)
- [x] Ícone 1024x1024 para App Store (`assets/icon.png`)
- [x] Ícone adaptativo para Android (`assets/adaptive-icon.png`)
- [x] Ícone de splash (`assets/splash-icon.png`)
- [x] Favicon para web (`assets/favicon.png`)

#### Screenshots (📋 PRÓXIMO PASSO)
- [ ] Screenshots para iPhone (1170x2532 px)
- [ ] Screenshots para iPad (1640x2360 px)
- [ ] Screenshots para Android Phone (1080x1920 px)
- [ ] Screenshots para Android Tablet (1200x1920 px)

**📁 Guia detalhado**: `SCREENSHOT_GUIDE.md`
**🛠️ Script de ajuda**: `scripts/capture-screenshots.sh`

### 3. Configurações de Conta

#### Apple Developer Account
- [ ] Conta Apple Developer ativa ($99/ano)
- [ ] Certificados de desenvolvimento e distribuição
- [ ] Provisioning profiles configurados
- [ ] App Store Connect configurado

#### Google Play Console
- [ ] Conta Google Play Console ($25 taxa única)
- [ ] Conta de serviço configurada
- [ ] Chave de assinatura configurada

## 🚀 Passos para Publicação

### 1. Preparar o Projeto

```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Fazer login na conta Expo
eas login

# Configurar o projeto
eas build:configure
```

### 2. Atualizar app.json

Substitua os valores placeholder:
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "SEU_PROJECT_ID_AQUI"
      }
    },
    "owner": "SEU_USERNAME_EXPO"
  }
}
```

### 3. Criar Screenshots (PRÓXIMO PASSO)

```bash
# Executar script de ajuda
./scripts/capture-screenshots.sh

# Ou seguir o guia detalhado
# Ver: SCREENSHOT_GUIDE.md
```

### 4. Criar Builds

```bash
# Build para Android
npm run build:android

# Build para iOS
npm run build:ios

# Build para ambas plataformas
npm run build:all
```

### 5. Submeter para as Lojas

```bash
# Submeter para Google Play
npm run submit:android

# Submeter para App Store
npm run submit:ios
```

## 📋 Requisitos Específicos por Plataforma

### Google Play Store

#### Informações Necessárias:
- [ ] Nome do app: "Harpa Cristã"
- [ ] Descrição curta (80 caracteres)
- [ ] Descrição completa (4000 caracteres)
- [ ] Categoria: Música e Áudio
- [ ] Classificação de conteúdo: Livre para todos
- [ ] Política de privacidade (URL)
- [ ] Screenshots (mínimo 2)

#### Configurações Técnicas:
- [x] Permissões justificadas
- [x] Target SDK atualizado
- [x] App Bundle (.aab) configurado
- [x] Ícone adaptativo configurado

### Apple App Store

#### Informações Necessárias:
- [ ] Nome do app: "Harpa Cristã"
- [ ] Subtítulo (30 caracteres)
- [ ] Descrição (4000 caracteres)
- [ ] Categoria: Música
- [ ] Classificação: 4+ (sem conteúdo adulto)
- [ ] Política de privacidade (URL)
- [ ] Screenshots para diferentes dispositivos

#### Configurações Técnicas:
- [x] Bundle ID único
- [x] Certificados configurados
- [x] Provisioning profiles
- [x] App Transport Security configurado
- [x] Ícone 1024x1024 configurado

## 🔧 Configurações de Segurança

### iOS (App Transport Security)
```json
"NSAppTransportSecurity": {
  "NSAllowsArbitraryLoads": false,
  "NSExceptionDomains": {
    "*.harpacrista.com": {
      "NSExceptionAllowsInsecureHTTPLoads": true,
      "NSIncludesSubdomains": true
    }
  }
}
```

### Android (Network Security Config)
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">harpacrista.com</domain>
    </domain-config>
</network-security-config>
```

## 📝 Políticas e Termos

### ✅ Implementados:
- [x] Política de Privacidade
- [x] Termos de Uso
- [x] Informações sobre coleta de dados
- [x] Direitos do usuário

### ❌ Pendentes:
- [ ] URL pública para política de privacidade
- [ ] URL pública para termos de uso
- [ ] Contato do desenvolvedor

## 🎯 Status Atual: 90% Pronto

### ✅ Concluído:
- [x] Configurações técnicas (100%)
- [x] Ícones em todas as resoluções (100%)
- [x] Políticas e termos implementados (100%)
- [x] Scripts de build configurados (100%)

### 📋 Próximo Passo:
- [ ] **Criar screenshots** (último passo técnico)

### 🔄 Pendente:
- [ ] Configurar contas nas lojas
- [ ] Hospedar URLs de políticas

## 🚀 Próximos Passos Prioritários

1. **📱 Criar screenshots** usando o guia `SCREENSHOT_GUIDE.md`
2. **🏢 Configurar contas** (Apple Developer e Google Play Console)
3. **🌐 Hospedar políticas** em URLs públicas
4. **🧪 Testar builds** em dispositivos reais
5. **📤 Submeter para revisão** nas lojas

## ⚠️ Observações Importantes

- O app usa `expo-file-system` para downloads - certifique-se de que as permissões estão justificadas
- O app reproduz áudio em background - configure `UIBackgroundModes` corretamente
- Teste o app em dispositivos reais antes da submissão
- Mantenha as dependências atualizadas para evitar rejeições por segurança

## 📞 Suporte

Para dúvidas sobre publicação:
- [Expo Documentation](https://docs.expo.dev/distribution/introduction/)
- [Apple Developer Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer) 