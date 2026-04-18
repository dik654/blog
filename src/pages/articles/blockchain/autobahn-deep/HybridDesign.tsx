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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Fast Path (PBFT-style, 2-phase)</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Phase 1: Propose</p>
                <p className="text-muted-foreground">slot leader가 Lane batches 수집 → batch ID 포함 proposal 생성 → all validators broadcast. latency: <code>1delta</code></p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Phase 2: Vote + Commit</p>
                <p className="text-muted-foreground">validators verify → votes broadcast → leader가 <code>2f+1</code> votes 집계 → commit certificate. latency: <code>2delta</code></p>
              </div>
            </div>
            <p className="text-sm mt-2">
              Total: <code>2delta</code> per slot (PBFT happy path 동등). 2 phases 충분: view certificates(HotStuff-2 TC 유사)로 추가 safety 확보
            </p>
          </div>
          <div className="p-4">
            <p className="text-sm">
              <strong>BLS12-381</strong> signature aggregation: <code>2f+1</code> → 1 aggregated signature, <code>O(1)</code> certificate size.<br />
              <strong>Ride-Sharing</strong>: proposal/vote에 Lane acks 포함 → 별도 ack 메시지 불필요.<br />
              성능: 200ms (WAN), 100K TPS, 100 validators, CPU &lt;50%
            </p>
          </div>
        </div>
        <p className="leading-7">
          Fast path: <strong>2 phases = 2δ latency</strong>.<br />
          PBFT-style + BLS aggregation + Ride-Sharing piggyback.<br />
          responsive, no timeout in happy case.
        </p>

        {/* ── Slow Path 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Slow Path 상세 (Leader Failure)</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Slow Path (Failure recovery)</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li><strong>Detection</strong>: validator가 Propose 대기 (timeout T=500ms). no Propose → leader suspected</li>
              <li><strong>Timeout message</strong>: <code>highQC</code> (latest committed slot) 포함, all broadcast</li>
              <li><strong>New leader</strong>: <code>2f+1</code> timeouts 수집 → Timeout Certificate (TC) 형성, max <code>highQC</code> 식별</li>
              <li><strong>Resume</strong>: max highQC as base로 propose, TC as proof 포함, 2-phase commit 계속</li>
            </ol>
            <p className="text-sm text-muted-foreground mt-1">Total latency: <code>T + 3delta</code> (500ms + 600ms = 1.1s)</p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Blip handling (Autobahn 혁신)</p>
            <p className="text-sm">
              기존 BFT: brief unresponsiveness에도 full view change.<br />
              Autobahn: mini timeout(100ms) → backup leader 활성화 → 같은 slot 제안 → 원 leader 복귀 시 reconciliation
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              traditional: <code>T+3delta = 1.1s</code> vs Autobahn: <code>100ms+2delta = 500ms</code> → 2x+ faster.<br />
              99% happy path (fast), 1% failure handling (slow but bounded), blip-specific optimization
            </p>
          </div>
        </div>
        <p className="leading-7">
          Slow path: <strong>timeout + TC + resume</strong>.<br />
          Blip handling: mini timeout + backup leader → 2x+ 빠름.<br />
          99% happy + 1% failure + fast blip recovery.
        </p>

        {/* ── View Change Mechanism ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change Mechanism</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">View Change Protocol</p>
            <p className="text-sm mb-2">
              Trigger: timeout T(500ms) → leader suspected → broadcast Timeout message
            </p>
            <p className="text-sm">
              <strong>Timeout message</strong>: <code>slot</code>, <code>view</code>, <code>highQC</code> (latest committed QC), <code>lane_state</code> (LaneAcks), <code>signature</code>
            </p>
            <p className="text-sm mt-1">
              New leader: <code>schedule[(v+1) mod n]</code>. <code>2f+1</code> timeouts → TC → max highQC → lane state merged → fast path resume
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Safety &amp; Optimizations</p>
            <p className="text-sm mb-2">
              Safety: TC replaces old view certificates, max highQC preserved, committed slots never reverted, quorum intersection
            </p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Implicit timeout</p>
                <p className="text-muted-foreground">명시적 TIMEOUT 불필요 시 Lane activity로 감지</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Parallel view change</p>
                <p className="text-muted-foreground">multiple slots in flight, 각 slot 독립 VC, 서로 block 안 함</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Blip-specific</p>
                <p className="text-muted-foreground">short timeout → blip mode, longer → full VC. adaptive threshold</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm">
              <strong>Performance</strong>: VC latency 300ms, blip recovery 100ms (vs HotStuff 1s) → 3-10x faster.<br />
              <strong>Lanes 통합</strong>: view change 중에도 lanes 계속 active, batch dissemination 미중단, slot ordering만 pause → throughput 영향 최소
            </p>
          </div>
        </div>
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
