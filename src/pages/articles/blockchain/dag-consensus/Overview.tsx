import ContextViz from './viz/ContextViz';
import CodePanel from '@/components/ui/code-panel';
import DAGViz from './viz/DAGViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

const dagCompareCode = `이더리움 (선형 체인):
  B1 -> B2 -> B3 -> B4 -> B5
  한 번에 하나의 블록만 제안/처리

DAG 기반 (Narwhal + Bullshark):
  Round 1    Round 2    Round 3    Round 4
  +---+      +---+      +---+      +---+
  |V1 |----->|V1 |----->|V1*|----->|V1 |  (* = 리더)
  +---+\\    /+---+\\    /+---+\\    /+---+
        \\  /       \\  /       \\  /
  +---+  \\/  +---+  \\/  +---+  \\/  +---+
  |V2 |--X-->|V2 |--X-->|V2 |--X-->|V2 |
  +---+ /\\   +---+ /\\   +---+ /\\   +---+
       /  \\       /  \\       /  \\
  +---+    \\ +---+    \\ +---+    \\ +---+
  |V3 |----->|V3 |----->|V3 |----->|V3 |
  +---+      +---+      +---+      +---+

  모든 검증자가 매 라운드 동시에 "vertex" 제출
  -> 처리량 = n x (단일 노드 처리량)`;

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DAG 기반 합의 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Narwhal(2021) + Bullshark(2022) — <strong>DAG 기반 BFT 합의</strong>.<br />
          모든 validator가 동시에 block 생성 → 처리량 n배 향상.<br />
          Sui, Aptos의 core engine.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">선형 체인 vs DAG</h3>
        <CodePanel title="선형 체인 vs DAG 구조" code={dagCompareCode}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '이더리움: 단일 블록 순차 처리' },
            { lines: [5, 18], color: 'emerald', note: 'DAG: 모든 검증자 동시 제출' },
            { lines: [20, 21], color: 'amber', note: '처리량 = n배 향상' },
          ]} />
        <DAGViz />

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('sui-block', codeRefs['sui-block'])} />
            <span className="text-[10px] text-muted-foreground self-center">block.rs</span>
            <CodeViewButton onClick={() => onCodeRef('sui-core', codeRefs['sui-core'])} />
            <span className="text-[10px] text-muted-foreground self-center">core.rs</span>
          </div>
        )}

        {/* ── DAG-BFT 등장 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DAG-BFT 등장 동기</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-2">선형 체인 BFT 한계</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><strong>Sequential bottleneck</strong> — 한 번에 1 block, leader만 propose, throughput = 1 block/view</li>
              <li><strong>Leader bottleneck</strong> — 모든 TX 수집 + bandwidth/CPU 병목</li>
              <li><strong>Leader failure</strong> — 장애 시 전체 halt + view change overhead</li>
              <li><strong>Single point of failure</strong> — leader 공격 집중</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">DAG-BFT 해결</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><strong>Parallel proposal</strong> — 모든 validator 매 round propose → n배 throughput</li>
              <li><strong>Data/Order 분리</strong> — DAG(parallel) + sequential commit. 각 layer 독립 최적화</li>
              <li><strong>Byzantine tolerance</strong> — 개별 validator 실패 무관, DAG 계속 성장</li>
            </ul>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">DAG-BFT 역사</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>2018 — Hashgraph (Swirlds), Aleph BFT</li>
              <li>2021 — Narwhal (Meta Research)</li>
              <li>2022 — Bullshark (Mysten Labs)</li>
              <li>2023 — Tusk (async version)</li>
              <li>2024 — Mysticeti (Sui mainnet)</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">성능 (2024)</p>
            <p className="text-sm">Narwhal+Bullshark: 130K+ TPS. Mysticeti: 160K+ TPS.<br />기존 BFT(10-30K TPS) 대비 <strong>5-10x</strong>.</p>
          </div>
        </div>
        <p className="leading-7">
          DAG-BFT = <strong>parallel proposal로 n배 throughput</strong>.<br />
          데이터 전파 (DAG)와 순서 결정 (consensus) 분리.<br />
          2021 Narwhal부터 급속 발전.
        </p>

        {/* ── DAG-BFT 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DAG-BFT 2-tier 구조</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Tier 1: DAG Construction (data layer)</p>
            <p className="text-sm mb-1">각 validator가 매 round vertex 생성. <code className="text-xs">vertex = (TX batch, parent refs)</code>. parents: 이전 round의 <code className="text-xs">2f+1</code> vertices.</p>
            <p className="text-sm text-muted-foreground">parallel, uncertain ordering, high throughput. consensus 불필요(reliable broadcast만).</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Tier 2: Order Consensus (ordering layer)</p>
            <p className="text-sm mb-1">DAG를 input으로 global total order 결정. leader anchor 선택 → causal history commit.</p>
            <p className="text-sm text-muted-foreground">sequential, deterministic order, low overhead(DAG 이미 존재), BFT safety.</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">데이터 흐름</p>
          <p className="text-sm mb-2">validators → vertices → DAG → anchor selection → commit → total order</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Narwhal (data)</p>
              <p>reliable broadcast, <code className="text-xs">2f+1</code> vertex refs/round, primary-worker 아키텍처</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Bullshark (ordering)</p>
              <p>wave-based commit, anchor = wave 첫 round vertex, anchor의 causal history = committed</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Wave 구조</p>
              <p>wave = 2 rounds(sync) or 4 rounds(async). wave 끝에 anchor commit 시도.</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          2-tier: <strong>DAG (parallel) + Ordering (sequential)</strong>.<br />
          각 tier 독립 최적화 — throughput + safety 모두 달성.<br />
          Narwhal = data, Bullshark = ordering.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 DAG-BFT가 2021년에 등장했나</strong> — L1 blockchain 성능 요구.<br />
          Ethereum 15 TPS, Solana 2K TPS, Aptos/Sui 목표 100K+.<br />
          sequential BFT로 100K+ TPS 불가능 → parallel DAG 필수.<br />
          Narwhal이 혁신, Bullshark이 ordering 완성, Mysticeti가 optimizations.
        </p>
      </div>
    </section>
  );
}
