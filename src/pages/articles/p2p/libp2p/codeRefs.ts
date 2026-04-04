export type { CodeRef, LineNote } from '@/components/code/types';
import type { CodeRef } from '@/components/code/types';
import { swarmCodeRefs } from './codeRefsSwarm';
import { swarmCodeRefs2 } from './codeRefsSwarm2';
import { behaviourCodeRefs } from './codeRefsBehaviour';
import { behaviourCodeRefs2 } from './codeRefsBehaviour2';
import { transportCodeRefs } from './codeRefsTransport';
import { transportCodeRefs2 } from './codeRefsTransport2';
import { noiseCodeRefs } from './codeRefsNoise';
import { yamuxCodeRefs } from './codeRefsYamux';
import { gossipsubCodeRefs } from './codeRefsGossipsub';
import { gossipsubCodeRefs2 } from './codeRefsGossipsub2';
import { quicCodeRefs } from './codeRefsQuic';

export const codeRefs: Record<string, CodeRef> = {
  ...swarmCodeRefs,
  ...swarmCodeRefs2,
  ...behaviourCodeRefs,
  ...behaviourCodeRefs2,
  ...transportCodeRefs,
  ...transportCodeRefs2,
  ...noiseCodeRefs,
  ...yamuxCodeRefs,
  ...gossipsubCodeRefs,
  ...gossipsubCodeRefs2,
  ...quicCodeRefs,
};
