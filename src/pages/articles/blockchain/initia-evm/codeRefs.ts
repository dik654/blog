import type { CodeRef } from '@/components/code/types';
import { keeperRefs } from './codeRefsKeeper';
import { stateRefs } from './codeRefsState';
import { contextRefs } from './codeRefsContext';
import { dispatchRefs } from './codeRefsDispatch';
import { cosmosRefs } from './codeRefsCosmos';
import { precompileRefs } from './codeRefsPrecompile';

export const codeRefs: Record<string, CodeRef> = {
  ...keeperRefs,
  ...stateRefs,
  ...contextRefs,
  ...dispatchRefs,
  ...cosmosRefs,
  ...precompileRefs,
};
