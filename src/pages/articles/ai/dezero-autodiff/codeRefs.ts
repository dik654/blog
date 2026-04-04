import type { CodeRef } from '@/components/code/types';
import { varCodeRefs } from './codeRefsVar';
import { fnCodeRefs } from './codeRefsFn';
import { opsCodeRefs } from './codeRefsOps';
import { bwdCodeRefs } from './codeRefsBwd';
import { guardCodeRefs } from './codeRefsGuard';

export const codeRefs: Record<string, CodeRef> = {
  ...varCodeRefs,
  ...fnCodeRefs,
  ...opsCodeRefs,
  ...bwdCodeRefs,
  ...guardCodeRefs,
};
