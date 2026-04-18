import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bullshark 순서화 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Bullshark (Spiegelman et al., CCS 2022) — <strong>Narwhal DAG 위 ordering consensus</strong>.<br />
          wave(2 rounds) 단위 anchor 선정 + causal history commit.<br />
          partial sync 2-round fast path + async 4-round fallback.
        </p>

        {/* ── Bullshark의 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark의 이론적 기여</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Bullshark 3가지 기여</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Optimal amortized latency</p>
                <p className="text-muted-foreground">partial sync: 2 rounds per commit. Pass-Shi lower bound 달성 — DAG 위 이론적 최적</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Zero-extra-communication</p>
                <p className="text-muted-foreground">DAG 자체가 voting. 추가 consensus 메시지 없이 Narwhal output 직접 사용</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Sync/Async hybrid</p>
                <p className="text-muted-foreground">fast path: partial sync (2 rounds), fallback: async (4 rounds). 자동 전환, both safe</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">DAG + Consensus 분리</p>
            <p className="text-sm text-muted-foreground">
              <code>Narwhal</code> = data dissemination (DAG), <code>Bullshark</code> = order determination (consensus). 각 layer 독립 발전 가능한 modular architecture
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">프로토콜 계보</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">특징</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT/HotStuff</td><td className="border border-border px-3 py-1.5">sequential, 1 block/round, leader bottleneck, 10-30K TPS</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">DAG-Rider (2021)</td><td className="border border-border px-3 py-1.5">DAG-based, 4-round latency, async-safe</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Tusk (2022)</td><td className="border border-border px-3 py-1.5">Narwhal mempool + Tusk ordering, 4-round async</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Bullshark (2022)</td><td className="border border-border px-3 py-1.5">2-round partial sync + 4-round async fallback, Sui production</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Mysticeti (2024)</td><td className="border border-border px-3 py-1.5">uncertified DAG, 3-round commit, 390ms e2e</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">계보: DAG-Rider → Tusk → Bullshark → Mysticeti — 각각 latency 또는 throughput 개선</p>
          </div>
        </div>
        <p className="leading-7">
          Bullshark: <strong>2-round partial sync + 4-round async fallback</strong>.<br />
          DAG 자체가 voting — zero extra communication.<br />
          DAG-Rider → Tusk → Bullshark → Mysticeti 계보.
        </p>

        {/* ── 핵심 개념 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark 핵심 개념</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">핵심 개념 4가지</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Wave (웨이브)</p>
                <p className="text-muted-foreground">partial sync: 2 rounds per wave, async: 4 rounds per wave. <code>wave w = rounds [2w, 2w+1]</code> 또는 <code>[4w, 4w+3]</code></p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Anchor</p>
                <p className="text-muted-foreground">wave의 특정 round의 designated leader vertex. <code>leader_w = schedule[w % n]</code> (round-robin). anchor commit → entire wave committed</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Vote</p>
                <p className="text-muted-foreground">next wave의 vertex가 anchor 참조 (DAG edge). <code>f+1+</code> votes → anchor committed. 별도 vote message 불필요</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Skipped Wave</p>
                <p className="text-muted-foreground">anchor가 없거나 insufficient votes → skip. next committed anchor가 skip wave도 포함 처리</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Commit Rule</p>
            <p className="text-sm">
              <code>commit anchor(w)</code> iff: <code>f+1</code> votes from <code>round(2w+1)</code> point to <code>anchor(w)</code>, 또는 <code>anchor(w+1)</code>이 <code>2f+1</code> causal ancestors back to <code>anchor(w)</code> 보유
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Total Order 결정</p>
            <ol className="text-sm list-decimal list-inside space-y-0.5">
              <li>committed anchors 순서 (wave 순)</li>
              <li>각 anchor의 causal history 추출</li>
              <li><code>(round, author)</code> 순 sort</li>
              <li>deterministic linear order</li>
            </ol>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">예시 (<code>n=4</code>, fast path)</p>
            <p className="text-sm text-muted-foreground">
              wave 0: rounds 0,1 — leader=V0, anchor=V0's round 0 vertex.<br />
              wave 1: rounds 2,3 — leader=V1, anchor=V1's round 2 vertex.<br />
              wave 1의 round 2에서 V0, V1, V2가 <code>anchor(0)</code> 참조 → 3 votes &ge; <code>f+1</code>=2 → <code>anchor(0)</code> committed
            </p>
          </div>
        </div>
        <p className="leading-7">
          핵심: <strong>Wave + Anchor + Vote (DAG edge) + Causal History</strong>.<br />
          DAG edge = implicit vote → zero extra communication.<br />
          deterministic round-robin leader.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "DAG edge = vote"인가</strong> — 구조 자체로 consensus.<br />
          Narwhal이 DAG를 만들 때 reliable broadcast로 safety 보장.<br />
          Bullshark는 DAG를 다시 해석(interpret)만 — anchor는 vote 받은 leader.<br />
          결과: consensus의 고전적 "voting + commit" 단계 불필요.
        </p>
      </div>
    </section>
  );
}
