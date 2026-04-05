import GossipBFTDetailViz from './viz/GossipBFTDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function GossipBFT({ onCodeRef }: Props) {
  return (
    <section id="gossipbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossiPBFT 프로토콜</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        5단계(QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE) 순차 실행<br />
        각 단계에서 2/3+ 스토리지 파워 쿼럼을 확인
      </p>
      <div className="not-prose mb-8">
        <GossipBFTDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── 5-Phase Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">5-Phase Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossiPBFT 5 Phases (F3):

// Phase 1: QUALITY
// - purpose: identify candidate tipsets
// - participants: all active validators
// - input: recently produced EC tipsets
// - output: candidate set with quality score
// - action: broadcast(QualityVote(tipset, power))
// - aggregation: collect votes via gossip
// - duration: ~30s

// Phase 2: CONVERGE
// - purpose: converge on best candidate
// - input: QUALITY votes
// - output: single leading tipset
// - action: broadcast(ConvergeVote(best_tipset))
// - threshold: 2/3+ power agreement
// - duration: ~30s

// Phase 3: PREPARE
// - purpose: commitment preparation
// - input: converged tipset
// - output: prepared signal
// - action: broadcast(PrepareVote(tipset))
// - threshold: 2/3+ power PREPARE
// - forms prepared certificate
// - duration: ~30s

// Phase 4: COMMIT
// - purpose: final commitment
// - input: prepared certificate
// - output: commit signal
// - action: broadcast(CommitVote(tipset))
// - threshold: 2/3+ power COMMIT
// - forms commit certificate
// - duration: ~30s

// Phase 5: DECIDE
// - purpose: announce finalization
// - input: commit certificate
// - output: finalized tipset
// - action: broadcast(Decision(tipset, cert))
// - all honest validators agree
// - duration: ~30s

// Total: ~150s per instance (2.5 min)
// 2/3+ storage power needed each phase

// 왜 5 phases?
// - PBFT 3-phase + QUALITY/CONVERGE
// - quality check은 EC tipsets 선택 필요
// - converge는 best candidate 결정
// - prepare/commit 표준 BFT

// 비교:
// PBFT: 3 phases (pre-prepare, prepare, commit)
// HotStuff: 3-4 phases (chained)
// F3: 5 phases (extended for tipset selection)`}
        </pre>
        <p className="leading-7">
          5 phases: <strong>QUALITY → CONVERGE → PREPARE → COMMIT → DECIDE</strong>.<br />
          각 phase ~30s, total ~2.5분.<br />
          PBFT 3-phase + quality/converge 추가.
        </p>

        {/* ── Gossip Communication ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Gossip Communication 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Gossip Communication:
//
// Topology:
// - 모든 validator equal
// - leader 없음
// - mesh network (libp2p)
//
// libp2p gossipsub:
// - Filecoin의 기본 pub/sub layer
// - topic-based routing
// - mesh degree: 6-12
// - fanout: 6
// - TTL 기반 deduplication

// Message types:
// 1. QualityVote
// 2. ConvergeVote
// 3. PrepareVote
// 4. CommitVote
// 5. Decision

// Each vote message:
// struct Vote {
//     instance: uint64,     // F3 instance ID
//     round: uint64,        // phase round
//     phase: Phase,         // QUALITY/CONVERGE/PREPARE/COMMIT
//     sender: ActorID,
//     power: uint64,        // storage power
//     value: Value,         // tipset or ⊥
//     signature: Signature, // BLS
// }

// BLS Aggregation:
// - 각 validator가 BLS sign
// - others verify + aggregate
// - O(n) → O(1) signature size
// - pairing operation (single verify)

// Propagation time:
// - log_fanout(n) gossip rounds
// - n=1000, fanout=8: ~4 rounds
// - each round: ~100-200ms
// - total: ~1-2s

// Deduplication:
// - seen message cache
// - bloom filter
// - TTL: 300s

// Byzantine tolerance:
// - 2/3+ honest power assumption
// - malicious votes ignored
// - equivocation = slashable
// - DDoS: gossip multi-path저항

// F3 instance lifecycle:
// 1. trigger: new EC tipset + time
// 2. QUALITY starts
// 3. 5 phases sequentially
// 4. DECIDE reached
// 5. broadcast finalized tipset
// 6. start next instance

// Instance frequency:
// - 매 ~2-5분 new instance
// - parallel instances 가능
// - unfinalized backlog tracking`}
        </pre>
        <p className="leading-7">
          Gossip: <strong>libp2p gossipsub + BLS aggregation</strong>.<br />
          leader 없음, mesh network, fanout 6-12.<br />
          instance당 5 phases × 30s = ~2.5min.
        </p>

        {/* ── Safety & Liveness 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety &amp; Liveness 증명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// F3 Safety 증명 (formal):

// Claim: F3가 finalized 한 tipset은 revert 불가

// Assumptions:
// - f < 1/3 storage power Byzantine
// - 2f+1 > 2/3 threshold
// - BLS signature unforgeable
// - libp2p eventual delivery (partial sync)

// Safety argument:
// 1. COMMIT 2/3+ power → CommitCertificate
// 2. 2f+1 power의 vote 필요 (f<n/3 from n)
// 3. f+1 power는 honest
// 4. honest는 동일 instance 두 다른 값 commit 불가
// 5. two conflicting finalizations impossible
// 6. → safety 보장

// Quorum intersection:
// - C1, C2 두 commit certificates
// - 둘 다 2/3+ power
// - intersection >= 1/3+ power
// - honest in intersection >= f+1 power
// - honest는 같은 값 commit
// - → C1.value == C2.value

// Liveness 증명:
//
// Claim: GST 이후 eventually new tipset finalized
//
// Assumptions:
// - 2/3+ honest power
// - GST (network stabilizes)
// - gossip eventually delivers
//
// Argument:
// 1. QUALITY: honest vote for latest tipset
// 2. CONVERGE: 2/3+ agree on best
// 3. PREPARE: 2/3+ prepare
// 4. COMMIT: 2/3+ commit
// 5. DECIDE: all honest learn
// 6. → progress
//
// Timing:
// - phases: 30s each (configurable)
// - total: ~2.5 min per instance
// - catch-up possible if slow

// Formal verification:
// - TLA+ specification (2023-2024)
// - invariant checking
// - refinement proofs
// - safety + liveness theorems

// Audit status:
// - Runtime Verification audit
// - Trail of Bits review
// - internal Protocol Labs
// - ongoing 2024`}
        </pre>
        <p className="leading-7">
          Safety: <strong>quorum intersection (f+1 honest)</strong>.<br />
          Liveness: GST + gossip eventual delivery.<br />
          TLA+ verification + 3rd party audits.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "5 phases"인가 (PBFT는 3)</strong> — tipset selection 복잡성.<br />
          BFT는 단일 proposal 합의, F3는 tipset (여러 blocks) 합의.<br />
          QUALITY = 후보 찾기, CONVERGE = 단일 tipset 결정.<br />
          그 후 PBFT 표준 PREPARE/COMMIT으로 finalize.
        </p>
      </div>
    </section>
  );
}
