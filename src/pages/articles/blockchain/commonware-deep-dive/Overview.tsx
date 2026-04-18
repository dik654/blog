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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-base mb-3">Framework 철학 (Cosmos SDK, OP Stack)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground mb-3">
              <li>Opinionated structure</li>
              <li>Default consensus, networking, storage</li>
              <li>전체 스택 채택 강제</li>
              <li>Customization = fork</li>
            </ul>
            <div className="text-sm mb-2">
              <span className="font-medium text-green-600 dark:text-green-400">장점</span>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                <li>Fast start — boilerplate 최소</li>
                <li>Battle-tested defaults</li>
                <li>Community support</li>
              </ul>
            </div>
            <div className="text-sm">
              <span className="font-medium text-red-600 dark:text-red-400">단점</span>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                <li>Coupling — 모든 모듈 연결됨</li>
                <li>Fork overhead — upstream merge 어려움</li>
                <li>Flexibility 제한</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-base mb-3">Anti-Framework 철학 (Commonware)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground mb-3">
              <li>Primitive library</li>
              <li>Pick and choose</li>
              <li>No imposed structure</li>
              <li>Composition over inheritance</li>
            </ul>
            <div className="text-sm mb-2">
              <span className="font-medium text-green-600 dark:text-green-400">장점</span>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                <li>정확히 필요한 것만 사용</li>
                <li>Fork 불필요 — upgrade 용이</li>
                <li>새로운 디자인 실험 쉬움</li>
              </ul>
            </div>
            <div className="text-sm">
              <span className="font-medium text-red-600 dark:text-red-400">단점</span>
              <ul className="mt-1 space-y-0.5 text-muted-foreground">
                <li>More boilerplate</li>
                <li>통합 디자인 직접 결정</li>
                <li>학습 곡선 가파름</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">설계 영감</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><strong className="text-foreground">Unix philosophy</strong> — small, composable tools</li>
            <li><strong className="text-foreground">Linux kernel</strong> — loadable modules</li>
            <li><strong className="text-foreground">LLVM</strong> — pass system</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">6 Categories of Primitives</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">1. consensus</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">Simplex</code> — BFT, 2 round optimal</li>
              <li><code className="text-xs">Alto</code> — HotStuff-style variant</li>
              <li><code className="text-xs">Threshold</code> — t-of-n signatures</li>
              <li>Ordered broadcast protocols</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">2. broadcast</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Reliable broadcast</li>
              <li>Causal broadcast</li>
              <li>Atomic broadcast</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">3. storage</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">Journal</code> — append-only log</li>
              <li><code className="text-xs">Archive</code> — persistent key-value</li>
              <li><code className="text-xs">MMR</code> — Merkle Mountain Range</li>
              <li><code className="text-xs">Freezer</code> — compact archival</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">4. cryptography</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>BLS12-381 signatures/aggregation</li>
              <li>Ed25519</li>
              <li>Poseidon hash</li>
              <li>Commitments, MAC</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">5. p2p</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Connection manager</li>
              <li>Peer discovery</li>
              <li>Message routing</li>
              <li>Handshake protocols</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">6. runtime</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Async task spawning</li>
              <li>Timer + clock</li>
              <li>Network primitives</li>
              <li>File I/O</li>
              <li>"OS-like" abstraction</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">사용 예시 조합</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div><strong className="text-foreground">L1 chain</strong> <span className="text-muted-foreground">— consensus + storage + p2p + runtime</span></div>
            <div><strong className="text-foreground">Oracle</strong> <span className="text-muted-foreground">— broadcast + cryptography + p2p</span></div>
            <div><strong className="text-foreground">Bridge</strong> <span className="text-muted-foreground">— consensus + cryptography + storage</span></div>
            <div><strong className="text-foreground">Custom app</strong> <span className="text-muted-foreground">— 자신의 primitive set</span></div>
          </div>
        </div>

      </div>
    </section>
  );
}
