import type { CodeRef } from '@/components/code/types';
import { codeRefsBroadcaster } from './codeRefsBroadcaster';
import { codeRefsOrdered } from './codeRefsOrdered';
import { codeRefsCoding } from './codeRefsCoding';

export const codeRefs: Record<string, CodeRef> = {
  ...codeRefsBroadcaster,
  ...codeRefsOrdered,
  ...codeRefsCoding,
};
