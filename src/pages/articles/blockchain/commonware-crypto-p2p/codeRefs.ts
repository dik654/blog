export type { LineNote, CodeRef } from './codeRefsTypes';
import type { CodeRef } from './codeRefsTypes';
import { traitsCodeRefs } from './codeRefsTraits';
import { blsCodeRefs } from './codeRefsBls';
import { schemesCodeRefs } from './codeRefsSchemes';
import { p2pCodeRefs } from './codeRefsP2P';
import { simCodeRefs } from './codeRefsSim';

export const codeRefs: Record<string, CodeRef> = {
  ...traitsCodeRefs,
  ...blsCodeRefs,
  ...schemesCodeRefs,
  ...p2pCodeRefs,
  ...simCodeRefs,
};
