export const polCompareCode = `이더리움 PoS vs Berachain PoL:

이더리움 PoS:
  1. 검증자가 32 ETH 스테이킹
  2. 블록 제안 & 어테스테이션으로 보상
  3. 슬래싱 조건 위반 시 ETH 삭감
  → 보안 = 스테이킹된 ETH 총량

Berachain PoL:
  1. 검증자가 BGT(Bera Governance Token) 스테이킹
  2. 블록 제안 시 BGT 보상을 DeFi 프로토콜에 "배분"
  3. DeFi 프로토콜은 유동성 제공자에게 BGT를 전달
  4. 유동성 제공자가 검증자에게 BGT를 위임
  → 보안 = 네트워크 유동성 총량 (스테이킹 + DeFi TVL)

3토큰 모델:
  BERA  = 가스 토큰 (이더리움의 ETH 역할)
  BGT   = 거버넌스/스테이킹 토큰 (양도 불가, 위임만 가능)
  HONEY = 스테이블코인`;

export const polFlywheelCode = `PoL 인센티브 순환 구조:

사용자 ──→ DeFi 프로토콜에 유동성 제공 ──→ Reward Vault에 스테이킹
  ↑                                              │
  │                                         BGT 보상 수령
  │                                              │
  │                                    검증자에게 BGT 위임 (boost)
  │                                              │
  │         프로토콜이 검증자에게                    ↓
  └── 인센티브 ←── Incentive Marketplace ←── 검증자가 블록 제안 시
                                             BGT를 프로토콜에 배분

핵심: 유동성 제공 → BGT 획득 → 검증자 부스트 → 더 많은 BGT 배출
     → 프로토콜이 유동성을 유치하기 위해 검증자에게 인센티브 제공
     → 검증자가 인센티브를 위임자에게 공유`;

export const beaconKitArchCode = `BeaconKit 아키텍처 (Cosmos SDK 모듈 없음!):

┌────────────────────────────────────────────┐
│              CometBFT (합의 엔진만 사용)     │
├────────────────────────────────────────────┤
│  ABCI 2.0 미들웨어                          │
│  ┌──────────────────────────────────────┐  │
│  │ PrepareProposal → forkchoiceUpdated  │  │
│  │ ProcessProposal → newPayload         │  │
│  │ FinalizeBlock   → 상태 확정           │  │
│  │ Commit          → 다음 블록 준비      │  │
│  └──────────────────────────────────────┘  │
│  BeaconKit 자체 구현:                       │
│  ┌─────────┬──────────┬────────────────┐  │
│  │ Beacon  │ Deposit  │ State          │  │
│  │ State   │ Handler  │ Transition     │  │
│  └─────────┴──────────┴────────────────┘  │
├────────────────────────────────────────────┤
│           Engine API Client                 │
├────────────────────────────────────────────┤
│  EVM (수정 없는 원본 클라이언트!)            │
│  Bera-Geth │ Bera-Reth │ Nethermind │ Besu │
└────────────────────────────────────────────┘

직렬화: SSZ (Protobuf 제거) → EIP-4788 지원
EIP-4844: Blob 트랜잭션 지원 (proto-danksharding)`;

