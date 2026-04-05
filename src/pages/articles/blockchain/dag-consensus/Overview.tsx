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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 선형 체인 BFT 한계:
//
// 1. Sequential bottleneck:
//    - 한 번에 1 block propose
//    - leader만 propose 가능
//    - 다른 validator는 대기
//    - throughput = 1 block / view
//
// 2. Leader bottleneck:
//    - leader가 모든 TX 수집
//    - leader bandwidth 제약
//    - leader CPU 병목
//
// 3. Leader failure impact:
//    - leader 장애 시 전체 halt
//    - view change overhead
//    - 복구 지연
//
// 4. Single point of failure:
//    - leader 공격 집중
//    - 분산 시스템 취지 훼손

// DAG-BFT 해결:
//
// 1. Parallel proposal:
//    - 모든 validator 매 round propose
//    - n 개 block per round
//    - throughput n배
//
// 2. Decouple data/order:
//    - Data: DAG structure (parallel)
//    - Order: sequential commit (serial)
//    - 각 layer 독립 최적화
//
// 3. Byzantine tolerance:
//    - 개별 validator 실패 무관
//    - DAG 계속 성장
//    - Byzantine fault mitigated

// 역사:
// - 2018: Hashgraph (Swirlds)
// - 2018: Aleph BFT
// - 2021: Narwhal (Meta Research)
// - 2022: Bullshark (Mysten Labs)
// - 2023: Tusk (async version)
// - 2024: Mysticeti (Sui mainnet)

// 성능 (2024):
// - Narwhal+Bullshark: 130K+ TPS
// - Mysticeti: 160K+ TPS
// - 기존 BFT (10-30K TPS) 대비 5-10x`}
        </pre>
        <p className="leading-7">
          DAG-BFT = <strong>parallel proposal로 n배 throughput</strong>.<br />
          데이터 전파 (DAG)와 순서 결정 (consensus) 분리.<br />
          2021 Narwhal부터 급속 발전.
        </p>

        {/* ── DAG-BFT 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DAG-BFT 2-tier 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DAG-BFT 2-tier architecture:

// Tier 1: DAG Construction (data layer)
// - 각 validator가 매 round vertex 생성
// - vertex = (TX batch, parent references)
// - parents: 이전 round의 2f+1 vertices
// - reliable broadcast로 propagation
//
// 특징:
// - parallel (모든 validator 동시)
// - uncertain ordering
// - high throughput
// - no consensus 필요 (reliable broadcast만)

// Tier 2: Order Consensus (ordering layer)
// - DAG를 input으로 받음
// - global total order 결정
// - leader anchor 선택
// - causal history commit
//
// 특징:
// - sequential
// - deterministic order
// - low overhead (DAG 이미 존재)
// - BFT safety

// 데이터 흐름:
// validators → vertices → DAG
// DAG → anchor selection → commit
// committed anchors → total order

// Narwhal (data layer):
// - reliable broadcast
// - 2f+1 vertex references per round
// - primary-worker architecture

// Bullshark (ordering layer):
// - wave-based commit
// - anchor: wave의 첫 round vertex
// - anchor의 causal history = committed

// Total Ordering:
// committed anchors chain:
// anchor_w1 → anchor_w2 → anchor_w3 → ...
// 각 anchor의 history 포함
// → deterministic linear order

// Wave 구조 (Bullshark):
// wave = 2 rounds (sync) or 4 rounds (async)
// wave 끝에 anchor commit 시도
// anchor 받으면 entire history commit`}
        </pre>
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
