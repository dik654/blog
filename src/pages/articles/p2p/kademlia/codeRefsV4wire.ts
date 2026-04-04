import type { CodeRef } from '@/components/code/types';

import v4wireGo from './codebase/go-ethereum/p2p/discover/v4wire/v4wire.go?raw';
import v4UdpGo from './codebase/go-ethereum/p2p/discover/v4_udp.go?raw';

export const v4wireRefs: Record<string, CodeRef> = {
  'geth-v4wire-packets': {
    path: 'p2p/discover/v4wire/v4wire.go',
    code: v4wireGo,
    lang: 'go',
    highlight: [39, 100],
    desc: 'discv4 패킷 타입 정의입니다. Ping/Pong, Findnode/Neighbors, ENRRequest/ENRResponse 6가지 패킷으로 구성됩니다.',
    annotations: [
      { lines: [39, 46], color: 'sky', note: '6가지 패킷 타입 상수 (iota)' },
      { lines: [50, 58], color: 'emerald', note: 'Ping — Version, From/To, ENRSeq' },
      { lines: [75, 80], color: 'amber', note: 'Findnode — Target(Pubkey) + Expiration' },
      { lines: [83, 88], color: 'violet', note: 'Neighbors — 응답 노드 배열' },
    ],
  },
  'geth-v4-udp': {
    path: 'p2p/discover/v4_udp.go',
    code: v4UdpGo,
    lang: 'go',
    highlight: [67, 83],
    desc: 'UDPv4는 discv4 와이어 프로토콜 구현체입니다. ECDSA 개인키, LocalNode, Table, replyMatcher 채널을 보유합니다.',
    annotations: [
      { lines: [68, 76], color: 'sky', note: 'UDPv4 — conn, privkey, localNode, Table' },
      { lines: [79, 83], color: 'emerald', note: '비동기 채널 — replyMatcher, gotreply' },
    ],
  },
  'geth-v4-listen': {
    path: 'p2p/discover/v4_udp.go',
    code: v4UdpGo,
    lang: 'go',
    highlight: [130, 157],
    desc: 'ListenV4는 UDPv4 서버를 시작합니다. newTable로 라우팅 테이블을 초기화하고 table.loop + readLoop goroutine을 가동합니다.',
    annotations: [
      { lines: [133, 144], color: 'sky', note: 'UDPv4 초기화 — conn, privkey, channels' },
      { lines: [146, 151], color: 'emerald', note: 'newTable로 라우팅 테이블 생성' },
      { lines: [153, 156], color: 'amber', note: 'goroutine: table.loop + readLoop' },
    ],
  },
};
