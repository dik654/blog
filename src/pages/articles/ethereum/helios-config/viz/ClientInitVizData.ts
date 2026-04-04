/** ClientInit Viz — 색상 + step 정의 */

export const C = {
  build: '#6366f1',    // 인디고 — build() 파이프라인
  spec: '#8b5cf6',     // 보라 — ConsensusSpec
  ckpt: '#3b82f6',     // 파랑 — 체크포인트
  disk: '#10b981',     // 에메랄드 — FileDB / 성공
  rpc: '#3b82f6',      // 파랑 — RPC
  warn: '#f59e0b',     // 앰버 — 경고 / fallback
  fail: '#ef4444',     // 빨강 — 실패
  muted: '#94a3b8',    // 회색 — 비활성
};

export const STEPS = [
  {
    label: 'build() 4단계 — 검증 → Spec → 체크포인트 → 모듈 초기화',
    body: '필수 필드 3개를 검증한 뒤 네트워크에 맞는 ConsensusSpec을 생성한다.\n체크포인트는 3단계 우선순위로 결정하고, 마지막에 Consensus/Execution 모듈을 초기화.',
  },
  {
    label: '체크포인트 우선순위 — 사용자 > FileDB > 하드코딩',
    body: '사용자 지정 체크포인트가 최우선. 없으면 FileDB에서 이전 값 로드.\n둘 다 없으면 소스 코드 하드코딩 값 사용 — 빌드 시점 기준이라 만료 위험.',
  },
  {
    label: 'FileDB warm/cold start — 32B로 즉시 복원 vs 하드코딩 위험',
    body: 'warm start: 종료 시 32B 저장 → 재시작 시 로드 → 즉시 부트스트랩.\ncold start: FileDB 없음 → 하드코딩 사용 → WS 초과 시 재요청 필요.\nReth 700GB vs Helios 32B — 모바일에서도 영속성 가능.',
  },
  {
    label: 'Multi-RPC fallback — Primary 실패 시 자동 전환, 모든 응답 검증',
    body: 'Primary RPC에 먼저 요청. 실패하면 fallback 목록을 순차 시도.\n어떤 RPC 응답이든 MPT + BLS 검증을 통과해야 사용 — 악성 RPC도 무해.',
  },
];
