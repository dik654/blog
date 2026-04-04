import type { CodeRef } from '@/components/code/types';
import { overviewRefs } from './codeRefsOverview';
import { mmrRefs } from './codeRefsMmr';
import { qmdbRefs } from './codeRefsQmdb';

export const codeRefs: Record<string, CodeRef> = {
  ...overviewRefs,
  ...mmrRefs,
  ...qmdbRefs,
};
