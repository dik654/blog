import type { CodeRef } from '@/components/code/types';
import { entryPointRefs } from './codeRefsEntryPoint';
import { dilithiumRefs } from './codeRefsDilithium';

export const codeRefs: Record<string, CodeRef> = {
  ...entryPointRefs,
  ...dilithiumRefs,
};
