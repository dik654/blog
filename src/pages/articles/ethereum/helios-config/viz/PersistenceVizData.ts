/** Persistence Viz — 색상 + 스텝 정의 */

export const C = {
  disk: '#6366f1',     // 보라 — 파일/저장
  load: '#10b981',     // 녹색 — 로드/성공/안전
  rpc: '#3b82f6',      // 파랑 — RPC/네트워크
  warn: '#f59e0b',     // 주황 — fallback/경고
  fail: '#ef4444',     // 빨강 — 실패/위험
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: 'FileDB warm start — 종료 시 저장, 재시작 시 즉시 복원',
    body: 'checkpoint.ssz에 마지막 검증 헤더를 저장한다. 수십 바이트.\n재시작하면 디스크에서 로드 → Beacon API 부트스트랩을 생략한다.\nWeak Subjectivity 기간(~2주) 초과 시 자동 무효화.',
  },
  {
    label: 'MultiRpc fallback — 주 RPC 장애 시 자동 전환, 검증은 유지',
    body: 'fallback_rpcs 목록에서 순차적으로 시도한다.\n모든 응답은 Merkle proof + BLS 서명으로 검증되므로\n악의적 RPC를 사용해도 거짓 데이터를 수용할 수 없다.',
  },
];
