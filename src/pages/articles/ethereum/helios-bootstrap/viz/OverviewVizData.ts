/** OverviewViz — 색상 상수 + step 정의 */

export const C = {
  reth: '#ef4444',       // Reth 풀노드 (레드)
  helios: '#6366f1',     // Helios 경량 (인디고)
  checkpoint: '#10b981', // 체크포인트 (에메랄드)
  trust: '#f59e0b',      // 신뢰 (앰버)
  verify: '#10b981',     // 검증 (에메랄드)
  danger: '#ef4444',     // 위험 (레드)
  source: '#8b5cf6',     // 소스 (보라)
  loop: '#06b6d4',       // 동기화 루프 (시안)
};

export const STEPS = [
  {
    label: '풀 노드 vs 경량 클라이언트 — 동기화 방식의 차이',
    body: 'Reth는 제네시스부터 수억 블록을 실행. Helios는 체크포인트 하나로 시작.\n같은 목표(현재 상태 접근), 다른 비용.',
  },
  {
    label: '체크포인트 3가지 구성요소 — header + committee + branch',
    body: 'finalized_header(확정 블록 헤더), current_sync_committee(512명 공개키), committee_branch(5개 Merkle 형제 해시).\n이 3가지가 Bootstrap 응답의 전부.',
  },
  {
    label: '신뢰 모델 — 뭘 믿고 뭘 검증하는가',
    body: '신뢰하는 것: 체크포인트 블록 루트(32바이트).\n수학적으로 검증하는 것: Merkle branch, BLS 서명, Merkle-Patricia 증명.',
  },
  {
    label: 'Weak Subjectivity — 체크포인트 유효 기간',
    body: '체크포인트가 너무 오래되면 위원회 검증자가 탈퇴했을 수 있다.\n스펙: ~5.5개월 최대, 실무 2주 이내 권장. 기간 초과 시 nothing-at-stake 공격 가능.',
  },
  {
    label: '체크포인트 소스 — API · 하드코딩 · 사용자',
    body: 'Beacon API(가장 일반적), 하드코딩(소스코드 내장, 만료 가능), 사용자 직접 제공(자체 노드에서 추출 → 신뢰 문제 없음).',
  },
  {
    label: '부트스트랩 완료 후 — sync loop 시작',
    body: 'Store 초기화 후 매 12초 updates 폴링. BLS 서명 검증 → 헤더 갱신 → RPC 사용 가능.\n종료 시 마지막 체크포인트를 FileDB에 저장(warm start).',
  },
];
