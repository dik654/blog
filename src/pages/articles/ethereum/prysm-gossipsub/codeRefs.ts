import type { CodeRef } from '@/components/code/types';
import { gossipsubCodeRefs } from './codeRefsGossipsub';

export const codeRefs: Record<string, CodeRef> = {
  ...gossipsubCodeRefs,
};
