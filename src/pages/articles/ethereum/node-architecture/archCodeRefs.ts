export type { LineNote, CodeRef } from './archCodeRefsTypes';
import type { CodeRef } from './archCodeRefsTypes';
import { clCodeRefs } from './archCodeRefsCL';
import { clInfraCodeRefs } from './archCodeRefsCLInfra';
import { elCoreCodeRefs } from './archCodeRefsELCore';
import { elRpcCodeRefs } from './archCodeRefsELRpc';

export const codeRefs: Record<string, CodeRef> = {
  ...clCodeRefs,
  ...clInfraCodeRefs,
  ...elCoreCodeRefs,
  ...elRpcCodeRefs,
};
