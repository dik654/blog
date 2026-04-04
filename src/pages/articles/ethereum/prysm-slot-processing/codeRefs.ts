import type { CodeRef } from '@/components/code/types';
import { slotCodeRefs } from './codeRefsSlot';

export const codeRefs: Record<string, CodeRef> = {
  ...slotCodeRefs,
};
