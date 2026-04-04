export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { paillierCodeRefs } from './codeRefsPaillier';
import { vssCodeRefs } from './codeRefsVss';
import { dkgCodeRefs } from './codeRefsDkg';

export const codeRefs: Record<string, CodeRef> = {
  ...paillierCodeRefs,
  ...vssCodeRefs,
  ...dkgCodeRefs,
};
