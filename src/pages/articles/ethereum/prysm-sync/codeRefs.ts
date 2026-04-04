import type { CodeRef } from '@/components/code/types';
import { syncCodeRefs } from './codeRefsSync';

export const codeRefs: Record<string, CodeRef> = {
  ...syncCodeRefs,
};
