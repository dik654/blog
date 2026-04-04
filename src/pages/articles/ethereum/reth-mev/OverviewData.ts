export interface PBSRole {
  id: string;
  label: string;
  role: string;
  details: string;
  why: string;
  color: string;
}

export const PBS_ROLES: PBSRole[] = [
  {
    id: 'proposer',
    label: 'Proposer (검증자)',
    role: '블록 제안자',
    details:
      'CL이 선택한 슬롯의 검증자. 빌더로부터 받은 블록 헤더에 서명하여 제안한다. ' +
      '블록 내용을 직접 구성하지 않고, 가장 높은 입찰(bid)의 헤더만 서명.',
    why: '왜 직접 빌드 안 하나? MEV 추출에는 전문 인프라가 필요. Proposer는 입찰 선택에만 집중.',
    color: '#6366f1',
  },
  {
    id: 'builder',
    label: 'Builder (블록 빌더)',
    role: 'MEV 최적화 블록 구성',
    details:
      'TX를 수집하고 MEV를 최대화하는 순서로 블록을 구성한다. ' +
      '추출한 MEV의 일부를 Proposer에게 입찰 가치(bid value)로 제공하여 블록 채택을 유도.',
    why: '왜 분리? 특화된 빌더가 더 높은 MEV를 추출 → Proposer에게 더 많은 수수료 전달 → 양쪽 모두 이득.',
    color: '#0ea5e9',
  },
  {
    id: 'relay',
    label: 'Relay (릴레이)',
    role: '중개자 (입찰 에스크로)',
    details:
      '빌더의 입찰을 검증하고 Proposer에게 전달한다. Blinded Block 패턴으로 빌더의 MEV 전략 보호. ' +
      'Proposer가 헤더에 서명한 후에야 실제 블록 바디를 공개.',
    why: '왜 릴레이가 필요? 빌더와 Proposer가 서로를 신뢰하지 않기 때문. 릴레이가 중립적 중개.',
    color: '#10b981',
  },
  {
    id: 'searcher',
    label: 'Searcher (서쳐)',
    role: 'MEV 기회 탐색',
    details:
      'mempool을 모니터링하여 차익거래, 청산, 샌드위치 등 MEV 기회를 탐색한다. ' +
      '발견한 기회를 번들(bundle)로 묶어 빌더에게 제출.',
    why: '왜 별도 역할? MEV 탐색에는 실시간 mempool 분석과 시뮬레이션 인프라가 필요.',
    color: '#f59e0b',
  },
];
