import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { pipe: '#f59e0b', ok: '#10b981' };

function PipelineViz() {
  const leaders = [
    { slot: 1, leader: 'L1', status: 'Commit' },
    { slot: 2, leader: 'L2', status: 'Vote' },
    { slot: 3, leader: 'L3', status: 'Propose' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">파이프라인: 여러 슬롯이 동시 진행</p>
      <svg viewBox="0 0 420 90" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {leaders.map((l, i) => (
          <motion.g key={l.slot} initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: 'spring' }}>
            <ModuleBox x={15 + i * 135} y={10} w={115} h={40}
              label={`Slot ${l.slot} (${l.leader})`} sub={l.status} color={i === 0 ? C.ok : C.pipe} />
          </motion.g>
        ))}
        <motion.text x={210} y={72} textAnchor="middle" fontSize={11}
          fill={C.pipe} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 앞 슬롯 커밋 대기 없이 다음 슬롯 제안 시작
        </motion.text>
      </svg>
    </div>
  );
}

export default function Pipeline() {
  return (
    <section id="pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파이프라인 구조</h2>
      <PipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn은 리더를 회전하며 여러 슬롯을 동시에 진행.<br />
          슬롯 1이 커밋되기 전에 슬롯 2, 3이 이미 투표 진행.<br />
          <strong>처리량 = 동시 슬롯 수 x 단일 슬롯 처리량</strong>.
        </p>

        {/* ── Highway + Lanes ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Highway + Lanes 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn 2-tier:

// Tier 1: Lanes (data dissemination)
// - 각 validator가 독립 lane 소유
// - continuous TX batch creation
// - broadcast to all validators
// - ack collection
// - Narwhal-style reliable broadcast
//
// Lane parallel execution:
// - n validators → n lanes
// - each lane independently active
// - no ordering 필요 (data layer)
// - throughput n배 scaling

// Tier 2: Highway (consensus)
// - sequential ordering
// - slot-based consensus
// - each slot = 1 proposal
// - reference batch IDs from lanes
//
// Highway protocol:
// - slot leader proposes
// - 2f+1 vote
// - commit decision
// - PBFT-style 2 phases

// Ride-Sharing (piggyback):
// - Highway messages 안에 Lane acks 포함
// - validator A가 slot proposal 만들 때
//   latest Lane acks (to other validators) 포함
// - bandwidth 효율화
// - network messages 감소

// 파이프라인:
// - slot 1 committing
// - slot 2 voting
// - slot 3 proposing
// - slot 4 preparing
// - 4 slots in flight simultaneously

// Throughput 계산:
// - single slot: 200ms (PBFT latency)
// - pipeline depth: 4
// - effective throughput: 4 slots / 200ms
// - TX per slot: 10000
// - TPS: 200,000

// vs HotStuff chained:
// - pipeline depth: 3 (3-chain)
// - latency per slot: 300ms
// - TPS: 100,000

// vs Narwhal+Bullshark:
// - DAG parallel: n lanes
// - no slot bottleneck
// - TPS: 130,000

// Autobahn의 advantage:
// - throughput 유사
// - latency 더 낮음 (PBFT급)
// - blip recovery 빠름`}
        </pre>
        <p className="leading-7">
          Autobahn 파이프라인: <strong>Lanes (throughput) + Highway (ordering)</strong>.<br />
          4 slots in flight, ~200K TPS 목표.<br />
          Ride-Sharing으로 bandwidth 효율화.
        </p>

        {/* ── Slot Lifecycle ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slot Lifecycle 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slot Lifecycle (Autobahn):

// Phase 1: Prepare (slot s)
// - slot leader = schedule[s mod n]
// - leader gathers Lane acks
//   - which batches available?
//   - which validators acked?
// - leader proposes slot payload:
//   - batch_ids: list of batch references
//   - lane_acks: piggyback info
//
// Phase 2: Propose
// - leader → all: Propose(slot=s, payload)
// - each validator verifies:
//   - batches available in lanes
//   - ordering valid
//   - leader legit
// - validators → leader: Vote
//
// Phase 3: Vote Collection
// - leader collects 2f+1 votes
// - aggregates signatures
// - slot QC formed
//
// Phase 4: Commit
// - leader → all: Commit(QC)
// - validators add slot to chain
// - execute transactions
//
// Phase 5: Next Slot
// - slot s+1 leader = schedule[(s+1) mod n]
// - new slot starts (overlapped with phase 4)
// - pipeline 유지

// Overlapping:
// - slot s in Commit
// - slot s+1 in Propose
// - slot s+2 in Prepare
// - slot s+3 in Lane warmup

// Benefits:
// - continuous throughput
// - no gap between slots
// - latency of single slot
// - throughput of n parallel lanes

// Comparison with HotStuff Chained:
// HotStuff:
// - view-based pipelining
// - 3-chain (prepare, precommit, commit)
// - 3 views latency per commit
//
// Autobahn:
// - slot-based pipelining
// - 2 phases per slot (PBFT-like)
// - 2 views latency per commit
// - + Lane parallel dissemination`}
        </pre>
        <p className="leading-7">
          Slot lifecycle: <strong>Prepare → Propose → Vote → Commit</strong>.<br />
          4 slots overlap → continuous throughput.<br />
          HotStuff(3-view) 대비 Autobahn(2-phase) 더 빠름.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "slot" 단위인가</strong> — Ethereum 2.0 시맨틱.<br />
          slot = time unit (e.g., 200ms), leader rotation 단위.<br />
          Autobahn은 sequential slots + parallel lanes.<br />
          Ethereum 2.0 slot과 유사 개념 → blockchain 친화적.
        </p>
      </div>
    </section>
  );
}
