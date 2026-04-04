export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { tableRefs } from './codeRefsTable';
import { lookupRefs } from './codeRefsLookup';
import { v4wireRefs } from './codeRefsV4wire';
import { nodeRefs } from './codeRefsNode';

export const codeRefs: Record<string, CodeRef> = {
  ...tableRefs,
  ...lookupRefs,
  ...v4wireRefs,
  ...nodeRefs,
};
