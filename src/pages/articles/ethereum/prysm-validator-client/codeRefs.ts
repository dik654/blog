import type { CodeRef } from '@/components/code/types';
import { validatorCodeRefs } from './codeRefsValidator';

export const codeRefs: Record<string, CodeRef> = {
  ...validatorCodeRefs,
};
