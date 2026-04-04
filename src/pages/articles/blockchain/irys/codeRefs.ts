export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { vdfRefs } from './codeRefsVdf';
import { packingRefs } from './codeRefsPacking';
import { p2pRefs } from './codeRefsP2p';
import { apiRefs } from './codeRefsApi';

export const codeRefs: Record<string, CodeRef> = {
  ...vdfRefs,
  ...packingRefs,
  ...p2pRefs,
  ...apiRefs,
};
