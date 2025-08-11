// lib/client.ts
type Listener = (data: any) => void;

export class WSClient {
  private url: string;
  private ws?: WebSocket;
  private listeners = new Map<string, Set<Listener>>();
  private reconnectAttempts = 0;
  private heartbeat?: number;
  private alive = false;
  private _enabled = true;

  constructor(url: string) {
    this.url = url;
  }

  setEnabled(v: boolean) {
    this._enabled = v;
    if (!v) this.close();
  }

  connect(token?: string) {
    if (!this._enabled) return;
    const u = new URL(this.url, window.location.origin);
    if (token) u.searchParams.set('token', token);

    this.ws = new WebSocket(u.toString());
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.startHeartbeat();
      this.emit('open', null);
    };
    this.ws.onmessage = (evt) => {
      // Expect JSON {event:string, ...payload}
      try {
        const msg = JSON.parse(evt.data);
        this.emit(msg.event || 'message', msg);
      } catch {
        // fallback: raw text
        this.emit('message', evt.data);
      }
    };
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.emit('close', null);
      this.scheduleReconnect(token);
    };
    this.ws.onerror = () => {
      // let onclose handle reconnect
    };
  }

  private scheduleReconnect(token?: string) {
    if (!this._enabled) return;
    const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts++)); // 1s -> 32s
    setTimeout(() => this.connect(token), delay);
  }

  private startHeartbeat() {
    this.alive = true;
    this.heartbeat = window.setInterval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
      try {
        this.ws.send(JSON.stringify({ event: 'ping' }));
        // server should reply with {event:'pong'}
        // if no pong within 15s, force reconnect
        setTimeout(() => {
          if (!this.alive) this.ws?.close();
          this.alive = false;
        }, 15000);
      } catch {}
    }, 30000); // every 30s
  }

  acknowledgePong() {
    this.alive = true;
  }

  stopHeartbeat() {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = undefined;
  }

  send(event: string, payload: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ event, ...payload }));
  }

  on(event: string, cb: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
    return () => this.listeners.get(event)!.delete(cb);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  close() {
    this.stopHeartbeat();
    this.ws?.close();
    this.ws = undefined;
  }
}

// singleton (example)
export const socketClient = new WSClient('/ws'); // or your ws endpoint
