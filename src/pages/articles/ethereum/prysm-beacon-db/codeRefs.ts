import type { CodeRef } from '@/components/code/types';
import { beaconDBCodeRefs } from './codeRefsBeaconDB';

export const codeRefs: Record<string, CodeRef> = {
  ...beaconDBCodeRefs,
};
