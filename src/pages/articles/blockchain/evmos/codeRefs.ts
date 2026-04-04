import type { CodeRef } from '@/components/code/types';
import { evmRefs } from './codeRefsEvm';
import { ibcRefs } from './codeRefsIbc';

export const codeRefs: Record<string, CodeRef> = {
  ...evmRefs,
  ...ibcRefs,
};
