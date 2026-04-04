import type { CodeRef } from '@/components/code/types';
import { r1csCodeRefs } from './codeRefsR1cs';
import { qapCodeRefs } from './codeRefsQap';
import { setupCodeRefs } from './codeRefsSetup';
import { proveCodeRefs } from './codeRefsProve';
import { verifyCodeRefs } from './codeRefsVerify';
import { circuitCodeRefs } from './codeRefsCircuit';

export const codeRefs: Record<string, CodeRef> = {
  ...r1csCodeRefs,
  ...qapCodeRefs,
  ...setupCodeRefs,
  ...proveCodeRefs,
  ...verifyCodeRefs,
  ...circuitCodeRefs,
};
