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
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconKit 모듈 아키텍처</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`BeaconKit의 Cosmos 모듈 구조:

┌────────────────────────────────────────────┐
│              CometBFT (합의 엔진)           │
├────────────────────────────────────────────┤
│  ABCI 레이어                                │
├────────────┬────────────┬──────────────────┤
│ x/beacon   │ x/deposit  │ x/reward (PoL)   │
│ 비콘 상태  │ 예치 처리   │ 보상 배분         │
│ 관리       │            │                   │
├────────────┴────────────┴──────────────────┤
│              Engine API Client              │
├────────────────────────────────────────────┤
│           EVM (geth/reth/nethermind)        │
└────────────────────────────────────────────┘

이더리움 Beacon Chain 스펙 구현:
  - BeaconState: 검증자 레지스트리, 잔액, 슬래싱 상태
  - BeaconBlock: EL 페이로드 + BLS 서명 + 검증자 변경
  - DepositContract: EL의 예치 컨트랙트 이벤트 처리
  - 슬롯/에폭 구조: 이더리움과 동일한 타이밍 모델`}</code>
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
