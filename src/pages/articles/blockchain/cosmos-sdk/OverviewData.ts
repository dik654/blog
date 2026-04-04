export const ETH_VS_COSMOS_CODE = `이더리움 Execution Layer          Cosmos SDK Application
┌──────────────────────┐        ┌──────────────────────┐
│    JSON-RPC API      │        │    gRPC / REST API    │
├──────────────────────┤        ├──────────────────────┤
│    EVM               │        │    BaseApp            │
│  ┌────────────────┐  │        │  ┌────────────────┐  │
│  │ Smart Contract │  │        │  │  Module 1      │  │
│  │ (Solidity)     │  │        │  │  (bank, staking)│  │
│  ├────────────────┤  │        │  ├────────────────┤  │
│  │ Smart Contract │  │        │  │  Module 2      │  │
│  │ (Vyper)        │  │        │  │  (gov, slashing)│  │
│  └────────────────┘  │        │  └────────────────┘  │
├──────────────────────┤        ├──────────────────────┤
│  State Trie (MPT)    │        │  MultiStore (IAVL)   │
│  LevelDB / PebbleDB  │        │  RocksDB / PebbleDB  │
└──────────────────────┘        └──────────────────────┘
         │                               │
    Engine API                        ABCI
         │                               │
    Consensus Layer                 CometBFT`;

export const ETH_VS_COSMOS_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'API 레이어' },
  { lines: [5, 12] as [number, number], color: 'emerald' as const, note: '실행 레이어 (EVM vs Modules)' },
  { lines: [13, 15] as [number, number], color: 'amber' as const, note: '상태 저장 (MPT vs IAVL)' },
];
