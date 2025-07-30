# Modais Legais - Termos de Uso e Política de Privacidade

## Visão Geral

Foram implementados modais de tela inteira para exibir os Termos de Uso e Política de Privacidade do aplicativo Harpa Cristã, seguindo o mesmo padrão do modal "Sobre o Desenvolvedor".

## Modais Implementados

### 1. TermsModal (Termos de Uso)

#### Funcionalidades
- **Modal Full Screen**: Experiência imersiva
- **Conteúdo Estruturado**: 8 seções organizadas
- **Tema Adaptativo**: Cores específicas para dark/light
- **Navegação Intuitiva**: Header com botão fechar

#### Seções do Conteúdo
1. **Aceitação dos Termos**: Explicação sobre concordância
2. **Descrição do Serviço**: O que o app oferece
3. **Uso Aceitável**: Limitações de uso
4. **Propriedade Intelectual**: Direitos autorais
5. **Privacidade**: Referência à política
6. **Limitação de Responsabilidade**: Proteções legais
7. **Modificações dos Termos**: Atualizações
8. **Contato**: Como entrar em contato

### 2. PrivacyModal (Política de Privacidade)

#### Funcionalidades
- **Modal Full Screen**: Experiência imersiva
- **Conteúdo Detalhado**: 9 seções abrangentes
- **Tema Adaptativo**: Cores específicas para dark/light
- **Navegação Intuitiva**: Header com botão fechar

#### Seções do Conteúdo
1. **Informações que Coletamos**: Dados coletados
2. **Como Usamos suas Informações**: Finalidades
3. **Compartilhamento de Dados**: Política de compartilhamento
4. **Segurança dos Dados**: Medidas de proteção
5. **Seus Direitos**: Direitos do usuário
6. **Cookies e Tecnologias**: Tecnologias utilizadas
7. **Menores de Idade**: Proteção de menores
8. **Alterações na Política**: Atualizações
9. **Contato**: Como entrar em contato

## Implementação Técnica

### Estrutura dos Componentes

```typescript
interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
}
```

### Integração na SettingScreen

```typescript
// Estados dos modais
const [showTermsModal, setShowTermsModal] = useState(false);
const [showPrivacyModal, setShowPrivacyModal] = useState(false);

// Handlers
const handleTermsOfUse = () => {
  setShowTermsModal(true);
};

const handlePrivacyPolicy = () => {
  setShowPrivacyModal(true);
};

// Renderização dos modais
<TermsModal visible={showTermsModal} onClose={() => setShowTermsModal(false)} />
<PrivacyModal visible={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
```

## Design e UX

### Layout Consistente
- **Header**: Título + botão fechar
- **ScrollView**: Conteúdo rolável
- **Seções**: Cards organizados
- **Espaçamento**: Padding e margin consistentes

### Tema Adaptativo
- **Tema Escuro**: Fundo escuro, texto claro
- **Tema Claro**: Fundo claro, texto escuro
- **Cards**: Background diferenciado
- **Ícones**: Cores apropriadas

### Tipografia
- **Títulos**: Font-weight semibold
- **Conteúdo**: Texto legível
- **Hierarquia**: Tamanhos consistentes
- **Espaçamento**: Line-height adequado

## Conteúdo Legal

### Termos de Uso
- **Aceitação**: Concordância com os termos
- **Serviço**: Descrição do aplicativo
- **Uso**: Limitações e responsabilidades
- **Propriedade**: Direitos autorais
- **Privacidade**: Referência à política
- **Responsabilidade**: Limitações legais
- **Modificações**: Atualizações dos termos
- **Contato**: Informações de contato

### Política de Privacidade
- **Coleta**: Dados coletados
- **Uso**: Finalidades dos dados
- **Compartilhamento**: Política de terceiros
- **Segurança**: Medidas de proteção
- **Direitos**: Direitos do usuário
- **Tecnologias**: Cookies e similares
- **Menores**: Proteção de menores
- **Alterações**: Atualizações da política
- **Contato**: Informações de contato

## Benefícios

### 1. Conformidade Legal
- **LGPD**: Conformidade com a lei brasileira
- **Transparência**: Informações claras
- **Consentimento**: Aceitação explícita
- **Proteção**: Direitos do usuário

### 2. Experiência do Usuário
- **Acesso Fácil**: Modais integrados
- **Leitura Cômoda**: Layout otimizado
- **Navegação Intuitiva**: Botões claros
- **Tema Consistente**: Adaptação automática

### 3. Profissionalismo
- **Documentação Completa**: Termos abrangentes
- **Design Polido**: Interface elegante
- **Conteúdo Atualizado**: Data de atualização
- **Estrutura Clara**: Seções organizadas

## Compatibilidade

- ✅ **iOS**: Funciona perfeitamente
- ✅ **Android**: Funciona perfeitamente
- ✅ **Tema Escuro**: Adaptação completa
- ✅ **Tema Claro**: Adaptação completa
- ✅ **Scroll**: Conteúdo rolável
- ✅ **Navegação**: Botões funcionais

## Personalização

### Conteúdo
- **Termos**: Ajustar conforme necessidades legais
- **Política**: Personalizar coleta de dados
- **Contato**: Atualizar informações
- **Data**: Manter atualizada

### Design
- **Cores**: Manter consistência com tema
- **Tipografia**: Ajustar tamanhos se necessário
- **Layout**: Manter estrutura organizada
- **Espaçamento**: Preservar legibilidade

## Próximos Passos

1. **Revisão Legal**: Validar conteúdo com advogado
2. **Atualizações**: Manter termos atualizados
3. **Analytics**: Implementar tracking de visualização
4. **Feedback**: Coletar sugestões dos usuários 