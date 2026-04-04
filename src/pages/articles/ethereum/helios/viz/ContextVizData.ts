export const C = {
  reth: '#ef4444', helios: '#6366f1', shared: '#10b981',
};

export const STEPS = [
  {
    label: 'Reth: 풀 노드 — 모든 블록을 실행하고 검증',
    body: '전체 상태 트라이(~1TB)를 저장하고 모든 TX를 재실행한다.\n보안은 최고지만, 자원 소비가 크다.',
  },
  {
    label: 'Helios: 경량 클라이언트 — 서명만 검증',
    body: 'Sync Committee BLS 서명으로 블록 헤더만 검증.\nMerkle 증명으로 상태 응답을 검증. 블록 실행 없음.',
  },
  {
    label: '핵심 차이: 실행 vs 서명',
    body: 'Reth: execute_block() → 상태 루트 비교.\nHelios: verify_bls() → 헤더 루트 비교.\n동일한 신뢰 수준, 완전히 다른 비용.',
  },
  {
    label: 'Helios 아키텍처 5단계',
    body: '1. Bootstrap: 체크포인트에서 시작\n2. Consensus: BLS 서명 검증\n3. Update: 헤더 갱신\n4. State: Merkle 증명 검증\n5. Execution: 로컬 EVM (revm)',
  },
];
