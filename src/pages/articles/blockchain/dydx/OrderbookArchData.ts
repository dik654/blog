export const clobCode = `CLOB 모듈 디렉토리 구조 (protocol/x/clob/):

├── keeper/      # 상태 관리 및 비즈니스 로직
├── memclob/     # 인메모리 주문서 (MemCLOB)
├── types/       # 데이터 타입 및 인터페이스
├── ante/        # 트랜잭션 전처리
├── rate_limit/  # 속도 제한
├── flags/       # 설정 플래그
├── abci.go      # ABCI 생명주기 메서드
└── module.go    # 모듈 정의

핵심 컴포넌트:
  Keeper     → 상태 관리 및 비즈니스 로직
  MemCLOB    → 인메모리 주문서 구현
  매칭 엔진   → 가격-시간 우선순위 기반 알고리즘
  주문 타입   → Short-Term / Long-Term / Conditional`;

export const clobAnnotations = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '핵심 비즈니스 로직' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: '보조 모듈' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: '핵심 컴포넌트 역할' },
];

export const orderbookCode = `주문서 데이터 구조 (Go 구현):

type Orderbook struct {
  Bids  map[Subticks]*Level   // 가격별 매수 주문
  Asks  map[Subticks]*Level   // 가격별 매도 주문
  BestBid  Subticks           // 최고 매수 가격
  BestAsk  Subticks           // 최저 매도 가격
}

type Level struct {
  LevelOrders  list.List[ClobOrder]  // 시간순 정렬 (FIFO)
}

type Order struct {
  OrderId      OrderId
  Side         Order_Side      // BUY / SELL
  Quantums     uint64          // 주문 수량
  Subticks     uint64          // 가격 (최소 단위)
  TimeInForce  Order_TimeInForce
}`;

export const orderbookAnnotations = [
  { lines: [3, 8] as [number, number], color: 'sky' as const, note: '매수/매도 양방향 주문서' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: '가격 레벨별 FIFO 큐' },
  { lines: [14, 20] as [number, number], color: 'amber' as const, note: '주문 구조체' },
];
