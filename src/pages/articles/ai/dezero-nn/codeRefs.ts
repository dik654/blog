import type { CodeRef } from '@/components/code/types';
import { modelCodeRefs } from './codeRefsModel';
import { linearCodeRefs } from './codeRefsLinear';
import { activationCodeRefs } from './codeRefsActivation';
import { optimizerCodeRefs } from './codeRefsOptimizer';
import { lossCodeRefs } from './codeRefsLoss';

export const codeRefs: Record<string, CodeRef> = {
  ...modelCodeRefs,
  ...linearCodeRefs,
  ...activationCodeRefs,
  ...optimizerCodeRefs,
  ...lossCodeRefs,
};
