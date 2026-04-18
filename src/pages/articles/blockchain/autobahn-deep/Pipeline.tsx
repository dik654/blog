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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">2-Tier Architecture</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Tier 1: Lanes (data dissemination)</p>
                <p className="text-muted-foreground">각 validator 독립 lane 소유, continuous TX batch → broadcast → ack collection (Narwhal-style). n validators → n lanes → throughput n배 scaling</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Tier 2: Highway (consensus)</p>
                <p className="text-muted-foreground">sequential slot-based ordering, each slot = 1 proposal (batch IDs 참조). slot leader proposes → <code>2f+1</code> vote → commit (PBFT-style 2 phases)</p>
              </div>
            </div>
            <p className="text-sm mt-2">
              <strong>Ride-Sharing</strong>: Highway messages에 Lane acks 포함 (piggyback) → 별도 ack 메시지 불필요, bandwidth 효율화
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">파이프라인 &amp; 성능 비교</p>
            <p className="text-sm mb-2">
              slot 1 committing / slot 2 voting / slot 3 proposing / slot 4 preparing → 4 slots in flight simultaneously
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">Pipeline depth</th>
                    <th className="border border-border px-3 py-1.5 text-left">Slot latency</th>
                    <th className="border border-border px-3 py-1.5 text-left">TPS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5 font-semibold">Autobahn</td><td className="border border-border px-3 py-1.5">4</td><td className="border border-border px-3 py-1.5">200ms</td><td className="border border-border px-3 py-1.5">200K</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff chained</td><td className="border border-border px-3 py-1.5">3 (3-chain)</td><td className="border border-border px-3 py-1.5">300ms</td><td className="border border-border px-3 py-1.5">100K</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Bullshark</td><td className="border border-border px-3 py-1.5">n lanes (DAG)</td><td className="border border-border px-3 py-1.5">-</td><td className="border border-border px-3 py-1.5">130K</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Autobahn: throughput 유사, latency 더 낮음 (PBFT급), blip recovery 빠름</p>
          </div>
        </div>
        <p className="leading-7">
          Autobahn 파이프라인: <strong>Lanes (throughput) + Highway (ordering)</strong>.<br />
          4 slots in flight, ~200K TPS 목표.<br />
          Ride-Sharing으로 bandwidth 효율화.
        </p>

        {/* ── Slot Lifecycle ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slot Lifecycle 상세</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Slot Lifecycle</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li><strong>Prepare</strong>: slot leader (<code>schedule[s mod n]</code>) → Lane acks 수집 → batch_ids + lane_acks로 payload 구성</li>
              <li><strong>Propose</strong>: leader → all: <code>Propose(slot=s, payload)</code>. validators가 batches/ordering/leader 검증 → Vote 전송</li>
              <li><strong>Vote Collection</strong>: leader가 <code>2f+1</code> votes 수집 → signatures 집계 → slot QC 형성</li>
              <li><strong>Commit</strong>: leader → all: <code>Commit(QC)</code>. validators가 slot을 chain에 추가, TX 실행</li>
              <li><strong>Next Slot</strong>: <code>slot s+1</code> leader 시작 (phase 4와 overlap) → pipeline 유지</li>
            </ol>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Overlapping &amp; 비교</p>
            <p className="text-sm">
              slot s: Commit / slot s+1: Propose / slot s+2: Prepare / slot s+3: Lane warmup → continuous throughput, no gap
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              HotStuff: view-based, 3-chain (prepare→precommit→commit), 3 views latency.<br />
              Autobahn: slot-based, 2 phases (PBFT-like), 2 views latency + Lane parallel dissemination
            </p>
          </div>
        </div>
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
