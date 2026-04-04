export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { baseAppCodeRefs } from './codeRefsBaseApp';
import { abciCodeRefs } from './codeRefsABCI';
import { runMsgsCodeRefs } from './codeRefsRunMsgs';
import { bankCodeRefs } from './codeRefsBank';
import { bankMsgCodeRefs } from './codeRefsBankMsg';
import { runTxCodeRefs } from './codeRefsRunTx';
import { finalizeBlockCodeRefs } from './codeRefsFinalizeBlock';
import { msgRouterCodeRefs } from './codeRefsMsgRouter';
import { storeCodeRefs } from './codeRefsStore';
import { moduleCodeRefs } from './codeRefsModule';
import { proposalCodeRefs } from './codeRefsProposal';

export const codeRefs: Record<string, CodeRef> = {
  ...baseAppCodeRefs,
  ...abciCodeRefs,
  ...runMsgsCodeRefs,
  ...bankCodeRefs,
  ...bankMsgCodeRefs,
  ...runTxCodeRefs,
  ...finalizeBlockCodeRefs,
  ...msgRouterCodeRefs,
  ...storeCodeRefs,
  ...moduleCodeRefs,
  ...proposalCodeRefs,
};
