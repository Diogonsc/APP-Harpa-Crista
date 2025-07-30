# Sistema de Cache Offline

## Visão Geral

O sistema de cache offline permite que o app funcione mesmo sem conexão com a internet, salvando todos os hinos localmente no dispositivo do usuário.

## Como Funciona

### 1. Sincronização Automática
- Ao abrir o app pela primeira vez, todos os hinos são baixados automaticamente da API
- Os dados são salvos no AsyncStorage do dispositivo
- A sincronização é feita em background sem interromper a experiência do usuário

### 2. Cache Inteligente
- O cache tem duração de 24 horas
- Após esse período, o app verifica se há novos dados disponíveis
- Se não houver internet, o app continua funcionando com os dados locais

### 3. Fallback Automático
- Quando a API não está disponível, o app automaticamente usa os dados locais
- Busca, filtros e navegação funcionam normalmente offline
- Apenas os áudios requerem conexão com a internet

## Componentes do Sistema

### LocalStorageService
Gerencia o armazenamento local dos hinos:
- `saveHinos()`: Salva hinos no AsyncStorage
- `loadHinos()`: Carrega hinos do AsyncStorage
- `searchHinos()`: Busca hinos por texto localmente
- `getHinoByNumber()`: Busca hino específico por número
- `isCacheValid()`: Verifica se o cache ainda é válido

### SyncService
Gerencia a sincronização com a API:
- `syncAllHinos()`: Baixa todos os hinos da API
- `syncIfNeeded()`: Sincroniza apenas se necessário
- `forceSync()`: Força sincronização mesmo se cache válido
- `getSyncStats()`: Retorna estatísticas da sincronização

### ApiService Modificado
Todos os métodos foram modificados para usar fallback local:
- `getHinos()`: Usa dados locais se API falhar
- `buscarHinosPorTexto()`: Busca local se API indisponível
- `getHinoPorNumero()`: Busca local se API indisponível
- `getHinoAleatorio()`: Usa dados locais se API falhar

## Interface do Usuário

### Tela Inicial
- Componente `SyncStatus` mostra o status da sincronização
- Indica se há dados locais, se estão atualizados
- Botão para sincronização manual

### Tela de Configurações
- Seção "Dados" com opção "Sincronizar Hinos"
- Permite sincronização manual quando necessário
- Mostra feedback sobre o processo de sincronização

## Chaves de Storage

- `@harpa_crista_hinos_cache`: Dados dos hinos
- `@harpa_crista_hinos_last_update`: Timestamp da última atualização

## Estados do Cache

### Verde (✅ Dados atualizados)
- Cache válido (menos de 24h)
- Dados locais disponíveis
- App funciona perfeitamente offline

### Amarelo (⚠️ Dados desatualizados)
- Cache expirado (mais de 24h)
- Dados locais disponíveis
- App funciona offline, mas dados podem estar desatualizados

### Vermelho (❌ Sem dados locais)
- Nenhum dado local disponível
- App requer internet para funcionar
- Primeira execução ou cache limpo

## Vantagens

1. **Funcionamento Offline**: Usuários podem acessar hinos sem internet
2. **Performance**: Dados locais carregam instantaneamente
3. **Economia de Dados**: Reduz uso de internet
4. **Experiência Consistente**: Interface funciona igual online/offline
5. **Sincronização Inteligente**: Só baixa dados quando necessário

## Limitações

1. **Áudios**: Requerem conexão com internet
2. **Atualizações**: Novos hinos só aparecem após sincronização
3. **Espaço**: Ocupa espaço no dispositivo (aproximadamente 1-2MB)
4. **Primeira Execução**: Requer internet para download inicial

## Configuração

O sistema é configurado automaticamente e não requer intervenção do usuário. A sincronização acontece:
- Na primeira execução do app
- Quando o cache expira (24h)
- Manualmente através da tela de configurações
- Durante pull-to-refresh na tela inicial

## Tratamento de Erros

- Se a sincronização falhar, o app continua funcionando com dados locais
- Se não houver dados locais, mostra mensagem de erro apropriada
- Todos os erros são tratados graciosamente sem quebrar a experiência
- Logs detalhados para debugging 