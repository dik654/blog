export const xmsgCode = `크로스체인 통신 비교:

이더리움 L1 경유:
  Rollup A → L1 → Rollup B  (수 시간~수일)
  (fraud proof / validity proof 대기)

Omni XMsg:
  Rollup A → Omni 검증자 어테스테이션 → Rollup B  (수 초)

  XMsg 흐름:
  1. 소스 체인에서 이벤트 발생 (Solidity portal contract)
  2. Omni 검증자가 이벤트를 관찰 & 어테스테이션 (cross-chain attestation)
  3. 릴레이어가 어테스테이션을 목적지 체인에 제출
  4. 목적지 체인의 portal contract가 검증 & 실행

  확인 전략 선택:
  - "Finalized": 롤업 TX가 L1에 최종화된 후 전달 (~12분, reorg 불가)
  - "Latest":    L2 시퀀서 포함 즉시 전달 (~5-10초, reorg 가능성)

  → Cosmos IBC와 유사하지만, EVM 롤업 전용으로 최적화
  → 현재 Ethereum L1, Arbitrum, Optimism, Base 지원
     (이더리움 생태계 TVL의 90% 이상 커버)`;

export const repoStructureCode = `omni/
├── octane/                # Octane 엔진 (CometBFT + EVM 통합)
│   └── evmengine/         # ABCI ↔ Engine API 어댑터
│       ├── abci.go        # PrepareProposal, ProcessProposal
│       └── enginecl.go    # Engine API 클라이언트
├── halo/                  # 합의 레이어
│   ├── app/               # Cosmos SDK 앱
│   ├── attest/            # 크로스체인 어테스테이션 모듈
│   └── valsync/           # 검증자 동기화
├── contracts/             # Solidity 컨트랙트
│   ├── portal/            # XMsg 포털 (각 롤업에 배포)
│   └── avs/               # EigenLayer AVS 통합
├── relayer/               # 크로스체인 릴레이어
└── lib/                   # 공통 라이브러리
    └── xchain/            # XMsg 타입 & 인코딩`;
