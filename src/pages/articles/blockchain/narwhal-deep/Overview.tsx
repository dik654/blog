import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal DAG 멤풀 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Narwhal (Danezis et al., EuroSys 2022) — <strong>DAG 기반 reliable mempool</strong>.<br />
          모든 validator가 동시 TX batch 제안 → 병렬 처리량 극대화.<br />
          "availability first, ordering later" 철학.
        </p>

        {/* ── Narwhal의 3가지 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal의 3가지 혁신</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">1. DAG-based Mempool</p>
            <p className="text-sm">기존: single-validator local mempool. Narwhal: shared DAG structure — all validators contribute, reliable availability.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">2. Availability/Ordering 분리</p>
            <p className="text-sm">availability: DAG 자체. ordering: 별도 consensus(Bullshark). 각 layer 독립 최적화 + reusable.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">3. Primary-Worker Scaling</p>
            <p className="text-sm">Primary: consensus(lightweight). Worker: data(heavy). worker 개수 조정 → throughput 조절.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-2">성능 (Narwhal paper)</p>
            <p className="text-sm">10 validators + 4 workers: <strong>600K TPS</strong>(mempool, ordering 제외). Bandwidth: 8.5 Gbps. Latency: 2s e2e.</p>
            <p className="text-sm mt-1 text-muted-foreground">비교: Ethereum ~100 TPS / Bitcoin ~7 TPS → 10000x+ improvement.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">사용처 + 이론적 기여</p>
            <p className="text-sm mb-1">Sui(Narwhal+Bullshark→Mysticeti), Aptos(Quorum Store=Narwhal 변형), 다수 L1.</p>
            <p className="text-sm text-muted-foreground">"mempool as consensus" — reliable broadcast primitives + DAG causality 증명 + BFT throughput 상한 돌파.</p>
          </div>
        </div>
        <p className="leading-7">
          Narwhal = <strong>DAG mempool + availability/ordering 분리 + Primary-Worker</strong>.<br />
          600K TPS (mempool), 기존 대비 10000x.<br />
          Sui, Aptos 등 현대 L1의 기반.
        </p>

        {/* ── Narwhal 핵심 concepts ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal 핵심 Concepts</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Batch</p>
            <p className="text-sm">TX 모음(~500KB). worker 생성. digest로 참조.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Header</p>
            <p className="text-sm">round에 validator의 propose. payload = batch digest 리스트. parents = 이전 round <code className="text-xs">2f+1</code> cert 참조.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Certificate</p>
            <p className="text-sm">Header + <code className="text-xs">2f+1</code> signatures. availability 증명. = DAG vertex.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Round</p>
            <p className="text-sm">asynchronous round number. <code className="text-xs">2f+1</code> certs 수신 시 advance. no fixed timeout.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">DAG</p>
            <p className="text-sm">vertices = certificates. edges = parent references. causal history graph.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Reliable Broadcast</p>
            <p className="text-sm">data broadcast → <code className="text-xs">2f+1</code> ack → reliable delivered. "모든 정직 노드가 결국 수신".</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Narwhal Guarantees</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li><strong>Integrity</strong>: delivered data = original</li>
              <li><strong>Agreement</strong>: all honest receive same</li>
              <li><strong>Termination</strong>: eventually delivered</li>
              <li><strong>Efficiency</strong>: <code className="text-xs">O(n)</code> total comms/broadcast</li>
            </ol>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">DAG Invariants + Security</p>
            <p className="text-sm mb-1">각 <code className="text-xs">(author, round)</code> 1 vertex만. parents <code className="text-xs">2f+1</code> certs. acyclic + connected.</p>
            <p className="text-sm text-muted-foreground">Assumptions: <code className="text-xs">f &lt; n/3</code> Byzantine + reliable channels + eventual delivery. <strong>async-safe</strong> — no timing assumption.</p>
          </div>
        </div>
        <p className="leading-7">
          핵심: <strong>Batch → Header → Certificate → DAG</strong>.<br />
          reliable broadcast primitive가 기반.<br />
          async-safe (no timing assumption).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Narwhal이 "availability first"인가</strong> — mempool 관점 전환.<br />
          기존: mempool은 local, consensus에서 TX 유실 가능.<br />
          Narwhal: mempool 자체가 BFT guarantee — TX가 결코 유실 안 됨.<br />
          이것이 consensus 단순화 + throughput 향상 기반.
        </p>
      </div>
    </section>
  );
}
