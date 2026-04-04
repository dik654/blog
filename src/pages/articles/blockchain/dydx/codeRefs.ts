import type { CodeRef } from '@/components/code/types';
import { clobRefs } from './codeRefsClob';
import { indexerRefs } from './codeRefsIndexer';

export const codeRefs: Record<string, CodeRef> = {
  ...clobRefs,
  ...indexerRefs,
};
