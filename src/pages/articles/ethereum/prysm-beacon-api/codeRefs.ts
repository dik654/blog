import type { CodeRef } from '@/components/code/types';
import { rpcCodeRefs } from './codeRefsRpc';
import { handlersCodeRefs } from './codeRefsHandlers';

export const codeRefs: Record<string, CodeRef> = {
  ...rpcCodeRefs,
  ...handlersCodeRefs,
};
