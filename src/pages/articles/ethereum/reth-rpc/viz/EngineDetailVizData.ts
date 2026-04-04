export const C = { fcu: '#6366f1', new: '#10b981', get: '#f59e0b', cl: '#8b5cf6', el: '#0ea5e9' };

export const STEPS = [
  {
    label: 'forkchoice_updated — head/safe/finalized 갱신',
    body: 'CL이 canonical chain의 head를 지정\nhead/safe/finalized 3개 포인터 갱신\npayload_attributes가 있으면 블록 빌드 시작',
  },
  {
    label: 'new_payload — 새 블록 EVM 실행',
    body: 'CL이 새 블록 페이로드를 전달\nEL이 revm으로 모든 TX 실행\n상태 루트 검증 → VALID/INVALID 응답',
  },
  {
    label: 'get_payload — 빌드된 블록 반환',
    body: 'CL이 블록 제안 시점에 호출\nEL이 빌드한 실행 페이로드를 반환\n이 블록이 네트워크에 전파됨',
  },
  {
    label: 'JWT 인증 — shared secret',
    body: 'Engine API 전용 포트(8551)\njwt.hex 파일의 shared secret으로 인증\n외부 접근 차단 — CL만 호출 가능',
  },
];
