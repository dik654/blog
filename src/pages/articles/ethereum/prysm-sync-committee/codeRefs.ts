import type { CodeRef } from '@/components/code/types';
import { syncCommitteeCodeRefs } from './codeRefsSyncCommittee';

export const codeRefs: Record<string, CodeRef> = {
  ...syncCommitteeCodeRefs,
};
