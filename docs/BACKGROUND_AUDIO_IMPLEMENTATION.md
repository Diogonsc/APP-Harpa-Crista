# Implementação de Reprodução em Segundo Plano - Harpa Cristã

## Visão Geral

Esta implementação permite que o áudio continue tocando quando o usuário sai do app ou navega para outras telas, similar ao comportamento do Spotify e outros players de música, com notificações de mídia completas.

## Funcionalidades Implementadas

### 1. Notificações de Mídia
- **Android**: Notificação persistente com controles de mídia
- **iOS**: Controles no centro de controle (Control Center)
- Mostra título do hino, artista e artwork
- Controles: play/pause, próximo, anterior, seek
- Integração completa com controles de mídia do sistema

### 2. FloatingPlayer
- Player flutuante que fica sempre visível na parte inferior da tela
- Mostra informações do áudio atual (título, progresso)
- Botões de play/pause, próximo e anterior
- Barra de progresso visual
- Ao tocar no player, abre o player expandido

### 3. ExpandedPlayer
- Player expandido que aparece como modal
- Interface completa com controles de mídia
- Barra de progresso interativa (seek)
- Controles adicionais (repeat, shuffle, playlist)
- Design similar ao Spotify

### 4. Reprodução em Segundo Plano
- Configuração do `react-native-track-player` para reprodução em segundo plano
- Permissões configuradas no `app.json`
- Hook `useBackgroundAudio` para monitorar mudanças de estado do app
- Serviço `TrackPlayerService` para controles de mídia

## Configurações Necessárias

### app.json
```json
{
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["audio"]
    }
  },
  "android": {
    "permissions": [
      "WAKE_LOCK",
      "android.permission.MODIFY_AUDIO_SETTINGS"
    ]
  }
}
```

### index.js
```javascript
import TrackPlayer from 'react-native-track-player';

// Registrar o serviço do TrackPlayer
TrackPlayer.registerPlaybackService(() => require('./src/services/trackPlayerEvents').PlaybackService);
```

## Estrutura de Arquivos

```
src/
├── components/
│   ├── FloatingPlayer.tsx      # Player flutuante com controles
│   ├── ExpandedPlayer.tsx      # Player expandido
│   └── MediaNotification.tsx   # Gerenciamento de notificações
├── contexts/
│   └── AudioContext.tsx        # Contexto de áudio integrado com TrackPlayer
├── services/
│   ├── trackPlayerService.ts   # Serviço principal do TrackPlayer
│   ├── trackPlayerEvents.ts    # Eventos e controles remotos
│   └── audioService.ts         # Serviço de áudio (legado)
└── hooks/
    └── useBackgroundAudio.ts   # Hook para áudio em segundo plano
```

## Como Funciona

### 1. Inicialização
- O `TrackPlayer` é configurado no `index.js`
- O `AudioContext` inicializa o `TrackPlayerService`
- Os eventos são configurados para responder a controles remotos

### 2. Reprodução de Áudio
- Quando um áudio é reproduzido, o `TrackPlayer` adiciona a track
- Metadados são configurados (título, artista, artwork)
- Notificação de mídia aparece automaticamente

### 3. Controles Remotos
- Controles de mídia do sistema (notificação, fones de ouvido, etc.)
- Controles no FloatingPlayer e ExpandedPlayer
- Todos sincronizados através do `AudioContext`

### 4. Reprodução em Segundo Plano
- Áudio continua tocando quando app vai para segundo plano
- Notificação persistente permite controle sem abrir o app
- Estado é mantido entre navegações

## Dependências

- `react-native-track-player`: Para controles de mídia do sistema
- `expo-av`: Para reprodução de áudio (legado, mantido para compatibilidade)
- `@react-native-community/blur`: Para efeitos visuais (opcional)

## Limitações e Considerações

### iOS
- O áudio pode parar após alguns minutos em segundo plano
- Necessário configurar `UIBackgroundModes: ["audio"]`
- Controles aparecem no Control Center

### Android
- Notificação persistente com controles de mídia
- Pode ser necessário configurar notificações persistentes
- Alguns dispositivos podem ter restrições de bateria

## Próximos Passos

1. Implementar playlist automática
2. Adicionar suporte a equalizador
3. Implementar cache de áudio offline
4. Adicionar sincronização entre dispositivos
5. Implementar histórico de reprodução

## Troubleshooting

### Problema: Notificação não aparece
- Verificar se `react-native-track-player` está instalado
- Confirmar configurações no `app.json`
- Verificar permissões no Android

### Problema: Áudio para em segundo plano
- Verificar configuração `staysActiveInBackground: true`
- Confirmar permissões de áudio
- Verificar configurações de bateria do dispositivo

### Problema: Controles não funcionam
- Verificar se eventos estão registrados corretamente
- Confirmar integração com `AudioContext`
- Verificar logs para erros de TrackPlayer 