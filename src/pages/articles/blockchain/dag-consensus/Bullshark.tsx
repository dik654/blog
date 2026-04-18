import BullsharkWaveViz from './viz/BullsharkWaveViz';
import BullsharkDetailViz from './viz/BullsharkDetailViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Bullshark({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  return (
    <section id="bullshark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bullshark: DAG 순서 결정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Spiegelman et al. (CCS 2022) — <strong>Narwhal DAG 위 ordering 프로토콜</strong>.<br />
          anchor 기반 wave commit으로 deterministic total order 결정.<br />
          partial sync fast path + async fallback.
        </p>
      </div>
      <div className="not-prose mb-8"><BullsharkDetailViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Wave 파이프라인</h3>
        <p className="leading-7">
          4라운드 단위 Wave — 앵커 커밋 시 인과적 히스토리 전체가 순서 확정.
        </p>
      </div>
      <div className="not-prose mb-6"><BullsharkWaveViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Wave & Anchor ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Wave 구조와 Anchor</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Wave (sync mode, fast path)</p>
            <p className="text-sm mb-1">2 rounds/wave. <code className="text-xs">wave_leader = round_r</code>의 designated validator.</p>
            <p className="text-sm"><strong>Anchor commit</strong>: leader vertex <code className="text-xs">L_w</code>에 <code className="text-xs">f+1+</code> votes(references from r+1) → committed + causal history all committed.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Wave (async mode, fallback)</p>
            <p className="text-sm">4 rounds/wave. randomized leader(coin-flip or VRF). slower but async-safe.</p>
            <p className="text-sm mt-1 text-muted-foreground">Anchor selection: <code className="text-xs">leader_w = schedule(w mod n)</code> (round-robin) or reputation-based.</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Total Order Extraction</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Committed anchors: <code className="text-xs">L_w1 → L_w2 → L_w3 → ...</code></li>
            <li>각 anchor L에서 BFS → causal history 수집 → <code className="text-xs">(round, author)</code>로 정렬</li>
            <li>deterministic total order</li>
          </ol>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50 not-prose mb-4">
          <p className="font-semibold text-sm mb-1">예시 (<code className="text-xs">n=4</code>)</p>
          <p className="text-sm">wave 1 leader = V1. Round 1-2: V1-V4 propose. V1/V2/V3가 V1의 r1 vertex 참조 → 3 votes(<code className="text-xs">f+1=2</code> 이상) → V1의 r1 = anchor → committed.</p>
        </div>
        <p className="leading-7">
          Wave = <strong>2 rounds (sync) or 4 rounds (async)</strong>.<br />
          anchor = wave 첫 round의 leader vertex.<br />
          f+1+ votes → commit + entire causal history.
        </p>

        {/* ── Commit Rule & Safety ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Commit Rule &amp; Safety</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Fast Path Commit Rule</p>
            <p className="text-sm"><code className="text-xs">anchor(w)</code>: wave w의 leader vertex. <code className="text-xs">links(L, r)</code>: round r에서 L을 ancestor로 하는 vertex 수.</p>
            <p className="text-sm mt-1">commit <code className="text-xs">anchor(w)</code> iff <code className="text-xs">links(anchor(w), w.round+1) &gt;= f+1</code></p>
            <p className="text-sm mt-1 text-muted-foreground">Slow path(async): random leader/wave + coin-flip → 확률적 commit.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Safety 증명 sketch</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><code className="text-xs">f+1</code> links → 최소 1 honest validator referenced</li>
              <li>honest validator는 conflicting anchor 안 만듦</li>
              <li>anchor commit = irreversible</li>
              <li>future waves도 이 anchor 포함(causal history)</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Liveness</p>
            <p className="text-sm">sync mode: GST 이후 매 wave commit. async mode: 확률 1로 commit(randomized). 어떤 환경에서도 progress 보장.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Ordering</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>committed anchor 순서(wave 순)</li>
              <li>각 anchor 내부: causal history → <code className="text-xs">(round, author)</code> deterministic</li>
              <li>linear total order</li>
            </ol>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">commit_order 알고리즘</p>
          <p className="text-sm">new_anchor에서 BFS → 미committed 모든 parents 수집 → <code className="text-xs">(round, author)</code>로 정렬. 이전 wave의 uncommitted vertex + skip된 anchor history 모두 포함 → 모든 reliable broadcast vertex 결국 ordered.</p>
        </div>
        <p className="leading-7">
          Commit rule: <strong>anchor의 f+1+ links → commit</strong>.<br />
          Safety: f+1 중 정직 1명 → conflicting anchor 불가.<br />
          Liveness: sync fast + async fallback (확률 1).
        </p>

        {/* ── 성능 및 한계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark 성능 및 후속 연구</h3>
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Bullshark 벤치마크 (CCS 2022)</p>
          <p className="text-sm text-muted-foreground mb-2">Setup: 10 validators, 4 workers each, AWS WAN, BLS12-381</p>
          <div className="grid sm:grid-cols-4 gap-2 text-sm">
            <div className="rounded border p-2 text-center"><p className="font-semibold">130K+</p><p className="text-xs text-muted-foreground">TPS</p></div>
            <div className="rounded border p-2 text-center"><p className="font-semibold">2s</p><p className="text-xs text-muted-foreground">Latency (WAN)</p></div>
            <div className="rounded border p-2 text-center"><p className="font-semibold">8.5 Gbps</p><p className="text-xs text-muted-foreground">Bandwidth</p></div>
            <div className="rounded border p-2 text-center"><p className="font-semibold">&lt;50%</p><p className="text-xs text-muted-foreground">CPU</p></div>
          </div>
          <p className="text-sm mt-2 text-muted-foreground">비교: Narwhal 단독 600K TPS(mempool) / HotStuff 10K TPS / Tendermint 5K TPS</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-2">Bullshark 한계</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>latency 여전히 높음(2s)</li>
              <li>wave 단위 commit(2-round batching)</li>
              <li>async mode 복잡</li>
              <li>leader bottleneck 여전(anchor)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">후속 프로토콜</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><strong>Shoal</strong> (2023) — pipelined Bullshark, multiple anchors/wave, latency 감소</li>
              <li><strong>Mysticeti</strong> (2024) — uncertified DAG, 3-round commit, 390ms e2e, Sui mainnet</li>
              <li><strong>Shoal++</strong> (2024) — reputation-based leader, sub-second latency</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Bullshark: <strong>130K TPS, 2s latency (WAN)</strong>.<br />
          Shoal, Mysticeti가 latency 개선 (390ms).<br />
          DAG-BFT의 이론적 기반 → 실무 최적화 진행 중.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Bullshark의 기여</strong> — "consensus as interpretation".<br />
          기존 BFT: consensus = vote + commit.<br />
          Bullshark: DAG는 그대로 두고 해석(ordering)만 결정.<br />
          separation of concerns: data (DAG) vs order (consensus).
        </p>
      </div>
    </section>
  );
}
