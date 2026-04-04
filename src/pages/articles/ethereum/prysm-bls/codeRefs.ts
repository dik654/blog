import type { CodeRef } from '@/components/code/types';
import { signCodeRefs } from './codeRefsSign';
import { verifyCodeRefs } from './codeRefsVerify';

export const codeRefs: Record<string, CodeRef> = {
  ...signCodeRefs,
  ...verifyCodeRefs,
};
