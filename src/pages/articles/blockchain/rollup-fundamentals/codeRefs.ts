export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { derivationCodeRefs } from './codeRefsDerivation';
import { batcherCodeRefs } from './codeRefsBatcher';
import { faultCodeRefs } from './codeRefsFault';

export const codeRefs: Record<string, CodeRef> = {
  ...derivationCodeRefs,
  ...batcherCodeRefs,
  ...faultCodeRefs,
};
