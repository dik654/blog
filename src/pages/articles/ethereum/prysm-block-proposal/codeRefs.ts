import type { CodeRef } from '@/components/code/types';
import { proposerCodeRefs } from './codeRefsProposer';
import { committeeCodeRefs } from './codeRefsCommittee';

export const codeRefs: Record<string, CodeRef> = {
  ...proposerCodeRefs,
  ...committeeCodeRefs,
};
