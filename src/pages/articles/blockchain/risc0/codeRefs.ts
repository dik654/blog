export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { proverCodeRefs } from './codeRefsProver';
import { sessionCodeRefs } from './codeRefsSession';
import { recursionCodeRefs } from './codeRefsRecursion';

export const codeRefs: Record<string, CodeRef> = {
  ...proverCodeRefs,
  ...sessionCodeRefs,
  ...recursionCodeRefs,
};
