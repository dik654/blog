import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 프로토콜 종합 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          주요 합의 프로토콜의 <strong>종합 비교</strong>.<br />
          처리량, 지연, 안전성, 활성, 통신복잡도 기준 분석.<br />
          각 프로토콜의 용도와 trade-off 명확화.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">비교 대상</h3>
        <p className="leading-7">
          PBFT, HotStuff, Tendermint, Narwhal/Bullshark, Avalanche, Nakamoto — <strong>6가지 프로토콜</strong>.<br />
          각각 다른 시대, 다른 목적으로 설계.<br />
          절대적 우열 없음 — 용도별 최적 선택.
        </p>

        {/* ── 프로토콜 history ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 역사적 맥락</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">프로토콜 역사적 타임라인</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">연도</th>
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">핵심 기여</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">1982</td><td className="border border-border px-3 py-1.5">Lamport</td><td className="border border-border px-3 py-1.5">Byzantine Generals Problem 정의</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">1999</td><td className="border border-border px-3 py-1.5">PBFT</td><td className="border border-border px-3 py-1.5">최초 실용적 BFT, O(n2) + O(n3) VC</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2008</td><td className="border border-border px-3 py-1.5">Nakamoto (Bitcoin)</td><td className="border border-border px-3 py-1.5">PoW + longest chain, open membership</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2014</td><td className="border border-border px-3 py-1.5">Tendermint</td><td className="border border-border px-3 py-1.5">blockchain-specific BFT, Cosmos 기반</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2018</td><td className="border border-border px-3 py-1.5">Avalanche</td><td className="border border-border px-3 py-1.5">metastable consensus, scalable probabilistic</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2019</td><td className="border border-border px-3 py-1.5">HotStuff</td><td className="border border-border px-3 py-1.5">O(n) linear BFT, Libra/Diem/Aptos</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2022</td><td className="border border-border px-3 py-1.5">Narwhal+Bullshark</td><td className="border border-border px-3 py-1.5">DAG-based BFT, 130K+ TPS</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2023</td><td className="border border-border px-3 py-1.5">Jolteon</td><td className="border border-border px-3 py-1.5">2-chain commit, fast path (Aptos)</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">2024</td><td className="border border-border px-3 py-1.5">Mysticeti / Autobahn</td><td className="border border-border px-3 py-1.5">uncertified DAG 390ms / hybrid pipeline</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">대표 블록체인 채택</p>
            <p className="text-sm text-muted-foreground">
              Bitcoin: Nakamoto PoW / Ethereum: Casper FFG + LMD-GHOST / Cosmos: Tendermint/CometBFT / Polkadot: GRANDPA / Avalanche: Snowman / Solana: Tower BFT + PoH / Sui: Mysticeti / Aptos: Jolteon / Near: Doomslug / Filecoin: EC + F3
            </p>
          </div>
        </div>
        <p className="leading-7">
          40년 BFT 역사: <strong>이론 → 실무 → blockchain → DAG</strong>.<br />
          2020s = DAG-BFT + high throughput 시대.<br />
          각 블록체인이 다른 프로토콜 채택 → 용도별 최적화.
        </p>

        {/* ── 비교 기준 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6 비교 기준</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">6 비교 기준</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">1. Communication complexity</p>
                <p className="text-muted-foreground"><code>O(n2)</code>: PBFT, Tendermint / <code>O(n)</code>: HotStuff, Narwhal / <code>O(k log n)</code>: Avalanche</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">2. Commit latency</p>
                <p className="text-muted-foreground">3-4delta: PBFT, HotStuff / 2-3delta: Mysticeti, Autobahn / ~1s: Avalanche / 60min+: Nakamoto</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">3. Throughput (TPS)</p>
                <p className="text-muted-foreground">10K-30K: PBFT, Tendermint, HotStuff / 100K+: Narwhal, Mysticeti / 4500: Avalanche / 7-15: Bitcoin, Ethereum</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">4. Safety guarantee</p>
                <p className="text-muted-foreground">Deterministic (f&lt;n/3): BFT 모두 / Probabilistic (10^-10): Avalanche / Probabilistic (PoW): Nakamoto</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">5. Liveness guarantee</p>
                <p className="text-muted-foreground">Partial sync (GST): BFT / Always: Avalanche, Nakamoto / Async-safe: Ditto, Tusk</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">6. Validator scalability</p>
                <p className="text-muted-foreground">수십: PBFT / 수백: BFT / 수천: Avalanche, DAG-BFT / 수백만: Nakamoto (light clients)</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">추가 고려</p>
            <p className="text-sm text-muted-foreground">
              bandwidth per validator, CPU/memory requirements, developer complexity, production maturity, governance/upgrade path
            </p>
          </div>
        </div>
        <p className="leading-7">
          6 비교 기준: <strong>complexity, latency, throughput, safety, liveness, scalability</strong>.<br />
          각 블록체인이 가중치 다르게 선택.<br />
          완벽한 합의 없음 — trade-off의 예술.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 합의 프로토콜이 블록체인 성능의 핵심인가</strong> — bottleneck.<br />
          consensus 외 모든 것 (execution, storage)은 hardware 개선으로 확장 가능.<br />
          consensus는 네트워크 delay가 하한 → 알고리즘 개선이 유일한 방법.<br />
          "consensus war" — 블록체인 간 성능 경쟁의 핵심 전선.
        </p>
      </div>
    </section>
  );
}
