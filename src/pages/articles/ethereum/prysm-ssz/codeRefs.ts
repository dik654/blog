import type { CodeRef } from '@/components/code/types';
import { packCodeRefs } from './codeRefsPack';
import { merkleCodeRefs } from './codeRefsMerkle';

export const codeRefs: Record<string, CodeRef> = {
  ...packCodeRefs,
  ...merkleCodeRefs,
};
