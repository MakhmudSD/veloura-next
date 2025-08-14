// useNotificationWS.ts
import { useEffect, useRef } from 'react';
import type { ApolloClient } from '@apollo/client';

type Params = {
  userId?: string;
  client: ApolloClient<object>;
  onPing?: (p: any) => void;
  token?: string;           // make optional, but we won't connect without it
  path?: string;            // default '/ws'
  hostOverride?: string;    // e.g. 'localhost:3004' if your ws server is on 3004
};

export const useNotificationWS = ({
  userId,
  client,
  onPing,
  token,
  path = '/ws',
  hostOverride,
}: Params) => {
  const wsRef = useRef<WebSocket | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const heartbeatTimerRef = useRef<number | null>(null);
  const backoffRef = useRef(1000); // 1s→2s→4s (cap 15s)

  useEffect(() => {
    // Guard: need both userId and token to connect
    if (!userId || !token) return;

    // Avoid duplicate sockets during HMR/rerenders
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    const host = hostOverride ?? location.host; // allow 3004 via prop
    const safeToken = encodeURIComponent(token);
    const routePath = path.startsWith('/') ? path : `/${path}`;
    const url = `${proto}://${host}${routePath}?token=${safeToken}`;

    let ws: WebSocket | null = new WebSocket(url);
    wsRef.current = ws;

    // Heartbeat (keep-alive)
    const startHeartbeat = () => {
      stopHeartbeat();
      heartbeatTimerRef.current = window.setInterval(() => {
        try {
          if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ kind: 'ping' }));
        } catch {}
      }, 25_000); // 25s is a safe default for many proxies
    };
    const stopHeartbeat = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };

    const scheduleReconnect = () => {
      if (retryTimerRef.current) return;
      const delay = Math.min(backoffRef.current, 15_000);
      retryTimerRef.current = window.setTimeout(() => {
        retryTimerRef.current = null;
        backoffRef.current = Math.min(backoffRef.current * 2, 15_000);
        // Recreate socket with latest refs
        ws = new WebSocket(url);
        wsRef.current = ws;
        attach(ws!);
      }, delay) as unknown as number;
    };

    const attach = (sock: WebSocket) => {
      sock.onopen = () => {
        backoffRef.current = 1000;
        startHeartbeat();
      };

      sock.onmessage = (e) => {
        try {
          const p = JSON.parse(e.data);
          if (p?.kind === 'notification:new') {
            client.refetchQueries({ include: ['GetNotifications'] });
            onPing?.(p);
          }
        } catch {
          // ignore malformed messages
        }
      };

      sock.onerror = () => {
        // let onclose handle the retry
      };

      sock.onclose = (evt) => {
        stopHeartbeat();
        wsRef.current = null;

        // 1000 = normal close; otherwise attempt reconnect
        if (evt.code !== 1000) scheduleReconnect();
      };
    };

    attach(ws);

    return () => {
      stopHeartbeat();
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
      if (wsRef.current) {
        try { wsRef.current.close(1000, 'unmount'); } catch {}
        wsRef.current = null;
      }
    };
    // Reconnect if either userId OR token changes, or you switch host/path
  }, [userId, token, hostOverride, path, client, onPing]);
};
