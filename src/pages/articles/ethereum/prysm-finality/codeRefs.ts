import type { CodeRef } from '@/components/code/types';
import { finalityCodeRefs } from './codeRefsFinality';

export const codeRefs: Record<string, CodeRef> = {
  ...finalityCodeRefs,
};
