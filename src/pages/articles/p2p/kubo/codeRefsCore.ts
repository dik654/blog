import type { CodeRef } from '@/components/code/types';

import coreGo from './codebase/kubo/core/core.go?raw';
import builderGo from './codebase/kubo/core/builder.go?raw';
import nodeBuilderGo from './codebase/kubo/core/node/builder.go?raw';
import groupsGo from './codebase/kubo/core/node/groups.go?raw';

export const coreRefs: Record<string, CodeRef> = {
  'kubo-ipfsnode': {
    path: 'core/core.go',
    code: coreGo,
    lang: 'go',
    highlight: [67, 132],
    desc: 'IpfsNode는 IPFS 인스턴스 전체를 표현하는 핵심 구조체입니다. Blockstore, DAG, Routing, Bitswap 등 모든 서브시스템을 필드로 가집니다.',
    annotations: [
      { lines: [67, 72], color: 'sky', note: 'Self — PeerID + Repo (노드 정체성)' },
      { lines: [74, 93], color: 'emerald', note: 'Local — Pinning, Blockstore, DAG, BlockService' },
      { lines: [97, 123], color: 'amber', note: 'Online — PeerHost, Bitswap, Routing, DHT' },
      { lines: [130, 132], color: 'violet', note: 'IsOnline/IsDaemon 플래그' },
    ],
  },
  'kubo-newnode': {
    path: 'core/builder.go',
    code: builderGo,
    lang: 'go',
    highlight: [61, 135],
    desc: 'NewNode는 uber/fx 의존성 주입으로 IpfsNode를 조립합니다. IPFS() → fx.New() → app.Start() → Bootstrap() 순서로 초기화합니다.',
    annotations: [
      { lines: [66, 69], color: 'sky', note: '취소 전파 차단 — valueContext로 래핑' },
      { lines: [75, 88], color: 'emerald', note: 'fx 옵션 조립 — IPFS() + 플러그인' },
      { lines: [90, 104], color: 'amber', note: 'fx.New + stop 클로저 (종료 시 역순 정리)' },
      { lines: [125, 134], color: 'violet', note: 'app.Start → Bootstrap (온라인 모드만)' },
    ],
  },
  'kubo-buildcfg': {
    path: 'core/node/builder.go',
    code: nodeBuilderGo,
    lang: 'go',
    highlight: [22, 48],
    desc: 'BuildCfg는 노드 생성 옵션입니다. Online/Permanent 플래그, Routing/Host 전략, Repo를 지정합니다.',
    annotations: [
      { lines: [23, 24], color: 'sky', note: 'Online — true면 네트워킹 활성화' },
      { lines: [30, 31], color: 'emerald', note: 'Permanent — 데몬 모드면 블룸 필터 등 활성화' },
      { lines: [37, 39], color: 'amber', note: 'Routing/Host — 라우팅·호스트 전략 함수' },
    ],
  },
  'kubo-ipfs-fx': {
    path: 'core/node/groups.go',
    code: groupsGo,
    lang: 'go',
    highlight: [400, 463],
    desc: 'IPFS()는 전체 의존성 그래프의 루트입니다. Storage → Identity → IPNS → Networked → BlockService → Pinning → Core 순서로 조립합니다.',
    annotations: [
      { lines: [405, 406], color: 'sky', note: 'BuildCfg 기본값 채우기 + Config 추출' },
      { lines: [449, 456], color: 'emerald', note: 'providerStrategy 결정 — "all" / "pinned" / "roots"' },
      { lines: [451, 462], color: 'amber', note: 'fx.Options — Storage→Identity→Networked→Core' },
    ],
  },
};
