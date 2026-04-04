import type { CodeRef } from '@/components/code/types';
import { rnnCodeRefs } from './codeRefsRnn';
import { lstmCodeRefs } from './codeRefsLstm';
import { normCodeRefs } from './codeRefsNorm';
import { dropCodeRefs } from './codeRefsDrop';
import { embedCodeRefs } from './codeRefsEmbed';

export const codeRefs: Record<string, CodeRef> = {
  ...rnnCodeRefs,
  ...lstmCodeRefs,
  ...normCodeRefs,
  ...dropCodeRefs,
  ...embedCodeRefs,
};
