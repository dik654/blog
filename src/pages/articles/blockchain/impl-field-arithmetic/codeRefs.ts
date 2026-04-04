import type { CodeRef } from '@/components/code/types';
import { helperCodeRefs } from './codeRefsHelpers';
import { fpCodeRefs } from './codeRefsFp';
import { montCodeRefs } from './codeRefsMont';
import { extCodeRefs } from './codeRefsExt';
import { extHigherCodeRefs } from './codeRefsExtHigher';
import { frCodeRefs } from './codeRefsFr';

export const codeRefs: Record<string, CodeRef> = {
  ...helperCodeRefs,
  ...fpCodeRefs,
  ...montCodeRefs,
  ...extCodeRefs,
  ...extHigherCodeRefs,
  ...frCodeRefs,
};
