import type { CodeRef } from '@/components/code/types';
import { operationsCodeRefs } from './codeRefsOperations';
import { blockCodeRefs } from './codeRefsBlock';

export const codeRefs: Record<string, CodeRef> = {
  ...operationsCodeRefs,
  ...blockCodeRefs,
};
