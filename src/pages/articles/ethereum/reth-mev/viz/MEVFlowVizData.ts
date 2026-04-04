export const STEPS = [
  { label: 'MEV 블록 빌딩 흐름', body: 'Searcher→Builder→Relay→Proposer 입찰 경매 방식입니다.' },
  { label: 'Searcher가 MEV 번들 제출', body: '아비트라지/청산 수익 기회를 번들로 Builder에게 전송합니다.' },
  { label: 'Builder가 블록 빌드 후 Relay에 입찰', body: 'TX 순서 최적화 후 SignedBuilderBid를 Relay에 제출합니다.' },
  { label: 'Relay → Proposer 최고가 헤더 전달', body: '입찰 검증 후 블록 가치(value) 포함 헤더를 Proposer에 전달합니다.' },
  { label: 'Proposer: 로컬 vs 외부 비교', body: '더 높은 가치를 선택하고 외부 실패 시 로컬 fallback합니다.' },
  { label: 'Reth vs Geth', body: 'Reth는 PayloadBuilder trait 교체, Geth는 별도 mev-boost sidecar입니다.' },
];

export const C = {
  searcher: '#ef4444',
  builder: '#f59e0b',
  relay: '#8b5cf6',
  proposer: '#10b981',
  local: '#6366f1',
};
