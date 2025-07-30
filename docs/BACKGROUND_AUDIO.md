# Reprodução em Segundo Plano - Harpa Cristã

## Visão Geral

Esta implementação permite que o áudio continue tocando quando o usuário sai do app ou navega para outras telas, similar ao comportamento do Spotify e outros players de música.

## Funcionalidades Implementadas

### 1. FloatingPlayer
- Player flutuante que fica sempre visível na parte inferior da tela
- Mostra informações do áudio atual (título, progresso)
- Botão de play/pause
- Barra de progresso visual
- Ao tocar no player, abre o player expandido

### 2. ExpandedPlayer
- Player expandido que aparece como modal
- Interface completa com controles de mídia
- Barra de progresso interativa (seek)
- Controles adicionais (repeat, shuffle, playlist)
- Design similar ao Spotify

### 3. Reprodução em Segundo Plano
- Configuração do `expo-av` para reprodução em segundo plano
- Permissões configuradas no `app.json`
- Hook `useBackgroundAudio` para monitorar mudanças de estado do app
- Serviço `MediaControlsService` para controles de mídia

### 4. Controles de Mídia
- **iOS**: Controles no centro de controle (Control Center)
- **Android**: Notificação persistente com controles de mídia
- Mostra título do hino, artista e artwork
- Controles: play/pause, próximo, anterior, seek
- Integração completa com controles de mídia do sistema

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

### AudioContext
- Configuração do modo de áudio para reprodução em segundo plano
- Integração com controles de mídia
- Gerenciamento de estado de reprodução

## Como Usar

1. **Reproduzir um áudio**: O FloatingPlayer aparecerá automaticamente
2. **Navegar entre telas**: O áudio continua tocando
3. **Sair do app**: O áudio continua em segundo plano
4. **Controles**: Use os controles de mídia do sistema ou o FloatingPlayer
5. **Player expandido**: Toque no FloatingPlayer para abrir controles completos

## Estrutura de Arquivos

```
src/
├── components/
│   ├── FloatingPlayer.tsx      # Player flutuante
│   ├── ExpandedPlayer.tsx      # Player expandido
│   └── MediaNotification.tsx   # Notificações de mídia
├── contexts/
│   └── AudioContext.tsx        # Contexto de áudio atualizado
├── services/
│   ├── mediaControlsService.ts # Serviço de controles de mídia
│   ├── trackPlayerService.ts   # Serviço do TrackPlayer
│   └── trackPlayerEvents.ts    # Eventos do TrackPlayer
└── hooks/
    └── useBackgroundAudio.ts   # Hook para áudio em segundo plano
```

## Dependências

- `expo-av`: Para reprodução de áudio
- `react-native-track-player`: Para controles de mídia do sistema (iOS/Android)
- `@react-native-community/blur`: Para efeitos visuais (opcional)

## Limitações

- No iOS, o áudio pode parar após alguns minutos em segundo plano
- No Android, pode ser necessário configurar notificações persistentes
- Alguns dispositivos podem ter restrições de bateria que afetam a reprodução

## Próximos Passos

1. Implementar controles de mídia mais avançados
2. Adicionar suporte a playlists
3. Implementar cache de áudio offline
4. Adicionar equalizador e efeitos de áudio
5. Implementar sincronização entre dispositivos 