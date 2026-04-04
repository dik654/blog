export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { coreRefs } from './codeRefsCore';
import { bitswapRefs } from './codeRefsBitswap';
import { routingRefs } from './codeRefsRouting';
import { gatewayRefs } from './codeRefsGateway';
import { gcRefs } from './codeRefsGC';
import { configRefs } from './codeRefsConfig';

export const codeRefs: Record<string, CodeRef> = {
  ...coreRefs,
  ...bitswapRefs,
  ...routingRefs,
  ...gatewayRefs,
  ...gcRefs,
  ...configRefs,
};
