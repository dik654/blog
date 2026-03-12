export default function PoLArchitecture() {
  return (
    <section id="pol-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of Liquidity & 모듈 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Proof of Liquidity (PoL)</h3>
        <p>
          이더리움의 PoS가 "ETH를 스테이킹하여 보안 제공"이라면,
          Berachain의 PoL은 <strong>"유동성을 제공하여 보안 제공"</strong>입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 PoS vs Berachain PoL:

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
  HONEY = 스테이블코인`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">PoL 플라이휠</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PoL 인센티브 순환 구조:

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
     → 검증자가 인센티브를 위임자에게 공유`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconKit 아키텍처</h3>
        <p>
          BeaconKit은 <strong>표준 Cosmos SDK 모듈을 전혀 사용하지 않습니다</strong>.
          CometBFT만 합의 엔진으로 유지하고, 나머지는 자체 구현입니다.
          이는 Cosmos SDK 모듈의 결합도(coupling)가 BeaconKit의 설계 목표와 맞지 않았기 때문입니다.
          직렬화도 Protobuf 대신 이더리움의 <strong>SSZ(Simple Serialize)</strong>를 사용하여
          EIP-4788(CL 데이터의 EL 검증)을 구현할 수 있었습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`BeaconKit 아키텍처 (Cosmos SDK 모듈 없음!):

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
EIP-4844: Blob 트랜잭션 지원 (proto-danksharding)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">블록 생명주기 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">단계</th>
                <th className="border border-border px-4 py-2 text-left">이더리움</th>
                <th className="border border-border px-4 py-2 text-left">BeaconKit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">블록 제안</td>
                <td className="border border-border px-4 py-2">RANDAO로 선출된 proposer</td>
                <td className="border border-border px-4 py-2">CometBFT 라운드 로빈</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">EL 페이로드</td>
                <td className="border border-border px-4 py-2">engine_forkchoiceUpdated</td>
                <td className="border border-border px-4 py-2">engine_forkchoiceUpdated (동일)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">합의 투표</td>
                <td className="border border-border px-4 py-2">Attestation (비동기 gossip)</td>
                <td className="border border-border px-4 py-2">Prevote/Precommit (동기 BFT)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">최종성</td>
                <td className="border border-border px-4 py-2">2 에폭 (~12.8분)</td>
                <td className="border border-border px-4 py-2">즉시 (1 블록)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">포크</td>
                <td className="border border-border px-4 py-2">가능 (reorg)</td>
                <td className="border border-border px-4 py-2">불가 (BFT safety)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">Optimistic Payload Building</h3>
        <p>
          BeaconKit의 핵심 최적화: 검증자들이 <code>ProcessProposal</code>에서
          이미 StateRoot를 검증하므로 <code>FinalizeBlock</code>은 매우 빠릅니다.
          현재 블록의 StateRoot가 확정 전에 이미 알려지므로,
          <strong>다음 실행 페이로드를 미리 빌드</strong>할 수 있습니다.
          이 최적화로 블록 타임을 <strong>~40% 단축</strong>했습니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Optimistic Payload Building:

이더리움 (순차적):
  블록 N 제안 → 합의 → FinalizeBlock → StateRoot 확정 → 블록 N+1 빌드 시작

BeaconKit (낙관적):
  블록 N 제안 → ProcessProposal에서 StateRoot 검증
                    ↓ (StateRoot 이미 확인됨)
              블록 N+1 페이로드 빌드 시작 (병렬!)
                    ↓
              FinalizeBlock (빠르게 통과) → 블록 N+1 즉시 제안 가능`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (beacon-kit 레포)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`beacon-kit/
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
        └── deposit/            # BeaconDeposit.sol`}</code>
        </pre>
      </div>
    </section>
  );
}
