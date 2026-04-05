import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Anti-Framework 철학 & 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Commonware — Rust 기반 오픈소스 블록체인 프리미티브 라이브러리
          <br />
          창립자 Patrick O'Grady (Ava Labs VP · Coinbase Rosetta · Avalanche HyperSDK)
        </p>
        <p className="leading-7">
          기존 Cosmos SDK, OP Stack = "프레임워크" — 커스터마이징에 Fork 필수
          <br />
          Commonware = <strong>"Anti-Framework"</strong> — 필요한 컴포넌트만 선택적으로 조합
          <br />
          VM/커널에서 영감 — 특정 애플리케이션에 맞는 프리미티브 조합
        </p>
        <p className="leading-7">
          6개 카테고리:
          <strong> consensus</strong> · <strong>broadcast</strong> · <strong>storage</strong> · <strong>cryptography</strong> · <strong>p2p</strong> · <strong>runtime</strong>
          <br />
          이 아티클은 <strong>Runtime trait이 모든 모듈을 연결하는 방식</strong>에 집중
        </p>
      </div>
      <div className="not-prose mb-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Framework vs Anti-Framework</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Framework 철학 (Cosmos SDK, OP Stack)
// - Opinionated structure
// - Default consensus, networking, storage
// - 전체 스택 채택 강제
// - Customization = fork

// 장점:
// ✓ Fast start (boilerplate 최소)
// ✓ Battle-tested defaults
// ✓ Community support

// 단점:
// ✗ Coupling (모든 모듈 연결됨)
// ✗ Fork overhead (upstream merge 어려움)
// ✗ Flexibility 제한

// Anti-Framework 철학 (Commonware)
// - Primitive library
// - Pick and choose
// - No imposed structure
// - Composition over inheritance

// 장점:
// ✓ 정확히 필요한 것만 사용
// ✓ Fork 불필요 (upgrade 용이)
// ✓ 새로운 디자인 실험 쉬움

// 단점:
// ✗ More boilerplate
// ✗ 통합 디자인 직접 결정
// ✗ 학습 곡선 가파름

// 영감
// - Unix philosophy: small, composable tools
// - Linux kernel: loadable modules
// - LLVM: pass system`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">6 Categories of Primitives</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 1) consensus
//    - Simplex (BFT consensus, 2 round optimal)
//    - Alto (HotStuff-style variant)
//    - Threshold (t-of-n signatures)
//    - Ordered broadcast protocols

// 2) broadcast
//    - Reliable broadcast
//    - Causal broadcast
//    - Atomic broadcast

// 3) storage
//    - Journal (append-only log)
//    - Archive (persistent key-value)
//    - MMR (Merkle Mountain Range)
//    - Freezer (compact archival)

// 4) cryptography
//    - BLS12-381 signatures/aggregation
//    - Ed25519
//    - Poseidon hash
//    - Commitments, MAC

// 5) p2p
//    - Connection manager
//    - Peer discovery
//    - Message routing
//    - Handshake protocols

// 6) runtime
//    - Async task spawning
//    - Timer + clock
//    - Network primitives
//    - File I/O
//    - "OS-like" abstraction

// 사용 예시 조합
// L1 chain: consensus + storage + p2p + runtime
// Oracle: broadcast + cryptography + p2p
// Bridge: consensus + cryptography + storage
// Each app: 자신의 primitive set`}</pre>

      </div>
    </section>
  );
}
