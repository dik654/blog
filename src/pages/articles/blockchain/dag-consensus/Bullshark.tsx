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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark Wave 구조:

// Wave (sync mode, fast):
// - 2 rounds per wave
// - wave_leader = round_r's designated validator
// - round r: leader proposes vertex
// - round r+1: validators reference leader
//
// Anchor commit rule (fast path):
// - wave w의 leader vertex L_w
// - L_w에 f+1+ votes (references from r+1)
// - L_w committed
// - L_w의 causal history all committed

// Wave (async mode, fallback):
// - 4 rounds per wave
// - randomized leader
// - coin-flip or VRF
// - slower but async-safe

// Anchor selection:
// - leader_w = schedule(w mod n)
// - deterministic round-robin
// - 또는 reputation-based (DiemBFT 스타일)

// Vote collection:
// - L_w가 round r에 있을 때
// - round r+1에서 L_w를 parent로 가진 vertex 수 체크
// - >= f+1 = committed (fast path)
// - < f+1 = wait for next wave

// Total Order Extraction:
// 1. Committed anchors: L_w1, L_w2, L_w3, ...
// 2. For each anchor L:
//    - BFS on DAG from L
//    - collect all causal history
//    - order by round, then author
// 3. deterministic total order

// 예시 (n=4):
// wave 1 leader = V1
// Round 1: V1, V2, V3, V4 propose
// Round 2: V1, V2, V3, V4 propose
//   - V1, V2, V3 all reference V1's r1 vertex
//   - V4 references V2's r1
//   - V1's r1 가 3 votes (f+1 = 2 이상)
//   - V1's r1 = anchor → committed
// 3 rounds later anchor commit 가능`}
        </pre>
        <p className="leading-7">
          Wave = <strong>2 rounds (sync) or 4 rounds (async)</strong>.<br />
          anchor = wave 첫 round의 leader vertex.<br />
          f+1+ votes → commit + entire causal history.
        </p>

        {/* ── Commit Rule & Safety ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Commit Rule &amp; Safety</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark Commit Rule:
//
// anchor(w): wave w의 leader vertex
// links(L, r): round r에서 L을 ancestor로 하는 vertex 수
//
// fast path commit:
// commit anchor(w) iff:
//     links(anchor(w), w.round + 1) >= f+1
//
// slow path (async):
// - random leader per wave
// - coin-flip for tie-breaking
// - 확률적 commit (expected time bounded)

// Safety 증명 sketch:
// - f+1 links → at least 1 honest validator referenced
// - honest validator는 conflicting anchor 안 만듦
// - anchor commit = irreversible
// - future waves도 이 anchor 포함 (causal history)

// Liveness:
// - sync mode: GST 이후 매 wave commit
// - async mode: 확률 1로 commit (randomized)
// - 어떤 환경에서도 progress 보장

// Ordering:
// 1. committed anchor 순서 (wave 순)
// 2. 각 anchor 내부:
//    - causal history (ancestors in DAG)
//    - 순서: (round, author)로 deterministic
// 3. linear total order

// 구체적 algorithm:
// function commit_order(new_anchor):
//     to_commit = []
//     visited = set()
//     queue = [new_anchor]
//     while queue:
//         v = queue.pop()
//         if v in visited: continue
//         visited.add(v)
//         to_commit.append(v)
//         for p in v.parents:
//             if not committed(p):
//                 queue.append(p)
//     sort by (round, author)
//     return to_commit

// 주의:
// - 이전 wave의 uncommitted vertex도 포함
// - skip된 anchor의 history도 포함
// - 모든 reliable broadcast된 vertex 결국 ordered`}
        </pre>
        <p className="leading-7">
          Commit rule: <strong>anchor의 f+1+ links → commit</strong>.<br />
          Safety: f+1 중 정직 1명 → conflicting anchor 불가.<br />
          Liveness: sync fast + async fallback (확률 1).
        </p>

        {/* ── 성능 및 한계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bullshark 성능 및 후속 연구</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bullshark 성능 (CCS 2022 paper):
//
// Setup:
// - 10 validators, 4 workers each
// - AWS 다중 리전 (WAN)
// - BLS12-381 signatures
//
// 측정:
// - throughput: 130K+ TPS
// - latency: 2s (WAN, fast path)
// - bandwidth: 8.5 Gbps aggregate
// - CPU: under 50%

// 비교:
// Narwhal 단독 (no ordering): 600K TPS (mempool only)
// Bullshark (with ordering): 130K TPS (consensus bound)
// HotStuff (sequential): 10K TPS
// Tendermint: 5K TPS

// Bullshark 한계:
// - latency 여전히 높음 (2s)
// - wave 단위 commit (2-round batching)
// - async mode 복잡
// - leader bottleneck 여전 (anchor)

// 후속 프로토콜:
//
// Shoal (2023):
// - pipelined Bullshark
// - multiple anchors per wave
// - latency 감소
//
// Mysticeti (2024):
// - uncertified DAG (no 2f+1 signatures)
// - 3-round commit (vs Bullshark 4-round)
// - 390ms e2e latency
// - Sui mainnet
//
// Shoal++ (2024):
// - further optimizations
// - reputation-based leader
// - sub-second latency

// 미래 방향:
// - sub-second DAG commit
// - async-safe without fallback
// - privacy-preserving DAG
// - shared DAG across chains`}
        </pre>
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
