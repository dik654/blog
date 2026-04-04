export interface ForkType {
  id: string;
  condition: string;
  era: string;
  examples: string;
  detail: string;
  color: string;
}

export const FORK_TYPES: ForkType[] = [
  {
    id: 'block',
    condition: 'ForkCondition::Block(n)',
    era: 'Frontier ~ Istanbul',
    examples: 'Homestead(1,150,000), London(12,965,000)',
    detail: '블록 번호가 n 이상이면 활성화. ' +
      '초기 이더리움의 모든 하드포크가 이 방식. 블록 생성 간격이 일정하지 않으므로 활성화 시점 예측이 부정확했다.',
    color: '#6366f1',
  },
  {
    id: 'ttd',
    condition: 'ForkCondition::TTD { total_difficulty, .. }',
    era: 'The Merge (Paris)',
    examples: 'Paris(TTD=58,750,000,000,000,000,000,000)',
    detail: '누적 난이도(Total Terminal Difficulty)가 임계값에 도달하면 활성화. ' +
      'PoW에서 PoS로 전환하는 유일한 지점. 도달 후 영구적으로 PoS 모드로 전환된다.',
    color: '#8b5cf6',
  },
  {
    id: 'timestamp',
    condition: 'ForkCondition::Timestamp(ts)',
    era: 'Shanghai ~ 현재',
    examples: 'Shanghai(1681338455), Cancun(1710338135)',
    detail: '블록 타임스탬프가 ts 이상이면 활성화. ' +
      'PoS 전환 후 블록 간격이 12초로 고정되었으므로 활성화 시점을 정확히 예측할 수 있다.',
    color: '#10b981',
  },
];
