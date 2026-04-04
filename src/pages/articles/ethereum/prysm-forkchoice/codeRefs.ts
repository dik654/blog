import type { CodeRef } from '@/components/code/types';
import { storeCodeRefs } from './codeRefsStore';
import { forkchoiceCodeRefs } from './codeRefsForkchoice';

export const codeRefs: Record<string, CodeRef> = {
  ...storeCodeRefs,
  ...forkchoiceCodeRefs,
};
