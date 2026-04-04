import type { CodeRef } from '@/components/code/types';
import { rlpCodeRefs } from './codeRefsRlp';
import { primCodeRefs } from './codeRefsPrimitives';
import { keccakBloomCodeRefs } from './codeRefsKeccakBloom';

export const codeRefs: Record<string, CodeRef> = {
  ...rlpCodeRefs,
  ...primCodeRefs,
  ...keccakBloomCodeRefs,
};
