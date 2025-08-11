import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  from,
} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { onError } from '@apollo/client/link/error';

import { getJwtToken } from '../libs/auth';
import { socketVar } from './store';
import { sweetErrorAlert } from '../libs/sweetAlert';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/* ----------------------------- Auth helpers ----------------------------- */
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {};
  const token = getJwtToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

/* ----------------- Native WS init (singleton, no cleanup) ---------------- */
let wsInitialized = false;
function initAppWebSocketOnce() {
  if (typeof window === 'undefined' || wsInitialized) return;

  // Expect: REACT_APP_API_WS=ws://localhost:3004  (no trailing slash)
  const base = (process.env.REACT_APP_API_WS || 'ws://localhost:3004').trim();
  // Ensure path is /ws and token is appended
  const origin = base.replace(/\/+$/, '');
  const token = getJwtToken() || '';
  const url = `${origin}/ws${token ? `?token=${encodeURIComponent(token)}` : ''}`;

  const ws = new WebSocket(url);
  socketVar(ws); // expose to the app

  ws.addEventListener('open', () => console.log('[WS] open', url));
  ws.addEventListener('message', (e) => {
    // Just log here; Chat component already attaches its own onmessage handler
    try {
      console.log('[WS] msg', JSON.parse(e.data));
    } catch {
      console.log('[WS] msg', e.data);
    }
  });
  ws.addEventListener('close', (e) => {
    console.log('[WS] close', e.code, e.reason);
    wsInitialized = false; // allow re-init after a full reload
  });
  ws.addEventListener('error', (e) => console.log('[WS] error', e));

  wsInitialized = true;
}

/* ------------------------------ Apollo links ------------------------------ */
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, ...getHeaders() },
  }));
  console.warn('requesting.. ', operation);
  return forward(operation!);
});

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_API_GRAPHQL_URL || 'http://localhost:3004/graphql',
}) as unknown as ApolloLink;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => {
      if (!message?.includes('input')) sweetErrorAlert(message);
    });
  }
  if (networkError) console.log('[Network error]:', networkError);
});

/* ---------------------------- Apollo client init --------------------------- */
function createApolloClient() {
  if (typeof window !== 'undefined') {
    // Open native ws once (separate from Apollo)
    initAppWebSocketOnce();
  }

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    resolvers: {},
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) _apolloClient.cache.restore(initialState);
  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
}
