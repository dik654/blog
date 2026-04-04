import type { CodeRef } from '@/components/code/types';
import { abciRefs } from './codeRefsAbci';
import { haloRefs } from './codeRefsHalo';

export const codeRefs: Record<string, CodeRef> = {
  ...abciRefs,
  ...haloRefs,
};
