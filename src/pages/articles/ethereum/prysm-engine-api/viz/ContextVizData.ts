export const C = { cl: '#8b5cf6', el: '#3b82f6', err: '#ef4444', ok: '#10b981', build: '#f59e0b' };

export const STEPS = [
  {
    label: 'The Merge 이후 구조',
    body: 'CL이 EL을 드라이브하여 체인의 정당한 헤드와 확정 지점을 결정합니다.',
  },
  {
    label: '문제: CL-EL 동기화',
    body: '블록 실행, 체인 헤드 갱신, 페이로드 빌드를 안전하게 동기화해야 합니다.',
  },
  {
    label: '문제: 인증 없이 통신 위험',
    body: 'Engine API 포트 노출 시 가짜 페이로드 주입이 가능하여 JWT 인증이 필수입니다.',
  },
  {
    label: '해결: Engine API 3대 메서드',
    body: 'NewPayload(실행), ForkchoiceUpdated(헤드 갱신), GetPayload(빌드)로 JWT 인증 통신합니다.',
  },
  {
    label: '해결: JWT 인증 + 재시도 전략',
    body: '32바이트 공유 시크릿 JWT + exp 5초 토큰으로 인증하며 타임아웃 시 재시도합니다.',
  },
];
