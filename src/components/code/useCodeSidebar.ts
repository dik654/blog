import { useState, useCallback } from 'react';
import type { CodeRef } from './types';

export function useCodeSidebar() {
  const [codeRefKey, setCodeRefKey] = useState<string | null>(null);
  const [codeRef, setCodeRef] = useState<CodeRef | null>(null);

  const open = useCallback((key: string, ref: CodeRef) => {
    setCodeRefKey(key);
    setCodeRef(ref);
  }, []);

  const close = useCallback(() => {
    setCodeRefKey(null);
    setCodeRef(null);
  }, []);

  const navigate = useCallback((key: string, ref: CodeRef) => {
    setCodeRefKey(key);
    setCodeRef(ref);
  }, []);

  return { codeRefKey, codeRef, open, close, navigate };
}
