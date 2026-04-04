export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { blobCodeRefs } from './codeRefsBlob';
import { kzgCodeRefs } from './codeRefsKZG';
import { gasCodeRefs } from './codeRefsGas';

export const codeRefs: Record<string, CodeRef> = {
  ...blobCodeRefs,
  ...kzgCodeRefs,
  ...gasCodeRefs,
};
