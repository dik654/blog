export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { worldSwitchCodeRefs } from './codeRefsWorldSwitch';
import { taSessionCodeRefs } from './codeRefsTASession';
import { keysCodeRefs } from './codeRefsKeys';
import { keysInitCodeRefs } from './codeRefsKeysInit';

export const codeRefs: Record<string, CodeRef> = {
  ...worldSwitchCodeRefs,
  ...taSessionCodeRefs,
  ...keysCodeRefs,
  ...keysInitCodeRefs,
};
