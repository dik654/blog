import type { CodeRef } from '@/components/code/types';
import { g1CodeRefs } from './codeRefsG1';
import { g1AddCodeRefs } from './codeRefsG1Add';
import { g2CodeRefs } from './codeRefsG2';
import { pairingCodeRefs } from './codeRefsPairing';
import { finalExpCodeRefs } from './codeRefsFinalExp';

export const codeRefs: Record<string, CodeRef> = {
  ...g1CodeRefs,
  ...g1AddCodeRefs,
  ...g2CodeRefs,
  ...pairingCodeRefs,
  ...finalExpCodeRefs,
};
