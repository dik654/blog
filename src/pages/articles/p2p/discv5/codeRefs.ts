import type { CodeRef } from '@/components/code/types';
import { udpCodeRefs } from './codeRefsUdp';
import { findNodeCodeRefs } from './codeRefsFindNode';
import { cryptoCodeRefs } from './codeRefsCrypto';

import v5UdpRaw from './codebase/go-ethereum/p2p/discover/v5_udp.go?raw';
import cryptoRaw from './codebase/go-ethereum/p2p/discover/v5wire/crypto.go?raw';
void v5UdpRaw; void cryptoRaw;

export const codeRefs: Record<string, CodeRef> = {
  ...udpCodeRefs,
  ...findNodeCodeRefs,
  ...cryptoCodeRefs,
};
