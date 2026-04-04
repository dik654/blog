export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'auction',
    title: 'first-price auction 문제',
    problem: 'EIP-1559 이전, 사용자가 원하는 가격을 입찰했다. 적정가를 알 수 없어 과다 입찰(overpaying)이 빈번했고, 마이너가 입찰가 전부를 가져갔다.',
    solution: '프로토콜이 base fee를 자동으로 결정한다. 사용자는 max_fee와 priority_fee(tip)만 설정한다. base fee는 소각되어 ETH 공급을 줄인다.',
    color: '#ef4444',
  },
  {
    id: 'dynamic',
    title: 'base fee 동적 조정',
    problem: '블록 공간이 혼잡하면 수수료가 급등하고, 한가하면 급락한다. 가격 변동이 예측 불가능하면 지갑 UX와 L2 비용 관리가 어렵다.',
    solution: 'gas_target = gas_limit / 2. 사용률이 50% 초과면 base fee를 최대 12.5% 인상, 미달이면 인하한다. 최대 변동폭이 제한되어 다음 블록 가격을 예측할 수 있다.',
    color: '#f59e0b',
  },
  {
    id: 'u128',
    title: 'Reth의 u128 정수 산술',
    problem: 'Geth는 big.Int(힙 할당, GC 부담)로 계산한다. 초기 동기화 시 수백만 블록의 base fee를 계산해야 하므로 GC 압력이 누적된다.',
    solution: 'Reth는 u128(스택 할당, 오버플로 없음)로 계산한다. base_fee(u64) * gas_delta(u64) 곱셈이 u64 범위를 초과할 수 있으므로 u128로 승격한다.',
    color: '#10b981',
  },
];

export const FEE_COMPONENTS = [
  { label: 'base_fee', desc: '프로토콜이 결정, 소각됨', color: '#6366f1' },
  { label: 'priority_fee (tip)', desc: '사용자가 설정, 검증자에게 지급', color: '#10b981' },
  { label: 'max_fee', desc: '사용자가 설정, 지불 의사 상한', color: '#f59e0b' },
];
