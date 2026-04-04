export const C = { rpc: '#6366f1', err: '#ef4444', ok: '#10b981', engine: '#f59e0b', mw: '#8b5cf6' };

export const STEPS = [
  {
    label: '지갑, DApp, 인프라가 노드와 통신',
    body: '잔액 조회, TX 전송, 블록 구독 등 모든 외부 상호작용이 JSON-RPC를 경유합니다.',
  },
  {
    label: '문제: 수십 개 메서드 라우팅',
    body: 'eth_, net_, debug_, engine_ 등 네임스페이스별 라우팅과 타입 불일치 감지가 필요합니다.',
  },
  {
    label: '문제: CL Engine API + 보안',
    body: 'CL과의 Engine API는 JWT 인증 필수이며 12초 블록 시간 내 응답해야 합니다.',
  },
  {
    label: '해결: jsonrpsee + #[rpc] 매크로',
    body: '#[rpc] 매크로가 컴파일 타임에 라우팅 코드를 생성하여 타입 오류를 컴파일 시점에 발견합니다.',
  },
  {
    label: '해결: tower 미들웨어 스택',
    body: 'JWT 인증 → CORS → Rate Limiting → Logging을 tower 미들웨어로 계층적 적용합니다.',
  },
];
