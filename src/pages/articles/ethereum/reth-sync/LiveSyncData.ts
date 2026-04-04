export interface LiveEvent {
  id: string;
  name: string;
  desc: string;
  color: string;
}

export const LIVE_EVENTS: LiveEvent[] = [
  {
    id: 'committed',
    name: 'ChainCommitted',
    desc: '새 블록이 정상적으로 canonical chain에 추가됨. 블록 데이터 + 상태 변경(BundleState)을 포함하여 ExEx 모듈에 전달.',
    color: '#10b981',
  },
  {
    id: 'reorged',
    name: 'ChainReorged',
    desc: 'reorg 발생. old(제거될 체인)와 new(추가될 체인) 두 체인을 포함. 인덱서는 old 데이터를 롤백하고 new 데이터를 적용해야 한다.',
    color: '#f59e0b',
  },
  {
    id: 'reverted',
    name: 'ChainReverted',
    desc: '블록 되감기. finality 이전 블록이 무효화될 때 발생. 해당 블록의 상태 변경을 되돌려야 한다.',
    color: '#ef4444',
  },
];

export interface ReorgStep {
  step: number;
  title: string;
  desc: string;
}

export const REORG_STEPS: ReorgStep[] = [
  { step: 1, title: '새 블록 수신', desc: '피어로부터 현재 tip보다 높은 블록을 수신한다.' },
  { step: 2, title: '포크 감지', desc: '새 블록의 parent가 현재 canonical chain에 없으면 포크를 감지한다.' },
  { step: 3, title: '공통 조상 탐색', desc: '두 체인이 갈라진 지점(공통 조상)을 찾는다.' },
  { step: 4, title: 'unwind', desc: '공통 조상까지 현재 체인의 상태를 되감는다.' },
  { step: 5, title: '새 체인 적용', desc: '새 체인의 블록을 순서대로 실행하고 canonical으로 설정한다.' },
];
