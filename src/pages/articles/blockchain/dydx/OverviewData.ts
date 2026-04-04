export const archCode = `dYdX v4 전체 아키텍처:

┌─────────────────── External Systems ───────────────────┐
│  외부 거래소           이더리움 네트워크     클라이언트 앱  │
│  (Binance, Coinbase)  (크로스체인 브릿지)   (웹/모바일)   │
└────────┬──────────────────┬─────────────────┬──────────┘
         │                  │                 │
┌────────▼──────────────────▼─────────────────▼──────────┐
│              dYdX v4 Protocol Layer                     │
│  ┌──────────────────┬──────────────┬────────────────┐  │
│  │ Liquidation      │ Price        │ Bridge          │  │
│  │ Daemon           │ Daemon       │ Daemon          │  │
│  ├──────────────────┴──────────────┴────────────────┤  │
│  │           Cosmos SDK Modules                      │  │
│  │  CLOB · Perpetuals · Prices · Subaccounts · Assets│  │
│  ├───────────────────────────────────────────────────┤  │
│  │           CometBFT (Tendermint 합의)               │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │  Kafka (이벤트 스트리밍)
┌──────────────────────▼──────────────────────────────────┐
│              dYdX v4 Indexer Layer                       │
│  ┌────────┬────────┬──────────┬───────┬────────────┐   │
│  │ Ender  │ Vulcan │ Comlink  │ Socks │ Roundtable │   │
│  │온체인   │오프체인 │ REST API │ WS    │ 배치 작업   │   │
│  └────────┴────────┴──────────┴───────┴────────────┘   │
│                    PostgreSQL                           │
└─────────────────────────────────────────────────────────┘`;

export const archAnnotations = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: '외부 데이터 소스 연동' },
  { lines: [10, 13] as [number, number], color: 'emerald' as const, note: 'Daemon 프로세스 (가격/청산/브릿지)' },
  { lines: [15, 16] as [number, number], color: 'amber' as const, note: 'Cosmos SDK 커스텀 모듈' },
  { lines: [22, 26] as [number, number], color: 'rose' as const, note: 'Indexer 마이크로서비스' },
];

export const techStackCode = `Protocol Layer 기술 스택:
  언어: Go 1.22
  프레임워크: Cosmos SDK v0.50.4
  합의 엔진: CometBFT v0.38.5 (즉시 최종성)
  데이터베이스: LevelDB (IAVL 트리 기반 상태 저장)

Indexer Layer 기술 스택:
  언어: TypeScript / Node.js 18+
  데이터베이스: PostgreSQL 14+
  메시지 큐: Apache Kafka 2.6
  API: Express.js 4.18.1
  캐시: Redis 5.0.6
  배포: AWS (ECS, RDS, MSK) + Docker`;

export const techStackAnnotations = [
  { lines: [1, 5] as [number, number], color: 'sky' as const, note: 'Protocol: Go + Cosmos SDK' },
  { lines: [7, 13] as [number, number], color: 'emerald' as const, note: 'Indexer: TypeScript + PostgreSQL' },
];
