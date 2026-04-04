export interface OrderingDetail {
  name: string;
  key: string;
  detail: string;
  color: string;
}

export const ORDERING_IMPLS: OrderingDetail[] = [
  {
    name: 'CoinbaseTipOrdering (기본)',
    key: 'effective_tip_per_gas(base_fee)',
    detail: 'effective_tip = min(max_priority_fee, max_fee - base_fee)를 U256으로 변환한다. 팁이 높은 TX가 best_transactions() 이터레이터에서 먼저 나온다. 검증자 수익을 극대화하는 합리적 기본값이다.',
    color: '#10b981',
  },
  {
    name: 'MEV 번들 정렬 (커스텀)',
    key: '번들 수익 / 번들 가스 사용량',
    detail: 'Flashbots rbuilder 같은 MEV 빌더가 trait을 구현한다. 개별 TX의 tip보다 번들 전체의 수익/가스 비율로 정렬한다. Geth는 이 교체가 불가능해 포크가 필요하다.',
    color: '#f59e0b',
  },
  {
    name: '특정 주소 우선 정렬 (커스텀)',
    key: '화이트리스트 주소 → 최고 우선순위',
    detail: '사설 네트워크나 L2에서 특정 시퀀서 주소의 TX를 항상 먼저 처리할 수 있다. trait의 priority() 메서드만 오버라이드하면 된다.',
    color: '#6366f1',
  },
];

export interface OrderingComparison {
  aspect: string;
  geth: string;
  reth: string;
}

export const ORDERING_COMPARISON: OrderingComparison[] = [
  { aspect: '정렬 기준', geth: 'gas price 기반 하드코딩', reth: 'TransactionOrdering trait' },
  { aspect: 'MEV 빌더 통합', geth: '포크 필요 (mev-geth)', reth: 'trait 구현체 교체' },
  { aspect: '우선순위 키 타입', geth: 'big.Int', reth: 'U256 (고정 크기, 스택)' },
  { aspect: '정렬 변경 영향', geth: 'core/txpool 코드 수정', reth: '별도 crate로 주입' },
];
