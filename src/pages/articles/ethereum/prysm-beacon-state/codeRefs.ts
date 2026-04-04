import type { CodeRef } from '@/components/code/types';
import { beaconStateCodeRefs } from './codeRefsBeaconState';
import { hasherCodeRefs } from './codeRefsHasher';

export const codeRefs: Record<string, CodeRef> = {
  ...beaconStateCodeRefs,
  ...hasherCodeRefs,
};
