export const C = { chain: '#6366f1', fork: '#f59e0b', err: '#ef4444', ok: '#10b981', gen: '#8b5cf6' };

export const STEPS = [
  {
    label: '네트워크마다 다른 하드포크 타이밍',
    body: '각 네트워크마다 하드포크 활성화 시점이 상이하여 블록 실행 전 매번 확인이 필요합니다.',
  },
  {
    label: '문제: 활성화 조건이 다양',
    body: 'Block 번호, TTD, Timestamp 세 가지 활성화 방식이 혼재합니다.',
  },
  {
    label: '문제: Geth의 nil 체크 패턴',
    body: 'Geth는 *big.Int 포인터 필드로 선언하여 nil 체크 누락 시 합의 실패 위험이 있습니다.',
  },
  {
    label: '해결: ForkCondition enum',
    body: 'Block/Timestamp/TTD 세 조건을 타입으로 표현하여 컴파일 시점에 잘못된 비교를 포착합니다.',
  },
  {
    label: '해결: ChainSpec + BTreeMap',
    body: 'BTreeMap<Hardfork, ForkCondition>으로 정렬 관리하여 enum variant 추가만으로 새 하드포크를 지원합니다.',
  },
];
