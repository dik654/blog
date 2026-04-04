import type { CodeRef } from '@/components/code/types';
import { mconnRefs } from './codeRefsMConn';
import { switchRefs } from './codeRefsSwitch';
import { peerRefs } from './codeRefsPeer';

export const codeRefs: Record<string, CodeRef> = {
  ...mconnRefs,
  ...switchRefs,
  ...peerRefs,
};
