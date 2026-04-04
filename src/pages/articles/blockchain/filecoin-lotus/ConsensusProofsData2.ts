export const fvmArchCode = `FVM 아키텍처:

Built-in Actors (시스템 컨트랙트):
  StorageMarketActor  — 딜 관리
  StoragePowerActor   — 파워 테이블
  RewardActor         — 보상 분배
  PaymentChannelActor — 결제 채널

User-defined Actors:
  Rust → WASM 컴파일 → FVM에서 실행
  Solidity → EVM 바이트코드 → FEVM (SputnikVM) → WASM

FEVM (EVM 호환):
  → Hardhat, MetaMask 등 이더리움 도구 그대로 사용
  → SputnikVM (Rust EVM 인터프리터) 위에서 실행

활용 사례:
  DataDAO, 영구 스토리지 (자동 딜 갱신),
  토큰화된 데이터셋, 스토리지 바운티`;

export const lotusRepoCode = `lotus/
├── chain/                    # 체인 동기화 & 상태 관리
│   ├── consensus/            # Expected Consensus
│   ├── store/                # ChainStore (블록 저장)
│   ├── stmgr/                # State Manager
│   └── vm/                   # FVM 실행 환경
├── storage/                  # 스토리지 마이닝
│   ├── sealer/               # 섹터 Sealing (PoRep)
│   ├── wdpost/               # WindowPoSt 스케줄러
│   └── pipeline/             # Sealing 파이프라인
├── markets/                  # 스토리지/검색 마켓
├── node/                     # 노드 구성 & 라이프사이클
├── api/                      # JSON-RPC API
└── extern/
    ├── filecoin-ffi/         # Rust FFI (증명 생성)
    └── sector-storage/       # 섹터 스토리지 관리`;
