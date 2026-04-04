import type { CodeRef } from '@/components/code/types';

import configGo from './codebase/kubo/config/config.go?raw';
import routingGo from './codebase/kubo/config/routing.go?raw';
import groupsGo from './codebase/kubo/core/node/groups.go?raw';

export const configRefs: Record<string, CodeRef> = {
  'kubo-config-struct': {
    path: 'config/config.go',
    code: configGo,
    lang: 'go',
    highlight: [17, 62],
    desc: 'Config 구조체는 ~/.ipfs/config JSON 파일의 전체 구조입니다. Identity, Routing, Gateway, Swarm 등 모든 설정 섹션을 포함합니다.',
    annotations: [
      { lines: [18, 26], color: 'sky', note: '핵심 — Identity, Datastore, Routing, Gateway' },
      { lines: [28, 34], color: 'emerald', note: '네트워킹 — Swarm, AutoNAT, AutoTLS, Peering' },
      { lines: [38, 51], color: 'amber', note: '부가 — Provide, HTTPRetrieval, Pinning, Bitswap' },
      { lines: [53, 61], color: 'violet', note: '경로 상수 — ~/.ipfs, IPFS_PATH 환경변수' },
    ],
  },
  'kubo-routing-config': {
    path: 'config/routing.go',
    code: routingGo,
    lang: 'go',
    highlight: [34, 55],
    desc: 'Routing 설정 — Type으로 라우팅 모드(auto/dht/delegated/custom)를 선택합니다. DelegatedRouters로 HTTP 라우터 URL을 지정합니다.',
    annotations: [
      { lines: [37, 40], color: 'sky', note: 'Type — auto/dht/delegated/custom 중 선택' },
      { lines: [43, 43], color: 'emerald', note: 'AcceleratedDHTClient — FullRT 모드 활성화' },
      { lines: [50, 51], color: 'amber', note: 'DelegatedRouters — HTTP 라우터 URL 목록' },
      { lines: [53, 54], color: 'violet', note: 'Routers/Methods — custom 모드용 상세 설정' },
    ],
  },
  'kubo-online-groups': {
    path: 'core/node/groups.go',
    code: groupsGo,
    lang: 'go',
    highlight: [308, 369],
    desc: 'Online()은 온라인 모드의 전체 서비스를 조립합니다. Bitswap, Namesys, Peering, LibP2P, Provider를 fx.Options로 묶습니다.',
    annotations: [
      { lines: [345, 348], color: 'sky', note: 'Bitswap 활성화 플래그 — libp2p/HTTP/서버 모드' },
      { lines: [353, 356], color: 'emerald', note: 'Bitswap + OnlineExchange + DNSResolver' },
      { lines: [358, 361], color: 'amber', note: 'Namesys(IPNS) + Peering + Republisher' },
      { lines: [366, 368], color: 'violet', note: 'LibP2P + OnlineProviders 통합' },
    ],
  },
};
