export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { sealCodeRefs } from './codeRefsSeal';
import { postCodeRefs } from './codeRefsPost';
import { graphCodeRefs } from './codeRefsGraph';

export const codeRefs: Record<string, CodeRef> = {
  ...sealCodeRefs,
  ...postCodeRefs,
  ...graphCodeRefs,
};
