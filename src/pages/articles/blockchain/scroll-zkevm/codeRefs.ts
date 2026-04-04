export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { evmCodeRefs } from './codeRefsEvm';
import { gadgetCodeRefs } from './codeRefsGadget';

export const codeRefs: Record<string, CodeRef> = {
  ...evmCodeRefs,
  ...gadgetCodeRefs,
};
