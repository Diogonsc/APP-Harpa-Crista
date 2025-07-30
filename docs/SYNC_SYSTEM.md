# Sistema de Sincronização - Harpa Cristã

## Visão Geral

O sistema de sincronização do aplicativo Harpa Cristã permite que os usuários baixem e salvem todos os hinos da API `/api/hinos` no localStorage do dispositivo, garantindo que o aplicativo funcione offline.

## Componentes Principais

### 1. SyncService (`src/services/syncService.ts`)

Serviço principal responsável por:
- **Sincronização completa**: Baixa todos os hinos da API
- **Verificação de conectividade**: Detecta se há internet disponível
- **Gerenciamento de cache**: Controla validade dos dados locais
- **Callbacks de progresso**: Notifica sobre o progresso da sincronização

#### Métodos Principais:

```typescript
// Sincronização completa com callbacks
static async syncAllHinos(callbacks?: SyncCallbacks)

// Sincronização forçada
static async forceSync(callbacks?: SyncCallbacks)

// Sincronização inteligente (só se necessário)
static async syncIfNeeded(callbacks?: SyncCallbacks)

// Verificação de conectividade
static async checkInternetConnection(): Promise<boolean>

// Sincronização inteligente com verificação de internet
static async smartSync(callbacks?: SyncCallbacks)
```

### 2. SyncStatus (`src/components/SyncStatus.tsx`)

Componente visual que:
- **Mostra status atual**: Dados locais, conectividade, validade do cache
- **Exibe progresso**: Barra de progresso durante sincronização
- **Permite sincronização manual**: Botão para forçar sincronização
- **Feedback visual**: Cores e ícones indicando diferentes estados

#### Estados Visuais:

- 🟡 **Amarelo**: Sem dados locais
- 🔴 **Vermelho**: Dados desatualizados (cache expirado)
- 🟢 **Verde**: Dados atualizados
- ⚪ **Loading**: Sincronizando

### 3. useSync Hook (`src/hooks/useSync.ts`)

Hook personalizado que:
- **Gerencia estado**: Sincronização, progresso, estatísticas
- **Fornece métodos**: Iniciar sincronização, atualizar estatísticas
- **Reutilizável**: Pode ser usado em qualquer componente

#### Interface:

```typescript
interface UseSyncReturn {
  isSyncing: boolean;
  syncProgress: SyncProgress | null;
  syncStats: SyncStats | null;
  startSync: (force?: boolean) => Promise<void>;
  refreshStats: () => Promise<void>;
}
```

## Fluxo de Funcionamento

### 1. Verificação Inicial

```typescript
// Ao abrir o app
const stats = await SyncService.getSyncStats();
if (!stats.hasLocalData) {
  // Mostrar aviso de sincronização necessária
}
```

### 2. Sincronização Automática

```typescript
// Verifica se precisa sincronizar
const needsSync = await SyncService.needsSync();
if (needsSync) {
  // Inicia sincronização automática
  await SyncService.syncIfNeeded();
}
```

### 3. Sincronização Manual

```typescript
// Usuário clica no botão "Sincronizar"
await SyncService.forceSync({
  onProgress: (progress) => {
    // Atualiza barra de progresso
  },
  onComplete: (result) => {
    // Mostra resultado final
  }
});
```

### 4. Uso Offline

```typescript
// ApiService verifica conectividade
const hasInternet = await checkInternetConnection();
if (!hasInternet) {
  // Usa dados locais automaticamente
  const localHinos = await LocalStorageService.loadHinos();
}
```

## Estrutura de Dados

### Cache Local

```typescript
// Chaves do AsyncStorage
const HINOS_STORAGE_KEY = '@harpa_crista_hinos_cache';
const HINOS_LAST_UPDATE_KEY = '@harpa_crista_hinos_last_update';

// Duração do cache: 24 horas
const CACHE_DURATION = 24 * 60 * 60 * 1000;
```

### Estatísticas de Sincronização

```typescript
interface SyncStats {
  hasLocalData: boolean;
  totalHinos: number;
  lastUpdate: Date | null;
  cacheValid: boolean;
}
```

### Progresso da Sincronização

```typescript
interface SyncProgress {
  currentPage: number;
  totalPages: number;
  currentHinos: number;
  totalHinos: number;
  isComplete: boolean;
}
```

## Benefícios

### Para o Usuário:

1. **Funcionamento Offline**: App funciona sem internet
2. **Sincronização Transparente**: Processo automático e visual
3. **Controle Manual**: Pode forçar sincronização quando quiser
4. **Feedback Visual**: Sabe exatamente o status dos dados
5. **Performance**: Dados locais são mais rápidos

### Para o Desenvolvimento:

1. **Arquitetura Limpa**: Separação clara de responsabilidades
2. **Reutilização**: Hook pode ser usado em qualquer lugar
3. **Testabilidade**: Serviços isolados e testáveis
4. **Manutenibilidade**: Código organizado e documentado
5. **Escalabilidade**: Fácil adicionar novas funcionalidades

## Configurações

### Duração do Cache

```typescript
// Em localStorageService.ts
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas
```

### Tamanho das Páginas

```typescript
// Em syncService.ts
const limit = 100; // Hinos por página
```

### Timeout de Requisições

```typescript
// Em api.ts
const API_CONFIG = {
  TIMEOUT: 10000 // 10 segundos
};
```

## Tratamento de Erros

### Cenários de Erro:

1. **Sem Internet**: Usa dados locais ou mostra erro
2. **API Indisponível**: Fallback para dados locais
3. **Erro de Storage**: Limpa cache e tenta novamente
4. **Timeout**: Retry automático com backoff

### Estratégias:

```typescript
// Verificação de conectividade
const hasInternet = await checkInternetConnection();

// Fallback para dados locais
if (!hasInternet) {
  const localData = await LocalStorageService.loadHinos();
  if (localData.length > 0) {
    return localData;
  }
}

// Retry com backoff
for (let attempt = 1; attempt <= maxRetries; attempt++) {
  try {
    return await makeRequest(url);
  } catch (error) {
    if (attempt < maxRetries) {
      await delay(1000 * attempt);
    }
  }
}
```

## Monitoramento

### Logs Importantes:

```typescript
console.log('Iniciando sincronização de hinos...');
console.log(`Baixando página ${pagina} de ${totalPages}...`);
console.log(`Salvando ${hinos.length} hinos no storage local...`);
console.log(`Sincronização concluída! ${totalHinos} hinos salvos localmente.`);
```

### Métricas:

- Total de hinos sincronizados
- Tempo de sincronização
- Taxa de sucesso
- Uso de dados locais vs API

## Próximos Passos

1. **Sincronização Incremental**: Só baixar hinos novos/modificados
2. **Compressão de Dados**: Reduzir tamanho do cache
3. **Sincronização em Background**: Processo automático
4. **Notificações Push**: Avisar sobre atualizações
5. **Múltiplas APIs**: Suporte a diferentes fontes de dados 