import type { CodeRef } from '@/components/code/types';
import { engineCodeRefs } from './codeRefsEngine';
import { blockCodeRefs } from './codeRefsBlock';

export const codeRefs: Record<string, CodeRef> = {
  ...engineCodeRefs,
  ...blockCodeRefs,
};
