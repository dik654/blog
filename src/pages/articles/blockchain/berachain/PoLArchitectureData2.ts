export const optimisticPayloadCode = `Optimistic Payload Building:

이더리움 (순차적):
  블록 N 제안 → 합의 → FinalizeBlock → StateRoot 확정 → 블록 N+1 빌드 시작

BeaconKit (낙관적):
  블록 N 제안 → ProcessProposal에서 StateRoot 검증
                    ↓ (StateRoot 이미 확인됨)
              블록 N+1 페이로드 빌드 시작 (병렬!)
                    ↓
              FinalizeBlock (빠르게 통과) → 블록 N+1 즉시 제안 가능`;

export const codeStructureCode = `beacon-kit/
├── mod/                        # 핵심 모듈
│   ├── consensus/              # 합의 타입 (BeaconBlock 등)
│   ├── beacon/                 # Beacon 상태 관리
│   │   └── blockchain/         # 블록 처리 & 상태 전이
│   ├── execution/              # Engine API 클라이언트
│   │   ├── client/             # geth/reth 연결
│   │   └── deposit/            # 예치 처리
│   ├── payload/                # EL 페이로드 빌드
│   │   └── builder/            # 페이로드 빌더
│   └── state-transition/       # 상태 전이 함수
│       ├── core/               # processSlot, processBlock
│       └── verify/             # 서명 검증
├── mod/runtime/                # ABCI 런타임
│   └── middleware/             # PrepareProposal, ProcessProposal
└── contracts/                  # Solidity 컨트랙트
    └── src/
        └── deposit/            # BeaconDeposit.sol`;

export type BlockLifecycleRow = {
  stage: string;
  ethereum: string;
  beaconKit: string;
};

export const blockLifecycleRows: BlockLifecycleRow[] = [
  { stage: '블록 제안', ethereum: 'RANDAO로 선출된 proposer', beaconKit: 'CometBFT 라운드 로빈' },
  { stage: 'EL 페이로드', ethereum: 'engine_forkchoiceUpdated', beaconKit: 'engine_forkchoiceUpdated (동일)' },
  { stage: '합의 투표', ethereum: 'Attestation (비동기 gossip)', beaconKit: 'Prevote/Precommit (동기 BFT)' },
  { stage: '최종성', ethereum: '2 에폭 (~12.8분)', beaconKit: '즉시 (1 블록)' },
  { stage: '포크', ethereum: '가능 (reorg)', beaconKit: '불가 (BFT safety)' },
];
