export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Cosmos SDK 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Cosmos SDK는 CometBFT 위에서 동작하는 <strong>모듈식 블록체인 애플리케이션 프레임워크</strong>입니다.
          이더리움에서 EVM이 스마트 컨트랙트 실행 환경을 제공하듯,
          Cosmos SDK는 <strong>모듈(Module)</strong> 기반의 상태 머신을 제공합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 EL vs Cosmos SDK</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`이더리움 Execution Layer          Cosmos SDK Application
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
    Consensus Layer                 CometBFT`}</code>
        </pre>
        <p>
          핵심 차이점: 이더리움은 <strong>범용 VM</strong>(EVM)에서 모든 로직을 실행하지만,
          Cosmos SDK는 <strong>네이티브 Go 코드</strong>로 작성된 모듈이 직접 상태를 변경합니다.
          이는 성능상 큰 이점이 있지만, 이더리움의 스마트 컨트랙트처럼
          누구나 배포할 수 있는 유연성은 부족합니다.
        </p>
      </div>
    </section>
  );
}
