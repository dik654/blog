export interface MiddlewareLayer {
  id: string;
  name: string;
  target: string;
  desc: string;
  color: string;
}

export const MIDDLEWARE_STACK: MiddlewareLayer[] = [
  {
    id: 'jwt',
    name: 'JWT 인증',
    target: 'Engine API (8551)',
    desc: 'shared secret 기반 JWT 토큰을 검증한다. CL과 EL이 같은 비밀 키를 공유하며, 매 요청마다 토큰의 유효성과 만료 시간을 확인.',
    color: '#ef4444',
  },
  {
    id: 'cors',
    name: 'CORS',
    target: 'JSON-RPC (8545)',
    desc: '브라우저 요청의 Origin 헤더를 검증한다. 허용된 도메인만 접근 가능. DApp이 직접 노드에 접속할 때 필요.',
    color: '#6366f1',
  },
  {
    id: 'rate-limit',
    name: 'Rate Limiting',
    target: 'JSON-RPC (8545)',
    desc: 'IP별 요청 빈도를 제한한다. eth_call 같은 무거운 메서드의 남용을 방지. Governor 알고리즘으로 버스트를 허용하면서 평균 속도를 제어.',
    color: '#f59e0b',
  },
  {
    id: 'logging',
    name: 'Logging',
    target: '전체',
    desc: '요청/응답 메타데이터를 tracing 크레이트로 기록한다. 메서드명, 소요 시간, 에러 코드를 포함. 운영 환경 디버깅에 필수.',
    color: '#10b981',
  },
];

export interface GethVsRethRpc {
  aspect: string;
  geth: string;
  reth: string;
}

export const GETH_VS_RETH_RPC: GethVsRethRpc[] = [
  { aspect: '라우팅', geth: '리플렉션 (런타임)', reth: '매크로 (컴파일 타임)' },
  { aspect: '미들웨어', geth: '커스텀 핸들러', reth: 'tower 미들웨어 스택' },
  { aspect: '타입 안전', geth: 'interface{} 캐스팅', reth: '제네릭 trait 바운드' },
  { aspect: 'WS 지원', geth: '별도 핸들러', reth: 'jsonrpsee 통합 처리' },
];
