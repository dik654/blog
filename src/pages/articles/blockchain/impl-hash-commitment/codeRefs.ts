import type { CodeRef } from '@/components/code/types';
import { poseidonCodeRefs } from './codeRefsPoseidon';
import { merkleCodeRefs } from './codeRefsMerkle';
import { circuitCodeRefs } from './codeRefsCircuit';
import { commitmentCodeRefs } from './codeRefsCommitment';

export const codeRefs: Record<string, CodeRef> = {
  ...poseidonCodeRefs,
  ...merkleCodeRefs,
  ...circuitCodeRefs,
  ...commitmentCodeRefs,
};
