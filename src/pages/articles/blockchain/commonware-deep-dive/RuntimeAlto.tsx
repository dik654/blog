import RuntimeAltoViz from './viz/RuntimeAltoViz';

export default function RuntimeAlto() {
  return (
    <section id="runtime-alto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결정론적 시뮬레이션 & 채택 현황</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <strong>결정론적 시뮬레이션</strong> — Commonware 품질 보증의 핵심
          <br />
          동일 시드 → 동일 실행 순서 (네트워크 파티션, 비잔틴 장애, 링크 손실 포함)
          <br />
          디버거에서 단계별 실행 · 완전 재현 · 모든 커밋에서 자동 실행 · 90%+ 커버리지
        </p>
        <p className="leading-7">
          <strong>채택 현황</strong>:
          Tempo — simplex + broadcast + storage 사용, 테스트넷 운영 중
          <br />
          Bridge 예제 — threshold_simplex + p2p + bls12381 조합 데모
          <br />
          <strong>향후 로드맵</strong>:
          QMDB 통합 · 추가 프리미티브 · MCP 서버(LLM 개발자 경험)
        </p>
      </div>
      <div className="not-prose mb-8"><RuntimeAltoViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Deterministic Simulation 방법론</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">일반 테스트 문제</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Real concurrency — 비결정적</li>
              <li>Random network delays</li>
              <li>OS scheduling 영향</li>
              <li>버그 재현 불가</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">Deterministic Simulation 해결</h4>
            <ol className="text-sm space-y-0.5 text-muted-foreground list-decimal list-inside">
              <li>Virtual time — <code className="text-xs">SimClock</code></li>
              <li>Virtual network — message passing</li>
              <li>Virtual storage — in-memory</li>
              <li>Controlled concurrency</li>
            </ol>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-3">시뮬레이션 예시: Byzantine consensus test</h4>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside mb-3">
            <li>1000개 시드에 대해 <code className="text-xs">Simulator::new(seed)</code> 반복</li>
            <li>4 validators 생성, node 3을 Byzantine으로 지정 — <code className="text-xs">sim.mark_byzantine(3)</code></li>
            <li>Byzantine 행동 주입 — <code className="text-xs">delay_messages_from(3, jitter)</code>, <code className="text-xs">drop_messages_from(3, 0.3)</code></li>
            <li>가상 5분간 실행 — <code className="text-xs">sim.run_until(300s)</code></li>
            <li>Safety 검증 — <code className="text-xs">assert_no_conflicts(committed)</code></li>
          </ol>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h5 className="font-semibold text-sm mb-1 text-green-600 dark:text-green-400">이점</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>1000 seeds x 5분 = 5000분 virtual time</li>
                <li>실제로는 ~10분 real time — 500x speedup</li>
                <li>100% 재현 가능 (seed 기반)</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-1 text-muted-foreground">Coverage Metrics</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>Line / Branch coverage</li>
                <li>Network state coverage</li>
                <li>Byzantine behavior coverage</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Commonware 채택 현황 (2024)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2">Tempo <span className="text-muted-foreground font-normal">(flagship chain)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Simplex consensus</li>
              <li>Ordered broadcast for DA</li>
              <li>QMDB for state</li>
              <li>Testnet live (2024)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Alto <span className="text-muted-foreground font-normal">(consensus variant)</span></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>HotStuff-inspired</li>
              <li>Deterministic simulation tested</li>
              <li>Reference implementation</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Bridge Example</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>BLS12-381 threshold signatures</li>
              <li>Cross-chain state verification</li>
              <li><code className="text-xs">p2p::authenticated</code> communication</li>
              <li>Demo deployment</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Ecosystem Adoption</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><strong className="text-foreground">Avalanche HyperSDK</strong> — predecessor</li>
              <li>Custom L1 projects</li>
              <li>Research papers referencing</li>
              <li>Academic collaborations</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Roadmap (2024-2025)</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>QMDB production integration</li>
              <li>More consensus variants — HotStuff-2, Mysticeti</li>
              <li>MCP server for LLM development</li>
              <li>Additional primitives — DA, execution</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Open source: <code className="text-xs">github.com/commonwarexyz/monorepo</code> — Rust-first
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
