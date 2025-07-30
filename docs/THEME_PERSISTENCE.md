# Persistência do Tema

## Visão Geral

O sistema de persistência do tema permite que a preferência do usuário seja salva no dispositivo e restaurada automaticamente quando o app for reaberto.

## Como Funciona

### 1. Armazenamento
- A preferência do tema é salva no `AsyncStorage` usando a chave `@harpa_crista_theme_preference`
- Os dados salvos incluem:
  - `isDarkMode`: boolean indicando se o tema escuro está ativo
  - `isManualOverride`: boolean indicando se o usuário definiu manualmente o tema

### 2. Carregamento
- Ao iniciar o app, o sistema carrega a preferência salva do `AsyncStorage`
- Se não houver preferência salva, usa o tema do sistema operacional
- O estado de carregamento é gerenciado para evitar flickering

### 3. Sincronização com o Sistema
- Se o usuário não definiu manualmente o tema (`isManualOverride = false`), o app segue automaticamente o tema do sistema
- Quando o usuário altera manualmente o tema, `isManualOverride` é definido como `true`

## Estrutura dos Dados

```json
{
  "isDarkMode": true,
  "isManualOverride": true
}
```

## Chaves de Storage

- `@harpa_crista_theme_preference`: Armazena a preferência do tema

## Tratamento de Erros

- Se houver erro ao carregar a preferência, o app usa o tema padrão do sistema
- Se houver erro ao salvar, o erro é logado mas não afeta a funcionalidade
- Todos os erros são tratados graciosamente para não quebrar a experiência do usuário

## Uso na Interface

O usuário pode alterar o tema através da tela de Configurações:
1. Acesse a aba "Configurações"
2. Na seção "Aparência"
3. Use o toggle "Tema Escuro" para alternar entre temas

A mudança é aplicada imediatamente e persistida automaticamente no dispositivo. 