import type { CodeRef } from '@/components/code/types';
import { attestCodeRefs } from './codeRefsAttest';

export const codeRefs: Record<string, CodeRef> = {
  ...attestCodeRefs,
};
