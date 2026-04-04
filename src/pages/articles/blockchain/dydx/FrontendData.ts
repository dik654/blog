export const dataFlowCode = `주문 처리 플로우 (클라이언트 → 체결):

클라이언트              Protocol Layer          Kafka         Indexer
    │                       │                   │              │
    ├── 주문 제출 ──────────▶│                   │              │
    │                       ├─ 주문 검증 및 매칭 │              │
    │                       │  (MemCLOB 내부)    │              │
    │                       ├── 체결 이벤트 ─────▶│              │
    │                       │                   ├─ 이벤트 수신 ▶│
    │                       │                   │              ├─ DB 저장
    │                       │                   │  WebSocket ◀─┤
    │◀── 실시간 업데이트 ────┤──────────────────────────────────┤
    │                       │                   │              │

데이터 조회 플로우:
    │                       │                   │              │
    ├── API 요청 ───────────┤───────────────────┤──────────────▶│
    │                       │                   │              ├─ DB 쿼리
    │◀── API 응답 ──────────┤───────────────────┤──────────────┤`;

export const dataFlowAnnotations = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: '주문 제출 → 매칭' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: '이벤트 전파 → 실시간 업데이트' },
  { lines: [16, 19] as [number, number], color: 'amber' as const, note: 'REST API 조회' },
];

export const apiCode = `주요 API 엔드포인트 (Comlink):

주문서 조회:
  GET /v4/orderbooks/perpetualMarket/:ticker
  → { bids: [{price, size}], asks: [{price, size}] }

포지션 조회:
  GET /v4/addresses/:address/subaccountNumber/:number
  → { subaccount, equity, freeCollateral, openPositions }

체결 기록:
  GET /v4/fills?address=...&subaccountNumber=...
  → { fills: [{side, size, price, fee, createdAt}] }

WebSocket 채널 (Socks):
  v4_orderbook  → 실시간 오더북 업데이트
  v4_trades     → 실시간 체결
  v4_markets    → 시장 데이터
  v4_subaccounts → 계정 업데이트`;

export const apiAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '주문서 REST API' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '포지션 조회' },
  { lines: [15, 19] as [number, number], color: 'amber' as const, note: 'WebSocket 실시간 채널' },
];
