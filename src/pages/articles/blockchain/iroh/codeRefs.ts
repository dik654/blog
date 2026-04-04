export type { LineNote, CodeRef } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { endpointRefs } from './codeRefsEndpoint';
import { socketRefs } from './codeRefsSocket';
import { protocolRefs } from './codeRefsProtocol';
import { routerRefs } from './codeRefsRouter';
import { connectionRefs } from './codeRefsConnection';
import { discoveryRefs } from './codeRefsDiscovery';

export const codeRefs: Record<string, CodeRef> = {
  ...endpointRefs,
  ...socketRefs,
  ...protocolRefs,
  ...routerRefs,
  ...connectionRefs,
  ...discoveryRefs,
};
