import type { CodeRef } from '@/components/code/types';
import { batcherDriverRefs } from './codeRefsBatcherDriver';
import { batcherChannelRefs } from './codeRefsBatcherChannel';

export const batcherCodeRefs: Record<string, CodeRef> = {
  ...batcherDriverRefs,
  ...batcherChannelRefs,
};
