import { coreRefs } from './codeRefsCore';
import { typeRefs } from './codeRefsTypes';
import { peerRefs } from './codeRefsPeer';
import { trackerRefs } from './codeRefsTracker';
import { dhtRefs } from './codeRefsDHT';

export const codeRefs = {
  ...coreRefs,
  ...typeRefs,
  ...peerRefs,
  ...trackerRefs,
  ...dhtRefs,
};
