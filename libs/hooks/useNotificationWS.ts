import { useEffect, useRef } from 'react';
import { ApolloClient } from '@apollo/client';

export const useNotificationWS = ({
  userId, client, onPing,
}: { userId?: string; client: ApolloClient<object>; onPing?: (p:any)=>void }) => {
  const wsRef = useRef<WebSocket|null>(null);

  useEffect(() => {
    if (!userId) return;
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${proto}://${location.host}/?userId=${userId}`);
    wsRef.current = ws;

    ws.onmessage = e => {
      try {
        const p = JSON.parse(e.data);
        if (p?.kind === 'notification:new') {
          client.refetchQueries({ include: ['GetNotifications'] });
          onPing?.(p);
        }
      } catch {}
    };

    return () => { ws.close(); wsRef.current = null; };
  }, [userId]);
};
