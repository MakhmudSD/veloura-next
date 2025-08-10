// hooks/useUrlSyncedInput.ts
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useUrlSyncedInput<T extends object>(initial: T) {
  const router = useRouter();
  const [input, setInput] = useState<T>(initial);
  const [isHydrated, setIsHydrated] = useState(false);
  const tRef = useRef<number | null>(null);
  const lastStrRef = useRef<string>(''); // last string we pushed to URL

  // Read from URL once it's ready
  useEffect(() => {
    if (!router.isReady) return;
    const raw = typeof router.query.input === 'string' ? router.query.input : '';
    if (raw) {
      try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        setInput(prev => ({ ...prev, ...parsed }));
        lastStrRef.current = JSON.stringify({ ...initial, ...parsed });
      } catch {
        // bad query -> ignore
        lastStrRef.current = JSON.stringify(initial);
      }
    } else {
      lastStrRef.current = JSON.stringify(initial);
    }
    setIsHydrated(true);
    return () => { if (tRef.current) window.clearTimeout(tRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const pushToUrl = useCallback((next: T) => {
    const nextStr = JSON.stringify(next);
    setInput(next);

    // nothing changed? don't touch URL
    if (nextStr === lastStrRef.current) return;

    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => {
      const url = `${router.pathname}?input=${encodeURIComponent(nextStr)}`;
      lastStrRef.current = nextStr; // remember what we wrote
      router.replace(url, undefined, { shallow: true, scroll: false });
    }, 200) as unknown as number;
  }, [router]);

  const updateInput = useCallback((patch: Partial<T>) => {
    pushToUrl({ ...input, ...patch });
  }, [input, pushToUrl]);

  return { input, setInput: pushToUrl, updateInput, isHydrated };
}
