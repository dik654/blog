export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { vmCodeRefs } from './codeRefsVm';
import { manifestCodeRefs } from './codeRefsManifest';
import { kmsCodeRefs } from './codeRefsKms';
import { attestCodeRefs } from './codeRefsAttest';

export const codeRefs: Record<string, CodeRef> = {
  ...vmCodeRefs,
  ...manifestCodeRefs,
  ...kmsCodeRefs,
  ...attestCodeRefs,
};
