import type { CodeRef } from '@/components/code/types';
import { epochCodeRefs } from './codeRefsEpoch';
import { rewardCodeRefs } from './codeRefsReward';

export const codeRefs: Record<string, CodeRef> = {
  ...epochCodeRefs,
  ...rewardCodeRefs,
};
