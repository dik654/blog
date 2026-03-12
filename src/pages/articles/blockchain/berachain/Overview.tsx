export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Berachain BeaconKit 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Berachain은 <strong>Proof of Liquidity(PoL)</strong> 합의를 사용하는 EVM 호환 블록체인입니다.
          핵심 프레임워크인 <strong>BeaconKit</strong>은 이더리움의 Beacon Chain 스펙을
          CometBFT 위에서 구현한 것으로, 이더리움의 EL+CL 아키텍처를
          가장 직접적으로 Cosmos 생태계에 이식한 프로젝트입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 Beacon Chain vs BeaconKit</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 (Post-Merge)              Berachain (BeaconKit)
┌────────────────────┐          ┌────────────────────┐
│  Beacon Chain      │          │  BeaconKit          │
│  (Lighthouse 등)   │          │  (Cosmos SDK 모듈)   │
│  - Casper FFG      │          │  - CometBFT (합의)   │
│  - LMD-GHOST       │          │  - Beacon 스펙 구현   │
│  - 검증자 관리     │          │  - PoL 검증자 관리    │
├────────────────────┤          ├────────────────────┤
│   Engine API       │          │   Engine API (동일!)  │
├────────────────────┤          ├────────────────────┤
│  Execution Layer   │          │  Execution Layer     │
│  (geth/reth)       │          │  (geth/reth 재활용!)  │
│  - EVM             │          │  - 동일한 EVM         │
└────────────────────┘          └────────────────────┘

핵심 포인트:
  1. Engine API를 통해 이더리움 EL 클라이언트를 그대로 사용
  2. Beacon Chain 스펙(검증자, 슬롯, 에폭)을 Cosmos SDK 모듈로 구현
  3. Casper FFG 대신 CometBFT의 즉시 최종성 사용
  4. PoS 대신 PoL(Proof of Liquidity)로 경제적 보안 확보`}</code>
        </pre>
      </div>
    </section>
  );
}
