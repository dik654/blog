import type { CodeRef } from '@/components/code/types';
import { transitionCodeRef } from './codeRefsTransition';
import { evmCodeRef } from './codeRefsEVM';
import { interpreterCodeRef } from './codeRefsInterpreter';
import { opcodeCodeRef } from './codeRefsOpcodes';
import { callBranchesCodeRef } from './codeRefsCallBranches';
import { execDetailCodeRef } from './codeRefsExecDetail';
import { advancedCodeRef } from './codeRefsAdvanced';

export const codeRefs: Record<string, CodeRef> = {
  ...transitionCodeRef,
  ...evmCodeRef,
  ...interpreterCodeRef,
  ...opcodeCodeRef,
  ...callBranchesCodeRef,
  ...execDetailCodeRef,
  ...advancedCodeRef,
};
