import RuntimeTraitViz from './viz/RuntimeTraitViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function RuntimeFoundation({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="runtime-foundation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Runtime: 모든 모듈의 기반</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Commonware의 모든 프리미티브는 <strong>Runtime trait 집합</strong> 위에서 동작
          <br />
          Runner → Context 주입 → Context가 Clock + Network + Storage + Spawner + Metrics 제공
        </p>
        <p className="leading-7">
          핵심 설계: <strong>구현체를 교체하면 동일 코드가 다른 환경에서 실행</strong>
          <br />
          <code>tokio::Runner</code> — 프로덕션 (실제 TCP, 파일시스템, SystemTime)
          <br />
          <code>deterministic::Runner</code> — 테스트 (가상 네트워크, 메모리, 시뮬레이션 시간)
        </p>
      </div>
      <div className="not-prose mb-8">
        <RuntimeTraitViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Runtime Trait 집합</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Clock</code> — Time provider</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">fn current(&self) -&gt; SystemTime</code></li>
              <li><code className="text-xs">async fn sleep(&self, duration: Duration)</code></li>
              <li><code className="text-xs">async fn sleep_until(&self, deadline: SystemTime)</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Network</code> — P2P communication</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Associated types: <code className="text-xs">Listener</code>, <code className="text-xs">Connection</code></li>
              <li><code className="text-xs">async fn bind(&self, addr) -&gt; Result&lt;Listener&gt;</code></li>
              <li><code className="text-xs">async fn connect(&self, addr) -&gt; Result&lt;Connection&gt;</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Storage</code> — Persistent data</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Associated type: <code className="text-xs">Blob</code></li>
              <li><code className="text-xs">async fn open(&self, path) -&gt; Result&lt;Blob&gt;</code></li>
              <li><code className="text-xs">async fn remove(&self, path) -&gt; Result&lt;()&gt;</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Spawner</code> — Task spawning</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">fn spawn&lt;F&gt;(&self, f: F) -&gt; JoinHandle&lt;Output&gt;</code></li>
              <li>where <code className="text-xs">F: Future + Send + 'static</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Metrics</code> — Observability</h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code className="text-xs">fn register_counter(&self, name) -&gt; Counter</code></li>
              <li><code className="text-xs">fn register_gauge(&self, name) -&gt; Gauge</code></li>
              <li><code className="text-xs">fn register_histogram(&self, name) -&gt; Histogram</code></li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">Context</code> — 모든 trait 번들</h4>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">Clock + Network + Storage + Spawner + Metrics + Clone + Send + Sync + 'static</code>
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Deterministic Testing</h3>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-3"><code className="text-xs">DeterministicRunner</code> 구조체</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-sm mb-2">필드</h5>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs">seed: u64</code> — 재현 가능한 시드</li>
                <li><code className="text-xs">clock: SimClock</code> — 가상 시간</li>
                <li><code className="text-xs">network: VirtualNetwork</code> — 가상 네트워크</li>
                <li><code className="text-xs">storage: MemStorage</code> — 인메모리 저장소</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-sm mb-2"><code className="text-xs">start</code> 메서드</h5>
              <p className="text-sm text-muted-foreground">
                <code className="text-xs">DeterministicContext</code>를 생성하여 클로저에 주입, <code className="text-xs">executor::block_on</code>으로 동기 실행
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">VirtualNetwork</code></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>No real TCP — message-passing simulation</li>
              <li>Configurable delay/drop</li>
              <li>Reproducible failures</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code className="text-xs">SimClock</code></h4>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>Can fast-forward (가상 시간 점프)</li>
              <li>Controlled concurrency</li>
              <li>Deterministic ordering</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-3">테스트 예시: consensus safety</h4>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside mb-3">
            <li><code className="text-xs">DeterministicRunner::new(seed: 42)</code> 생성</li>
            <li>Byzantine 주입 — <code className="text-xs">runner.network().partition(...)</code></li>
            <li>시간 전진 — <code className="text-xs">runner.clock().advance(60s)</code></li>
            <li><code className="text-xs">simplex::run(ctx, validators)</code> 실행</li>
            <li><code className="text-xs">assert_no_double_commit(outcomes)</code> — safety 검증</li>
          </ol>
          <div className="text-sm">
            <span className="font-medium text-green-600 dark:text-green-400">장점</span>
            <ul className="mt-1 space-y-0.5 text-muted-foreground">
              <li>100% 재현 가능 (seed 기반)</li>
              <li>실시간보다 1000x+ 빠름</li>
              <li>Byzantine 시나리오 주입 쉬움</li>
              <li>CI에서 자동 검증 가능</li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
