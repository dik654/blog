export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { proposeCodeRef } from './codeRefsPropose';
import { prevoteCodeRef } from './codeRefsPrevote';
import { precommitCodeRef } from './codeRefsPrecommit';
import { commitCodeRef } from './codeRefsCommit';
import { loopCodeRef } from './codeRefsLoop';
import { handleMsgCodeRef } from './codeRefsHandleMsg';
import { receiveCodeRef } from './codeRefsReceive';
import { gossipCodeRef } from './codeRefsGossip';

export const codeRefs: Record<string, CodeRef> = {
  ...proposeCodeRef,
  ...prevoteCodeRef,
  ...precommitCodeRef,
  ...commitCodeRef,
  ...loopCodeRef,
  ...handleMsgCodeRef,
  ...receiveCodeRef,
  ...gossipCodeRef,
};
