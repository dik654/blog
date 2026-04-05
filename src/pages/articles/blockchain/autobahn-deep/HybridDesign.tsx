import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const C = { fast: '#10b981', slow: '#6366f1' };

function HybridPathViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Fast Path vs Slow Path</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ActionBox x={150} y={5} w={120} h={30}
          label="블록 제안" sub="리더" color={C.fast} />
        <motion.line x1={210} y1={35} x2={120} y2={55}
          stroke={C.fast} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <motion.line x1={210} y1={35} x2={300} y2={55}
          stroke={C.slow} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ModuleBox x={40} y={55} w={150} h={32}
          label="Fast: 2단계 커밋" sub="PBFT 스타일" color={C.fast} />
        <ModuleBox x={230} y={55} w={150} h={32}
          label="Slow: 3단계 커밋" sub="HotStuff 스타일" color={C.slow} />
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 정상 시 fast path (낮은 지연), 리더 장애 시 slow path (안정성)
      </p>
    </div>
  );
}

export default function HybridDesign() {
  return (
    <section id="hybrid-design" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이브리드 설계</h2>
      <HybridPathViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Fast path: 리더가 정상일 때 <strong>2단계로 커밋</strong> (PBFT처럼 빠름).<br />
          리더가 응답하지 않으면 slow path로 전환해 3단계로 커밋.<br />
          전환은 타임아웃 기반이며, view change 프로토콜로 안전하게 수행.
        </p>

        {/* ── Fast Path 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fast Path 상세 (Happy Case)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fast Path (PBFT-style, 2-phase):

// Phase 1: Propose
// - slot leader collects Lane batches
// - creates proposal with batch IDs
// - broadcasts to all validators
// - latency: 1δ (single broadcast)

// Phase 2: Vote + Commit
// - validators verify proposal
// - send votes to all (broadcast)
// - leader aggregates 2f+1 votes
// - commit certificate formed
// - latency: 1δ + 1δ (vote propagation)

// Total latency: 2δ per slot
// - equivalent to PBFT happy path
// - responsive (no timeout)

// Why 2 phases suffice (not 3)?
// - Autobahn uses view certificates
// - similar to HotStuff-2 TC mechanism
// - view change provides additional safety
// - 2-phase + VC = safe

// Signature aggregation:
// - BLS12-381
// - 2f+1 → 1 aggregated signature
// - O(1) certificate size

// Ride-Sharing optimization:
// - proposal includes Lane acks
// - vote includes Lane acks
// - continuous data layer sync
// - no separate ack messages

// Performance:
// - latency: 200ms (WAN)
// - throughput: 100K TPS
// - validators: 100
// - CPU: <50%`}
        </pre>
        <p className="leading-7">
          Fast path: <strong>2 phases = 2δ latency</strong>.<br />
          PBFT-style + BLS aggregation + Ride-Sharing piggyback.<br />
          responsive, no timeout in happy case.
        </p>

        {/* ── Slow Path 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slow Path 상세 (Leader Failure)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Slow Path (Failure recovery):

// Detection:
// - validator waits for Propose (timeout T)
// - T = e.g., 500ms
// - no Propose → leader suspected

// View Change Protocol:
// 1. Validator sends Timeout message
//    - includes highQC (latest committed slot)
//    - broadcasts to all

// 2. New leader collects 2f+1 timeouts
//    - forms Timeout Certificate (TC)
//    - identifies latest progress
//    - max highQC in TC

// 3. New leader resumes slot
//    - proposes using max highQC as base
//    - includes TC as proof
//    - 2-phase commit continues

// 4. Slow path latency:
//    - timeout: T (500ms)
//    - timeout gathering: 1δ
//    - new propose: 1δ + 1δ
//    - Total: T + 3δ

// Blip handling (Autobahn innovation):
// - blip = brief leader unresponsiveness
// - traditional BFT: full view change
// - Autobahn: lightweight blip recovery
//
// Blip mechanism:
// - detect 감지 (mini timeout 100ms)
// - backup leader 활성화
// - backup이 같은 slot 제안
// - 원 leader 복귀 시 reconciliation
// - minimal disruption

// Latency with blips:
// - traditional: T + 3δ = 500ms + 600ms = 1.1s
// - Autobahn: mini timeout + 2δ = 100ms + 400ms = 500ms
// - 2x+ faster blip recovery

// Hybrid benefit:
// - 99% happy path (fast)
// - 1% failure handling (slow but bounded)
// - blip specific optimization`}
        </pre>
        <p className="leading-7">
          Slow path: <strong>timeout + TC + resume</strong>.<br />
          Blip handling: mini timeout + backup leader → 2x+ 빠름.<br />
          99% happy + 1% failure + fast blip recovery.
        </p>

        {/* ── View Change Mechanism ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change Mechanism</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn View Change:

// Trigger:
// - T timeout (e.g., 500ms)
// - leader suspected Byzantine / offline
// - broadcast Timeout message

// Timeout message:
// struct Timeout {
//     slot: u64,
//     view: u64,
//     highQC: QC,          // latest committed QC
//     lane_state: LaneAcks, // current lane info
//     signature: Sig,
// }

// New leader (view v+1):
// leader_author = schedule[(v+1) mod n]

// Aggregation:
// 2f+1 timeouts received
// → Timeout Certificate (TC)
// → max highQC identified
// → lane state merged

// Resume:
// - new leader proposes slot
// - references TC as proof
// - includes merged lane state
// - proceeds with fast path

// Safety:
// - TC replaces old view certificates
// - max highQC preserved
// - committed slots never reverted
// - quorum intersection (standard BFT)

// Optimizations:
//
// 1. Implicit timeout:
//    - no explicit TIMEOUT message if not needed
//    - detect via Lane activity
//
// 2. Parallel view change:
//    - multiple slots in flight
//    - each may have separate view change
//    - don't block each other
//
// 3. Blip-specific:
//    - short timeout triggers blip mode
//    - full view change for longer failures
//    - adaptive threshold

// Performance (SOSP 2024):
// - view change latency: 300ms
// - blip recovery: 100ms
// - vs HotStuff VC: 1s
// - 3-10x faster

// Integration with Lanes:
// - lanes continue during view change
// - batch dissemination not interrupted
// - only slot ordering paused
// - throughput impact minimal`}
        </pre>
        <p className="leading-7">
          View Change: <strong>Timeout + TC + resume with max highQC</strong>.<br />
          Blip-specific optimization → 3-10x 빠름.<br />
          lanes는 view change 중에도 계속 active.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Autobahn의 "blip handling"이 혁신인가</strong> — failure granularity 세분화.<br />
          기존 BFT: "failure" 한 종류, always full view change.<br />
          Autobahn: brief (blip) vs sustained failure 구분.<br />
          brief → lightweight recovery, sustained → full VC.<br />
          현실 failure의 90%는 blip → 10배+ 효율.
        </p>
      </div>
    </section>
  );
}
