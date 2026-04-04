export const C = { mev: '#ef4444', builder: '#f59e0b', relay: '#8b5cf6', ok: '#10b981', local: '#6366f1' };

export const STEPS = [
  {
    label: 'MEV: 블록 내 TX 순서 조작의 가치',
    body: 'TX 순서 조작으로 추출 가능한 가치(아비트라지, 청산 등)로 검증자 수익과 직결됩니다.',
  },
  {
    label: '문제: 네트워크 건강성 위협',
    body: '샌드위치 공격과 프론트러닝으로 검증자가 직접 MEV 추출 시 네트워크 중앙화가 가속됩니다.',
  },
  {
    label: '문제: 외부 빌더 의존 리스크',
    body: 'mev-boost 릴레이 장애 시 블록 생산이 중단되어 liveness와 검열 저항성이 약화됩니다.',
  },
  {
    label: '해결: PBS (Proposer-Builder Separation)',
    body: 'Proposer와 Builder를 분리하여 경매 방식으로 최고가 블록을 선택합니다.',
  },
  {
    label: '해결: Reth = trait impl 교체로 MEV 통합',
    body: 'PayloadBuilder trait을 교체하여 로컬/외부 비교 후 더 높은 가치를 선택하고 로컬 fallback도 보장합니다.',
  },
];
