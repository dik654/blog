export interface RPCLayer {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const RPC_LAYERS: RPCLayer[] = [
  {
    id: 'transport',
    label: 'Transport (hyper)',
    role: 'HTTP/WS 연결 관리',
    details:
      'hyper가 HTTP/1.1, HTTP/2, WebSocket 연결을 처리한다. ' +
      'JSON-RPC는 8545 포트, Engine API는 8551 포트로 분리하여 접근 제어.',
    why: '왜 포트 분리? Engine API는 CL만 접근해야 하므로 JWT 인증이 필수. 외부 RPC와 섞이면 보안 위험.',
    color: '#6366f1',
  },
  {
    id: 'middleware',
    label: 'tower 미들웨어',
    role: '인증·로깅·Rate Limiting',
    details:
      'tower::Service trait으로 미들웨어를 체인한다. JWT 검증 → CORS → Rate Limiting → Logging 순서. ' +
      '각 미들웨어는 독립적으로 교체 가능.',
    why: '왜 tower? hyper, axum, tonic 등 Rust 생태계 전반에서 사용하는 표준 미들웨어 패턴.',
    color: '#0ea5e9',
  },
  {
    id: 'dispatch',
    label: 'jsonrpsee 디스패치',
    role: '메서드 라우팅·실행',
    details:
      '#[rpc(server, namespace = "eth")] 매크로가 컴파일 타임에 라우팅 코드를 생성한다. ' +
      'eth_call → EthApi::call()로 직접 매핑. 런타임 리플렉션 없이 zero-cost.',
    why: '왜 매크로? Geth는 Go 리플렉션으로 런타임 디스패치. Reth는 컴파일 타임에 확정하여 오버헤드 제거.',
    color: '#10b981',
  },
  {
    id: 'handler',
    label: '핸들러 (EthApi)',
    role: '비즈니스 로직 실행',
    details:
      'StateProvider로 상태를 읽고, revm으로 EVM을 실행한다. ' +
      'trait 기반이므로 테스트 시 mock provider를 주입할 수 있다.',
    why: '왜 trait? 실행 레이어를 교체 가능하게 만든다. OP Stack, Arbitrum 등이 커스텀 핸들러를 구현.',
    color: '#f59e0b',
  },
];
