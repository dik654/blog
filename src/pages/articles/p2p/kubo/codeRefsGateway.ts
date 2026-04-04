import type { CodeRef } from '@/components/code/types';

import gatewayGo from './codebase/kubo/core/corehttp/gateway.go?raw';
import corehttpGo from './codebase/kubo/core/corehttp/corehttp.go?raw';

export const gatewayRefs: Record<string, CodeRef> = {
  'kubo-gateway-option': {
    path: 'core/corehttp/gateway.go',
    code: gatewayGo,
    lang: 'go',
    highlight: [33, 58],
    desc: 'GatewayOption은 /ipfs/, /ipns/ 경로를 처리하는 HTTP 핸들러를 등록합니다. boxo/gateway의 Handler를 CORS·OTel로 감쌉니다.',
    annotations: [
      { lines: [34, 38], color: 'sky', note: 'Config + Headers 로딩' },
      { lines: [40, 48], color: 'emerald', note: 'Backend 생성 → Handler 생성 → CORS·OTel 래핑' },
      { lines: [52, 54], color: 'amber', note: '경로 등록 — /ipfs/, /ipns/ 등' },
    ],
  },
  'kubo-gateway-backend': {
    path: 'core/corehttp/gateway.go',
    code: gatewayGo,
    lang: 'go',
    highlight: [140, 189],
    desc: 'newGatewayBackend은 BlocksBackend를 생성합니다. NoFetch=true면 오프라인 모드로 로컬 블록만 서빙합니다.',
    annotations: [
      { lines: [146, 149], color: 'sky', note: '기본 모드 — BlockService + Routing + Namesys' },
      { lines: [151, 178], color: 'emerald', note: 'NoFetch=true → 오프라인 교환기 + 오프라인 리졸버' },
      { lines: [180, 188], color: 'amber', note: 'gateway.NewBlocksBackend — 최종 백엔드 생성' },
    ],
  },
  'kubo-gateway-config': {
    path: 'core/corehttp/gateway.go',
    code: gatewayGo,
    lang: 'go',
    highlight: [375, 417],
    desc: 'getGatewayConfig은 Gateway 섹션의 설정을 boxo/gateway.Config으로 변환합니다. PublicGateways, 응답 포맷, 타임아웃 등을 설정합니다.',
    annotations: [
      { lines: [382, 393], color: 'sky', note: 'gateway.Config — 직렬화 응답, 타임아웃, 동시 요청 수' },
      { lines: [396, 396], color: 'emerald', note: 'localhost 서브도메인 게이트웨이 (기본값)' },
      { lines: [399, 414], color: 'amber', note: 'PublicGateways 순회 — nil이면 삭제, 아니면 변환' },
    ],
  },
  'kubo-serve-option': {
    path: 'core/corehttp/corehttp.go',
    code: corehttpGo,
    lang: 'go',
    highlight: [26, 55],
    desc: 'ServeOption은 HTTP 핸들러를 체인으로 조합하는 패턴입니다. MakeHandler가 옵션들을 순서대로 적용하여 최종 핸들러를 만듭니다.',
    annotations: [
      { lines: [30, 30], color: 'sky', note: 'ServeOption — mux를 받아 mux를 반환하는 함수 타입' },
      { lines: [34, 43], color: 'emerald', note: 'MakeHandler — 옵션 체인 적용' },
      { lines: [44, 53], color: 'amber', note: 'CONNECT 메서드 처리 + topMux.ServeHTTP' },
    ],
  },
};
