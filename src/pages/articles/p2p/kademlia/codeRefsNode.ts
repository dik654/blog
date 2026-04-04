import type { CodeRef } from '@/components/code/types';

import nodeGo from './codebase/go-ethereum/p2p/enode/node.go?raw';

export const nodeRefs: Record<string, CodeRef> = {
  'geth-node-struct': {
    path: 'p2p/enode/node.go',
    code: nodeGo,
    lang: 'go',
    highlight: [38, 49],
    desc: 'Node는 네트워크 호스트를 나타냅니다. ENR 레코드, 32바이트 ID, IP/UDP/TCP 엔드포인트를 보유합니다.',
    annotations: [
      { lines: [38, 49], color: 'sky', note: 'Node — enr.Record + ID + ip/udp/tcp' },
    ],
  },
  'geth-node-id': {
    path: 'p2p/enode/node.go',
    code: nodeGo,
    lang: 'go',
    highlight: [297, 298],
    desc: 'ID는 32바이트(256비트) 노드 고유 식별자입니다. keccak256(secp256k1_pubkey)로 생성됩니다.',
    annotations: [
      { lines: [297, 298], color: 'sky', note: 'ID = [32]byte — 256비트 노드 식별자' },
    ],
  },
  'geth-xor-distance': {
    path: 'p2p/enode/node.go',
    code: nodeGo,
    lang: 'go',
    highlight: [358, 390],
    desc: 'DistCmp는 XOR 거리 비교, LogDist는 log₂(a⊕b) 거리를 계산합니다. 8바이트 단위 BigEndian 최적화로 비교 성능을 높입니다.',
    annotations: [
      { lines: [361, 373], color: 'sky', note: 'DistCmp — 8바이트씩 XOR 비교 (-1/0/1)' },
      { lines: [376, 390], color: 'emerald', note: 'LogDist — LeadingZeros64로 log₂ 거리 계산' },
    ],
  },
};
