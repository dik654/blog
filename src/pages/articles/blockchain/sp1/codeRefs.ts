export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { vmCodeRefs } from './codeRefsVM';
import { execCodeRefs } from './codeRefsExec';
import { opcodeCodeRefs } from './codeRefsOpcode';
import { sdkCodeRefs } from './codeRefsSDK';
import { cpuCodeRefs } from './codeRefsCPU';
import { proverCodeRefs } from './codeRefsProver';

export const codeRefs: Record<string, CodeRef> = {
  ...vmCodeRefs,
  ...execCodeRefs,
  ...opcodeCodeRefs,
  ...sdkCodeRefs,
  ...cpuCodeRefs,
  ...proverCodeRefs,
};
