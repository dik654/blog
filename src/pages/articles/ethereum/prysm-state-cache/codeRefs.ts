import type { CodeRef } from '@/components/code/types';
import { stateCacheCodeRefs } from './codeRefsStateCache';

export const codeRefs: Record<string, CodeRef> = {
  ...stateCacheCodeRefs,
};
