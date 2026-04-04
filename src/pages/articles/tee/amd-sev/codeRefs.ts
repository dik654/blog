export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { snpCodeRefs } from './codeRefsSNP';
import { pvalidateCodeRefs } from './codeRefsPvalidate';
import { attestCodeRefs } from './codeRefsAttest';

export const codeRefs: Record<string, CodeRef> = {
  ...snpCodeRefs,
  ...pvalidateCodeRefs,
  ...attestCodeRefs,
};
