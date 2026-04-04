export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { coreCodeRefs } from './codeRefsCore';
import { rangeCodeRefs } from './codeRefsRange';

export const codeRefs: Record<string, CodeRef> = {
  ...coreCodeRefs,
  ...rangeCodeRefs,
};
