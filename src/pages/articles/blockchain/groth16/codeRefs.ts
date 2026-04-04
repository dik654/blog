export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { setupCodeRefs } from './codeRefsSetup';
import { setupVkCodeRefs } from './codeRefsSetupVk';
import { proveCodeRefs } from './codeRefsProve';
import { verifyCodeRefs } from './codeRefsVerify';
import { preparedVkCodeRefs } from './codeRefsPreparedVk';

export const codeRefs: Record<string, CodeRef> = {
  ...setupCodeRefs,
  ...setupVkCodeRefs,
  ...proveCodeRefs,
  ...verifyCodeRefs,
  ...preparedVkCodeRefs,
};
