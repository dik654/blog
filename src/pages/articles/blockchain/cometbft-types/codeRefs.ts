import type { CodeRef } from '@/components/code/types';
import { blockRefs } from './codeRefsBlock';
import { voteRefs } from './codeRefsVote';
import { evidenceRefs } from './codeRefsEvidence';

export const codeRefs: Record<string, CodeRef> = {
  ...blockRefs,
  ...voteRefs,
  ...evidenceRefs,
};
