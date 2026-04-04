export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { consensusCodeRefs } from './codeRefsConsensus';
import { runtimeCodeRefs } from './codeRefsRuntime';

export const codeRefs: Record<string, CodeRef> = {
  ...consensusCodeRefs,
  ...runtimeCodeRefs,
};
