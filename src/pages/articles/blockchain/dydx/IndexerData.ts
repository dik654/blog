export const indexerCode = `Indexer Layer 마이크로서비스:

┌─────────────────────────────────────────────────┐
│                   Apache Kafka                   │
│              (이벤트 스트리밍 플랫폼)             │
└───────┬───────────────┬─────────────────────────┘
        │               │
┌───────▼───────┐ ┌─────▼──────────┐
│    Ender      │ │    Vulcan      │
│  온체인 이벤트 │ │  오프체인 이벤트 │
│  처리 & 아카이브│ │  처리 & 아카이브 │
└───────┬───────┘ └─────┬──────────┘
        │               │
┌───────▼───────────────▼──────────────────────────┐
│               PostgreSQL 14+                      │
│           (중앙 데이터베이스)                      │
└───────┬──────────────────────┬────────────────────┘
        │                      │
┌───────▼──────┐   ┌──────────▼──────┐
│  Comlink     │   │  Socks          │
│  REST API    │   │  WebSocket      │
│  (Express.js)│   │  (실시간 스트림) │
└──────────────┘   └─────────────────┘

Roundtable: 배치 작업 (캔들스틱, 통계 집계, 데이터 정리)`;

export const indexerAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'Kafka: 이벤트 분배' },
  { lines: [8, 12] as [number, number], color: 'emerald' as const, note: 'Ender/Vulcan: 이벤트 처리' },
  { lines: [14, 17] as [number, number], color: 'amber' as const, note: 'PostgreSQL: 통합 저장' },
  { lines: [19, 24] as [number, number], color: 'rose' as const, note: 'API/WebSocket: 클라이언트 서빙' },
];

export const schemaCode = `주요 테이블 스키마:

-- Orders 테이블
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  subaccountId UUID REFERENCES subaccounts(id),
  clobPairId BIGINT NOT NULL,
  side ENUM('BUY', 'SELL') NOT NULL,
  size DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  status ENUM('OPEN','FILLED','CANCELED','BEST_EFFORT_CANCELED'),
  type ENUM('LIMIT','MARKET','STOP_LIMIT','STOP_MARKET',...),
  timeInForce ENUM('GTT','FOK','IOC','POST_ONLY')
);

-- Fills 테이블 (체결 기록)
CREATE TABLE fills (
  id UUID PRIMARY KEY,
  subaccountId UUID REFERENCES subaccounts(id),
  side ENUM('BUY', 'SELL'),
  liquidity ENUM('TAKER', 'MAKER'),
  size DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  fee DECIMAL NOT NULL
);

-- 복합 인덱스 (성능 최적화)
CREATE INDEX ON orders (clobPairId, side, price);
CREATE INDEX ON fills (subaccountId, createdAt);`;

export const schemaAnnotations = [
  { lines: [4, 14] as [number, number], color: 'sky' as const, note: 'Orders: 주문 상태 추적' },
  { lines: [17, 25] as [number, number], color: 'emerald' as const, note: 'Fills: 체결 기록' },
  { lines: [28, 29] as [number, number], color: 'amber' as const, note: '복합 인덱스 최적화' },
];
