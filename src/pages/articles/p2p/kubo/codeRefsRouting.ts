import type { CodeRef } from '@/components/code/types';

import composerGo from './codebase/kubo/routing/composer.go?raw';
import delegatedGo from './codebase/kubo/routing/delegated.go?raw';
import wrapperGo from './codebase/kubo/routing/wrapper.go?raw';

export const routingRefs: Record<string, CodeRef> = {
  'kubo-composer': {
    path: 'routing/composer.go',
    code: composerGo,
    lang: 'go',
    highlight: [19, 70],
    desc: 'Composer는 메서드별 라우터를 분리 조합합니다. FindProviders·Provide·PutValue 등 각각 다른 라우터를 사용할 수 있습니다.',
    annotations: [
      { lines: [19, 25], color: 'sky', note: '5개 라우터 필드 — 역할별 분리' },
      { lines: [27, 35], color: 'emerald', note: 'Provide → ProvideRouter에 위임' },
      { lines: [37, 51], color: 'amber', note: 'ProvideMany — 배치 제공 (ProvideManyRouter 캐스팅)' },
      { lines: [67, 70], color: 'violet', note: 'FindProvidersAsync → FindProvidersRouter에 위임' },
    ],
  },
  'kubo-parse-routing': {
    path: 'routing/delegated.go',
    code: delegatedGo,
    lang: 'go',
    highlight: [41, 73],
    desc: 'Parse는 config의 custom Routing 설정을 Composer로 조립합니다. 메서드별로 라우터를 매핑합니다.',
    annotations: [
      { lines: [46, 47], color: 'sky', note: '라우터 캐시 + Composer 생성' },
      { lines: [50, 69], color: 'emerald', note: '메서드별 라우터 매핑 — provide/find-providers 등' },
    ],
  },
  'kubo-dht-routing': {
    path: 'routing/delegated.go',
    code: delegatedGo,
    lang: 'go',
    highlight: [296, 356],
    desc: 'DHT 라우팅 생성 — AcceleratedDHTClient=true면 FullRT(전체 라우팅 테이블 캐시)를 사용합니다.',
    annotations: [
      { lines: [296, 318], color: 'sky', note: 'dhtRoutingFromConfig — 모드별 분기 (auto/client/server)' },
      { lines: [321, 343], color: 'emerald', note: 'createDHT — public/private 네트워크 분기' },
      { lines: [346, 356], color: 'amber', note: 'createFullRT — BucketSize 20의 가속 DHT' },
    ],
  },
  'kubo-http-routing': {
    path: 'routing/delegated.go',
    code: delegatedGo,
    lang: 'go',
    highlight: [185, 277],
    desc: 'HTTP 위임 라우팅 — cid.contact 등 외부 서비스에 HTTP로 라우팅을 위임합니다.',
    annotations: [
      { lines: [194, 222], color: 'sky', note: 'HTTP 클라이언트 — 커넥션풀 500, 호스트당 100' },
      { lines: [246, 258], color: 'emerald', note: 'drclient.New — 위임 라우팅 클라이언트 생성' },
      { lines: [260, 276], color: 'amber', note: 'ContentRoutingClient — 배치 Provide 지원' },
    ],
  },
  'kubo-http-wrapper': {
    path: 'routing/wrapper.go',
    code: wrapperGo,
    lang: 'go',
    highlight: [1, 31],
    desc: 'ProvideManyRouter 인터페이스와 httpRoutingWrapper입니다. HTTP 라우팅을 routing.Routing으로 래핑합니다.',
    annotations: [
      { lines: [10, 13], color: 'sky', note: 'ProvideManyRouter — Routing + 배치 Provide' },
      { lines: [22, 27], color: 'emerald', note: 'httpRoutingWrapper — 4개 인터페이스 임베딩' },
    ],
  },
};
