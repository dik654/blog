import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b' };

function UncertDAGViz() {
  const rounds = [
    { x: 30, label: 'R1', color: C.r1 },
    { x: 170, label: 'R2', color: C.r2 },
    { x: 310, label: 'R3', color: C.r3 },
  ];
  const nodes = [0, 1, 2];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Uncertified DAG: 블록이 이전 라운드 블록을 직접 참조</p>
      <svg viewBox="0 0 420 110" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {rounds.map((r, ri) => nodes.map((n) => (
          <motion.g key={`${ri}-${n}`} initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: ri * 0.15 + n * 0.05 }}>
            <ModuleBox x={r.x} y={10 + n * 32} w={80} h={26}
              label={`V${n + 1}`} sub={r.label} color={r.color} />
          </motion.g>
        )))}
        {nodes.map((n) => nodes.map((m) => (
          <motion.line key={`e1-${n}-${m}`}
            x1={170} y1={23 + n * 32} x2={110} y2={23 + m * 32}
            stroke={C.r2} strokeWidth={0.5} opacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + n * 0.05 }} />
        )))}
        {nodes.map((n) => nodes.map((m) => (
          <motion.line key={`e2-${n}-${m}`}
            x1={310} y1={23 + n * 32} x2={250} y2={23 + m * 32}
            stroke={C.r3} strokeWidth={0.5} opacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + n * 0.05 }} />
        )))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 각 블록이 이전 라운드의 {'≥'} 2f+1 블록을 참조 → 참조 = 암시적 투표
      </p>
    </div>
  );
}

export default function UncertifiedDAG() {
  return (
    <section id="uncertified-dag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Uncertified DAG</h2>
      <UncertDAGViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          기존 Narwhal: 블록마다 <strong>2f+1 서명 수집 → certificate</strong>.<br />
          Mysticeti: 이 과정 생략 — 블록이 이전 라운드 블록 참조하면 유효.<br />
          참조 행위 자체가 투표 → 인증 라운드 1개 절약.
        </p>

        {/* ── Certified vs Uncertified ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Certified vs Uncertified DAG</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Narwhal (Certified DAG):
//
// Vertex creation:
// 1. Author broadcasts Header
// 2. Validators verify + sign
// 3. Author collects 2f+1 signatures
// 4. Certificate formed (Header + sigs)
// 5. Certificate broadcasted
// 6. DAG node = Certificate
//
// Overhead:
// - extra round-trip (signature collection)
// - +1 round latency per vertex
// - bandwidth: 2f+1 signatures per vertex
// - total latency: header_prop + sig_collect + cert_broadcast
//   = 3δ per round

// Mysticeti (Uncertified DAG):
//
// Vertex creation:
// 1. Author broadcasts block (no signatures needed)
// 2. DAG node = Block
// 3. Next round blocks reference this
//
// No certificate:
// - no explicit signature collection
// - no cert broadcast
// - only block propagation (1δ per round)
// - implicit voting via references

// Why does it work (safety)?
//
// Observation:
// - next round block references this block
// - 2f+1 references = 2f+1 validator acknowledgement
// - same as signature collection, but implicit
// - "reference = vote"
//
// Safety:
// - block B at round r
// - round r+1: 2f+1 blocks reference B
// - equivalent to 2f+1 sig on B
// - committed if later anchors reference B

// Latency savings:
// Narwhal: 3δ per round (header + sig + cert)
// Mysticeti: 1δ per round (block only)
// 3x speedup per round

// Commit latency:
// Bullshark: 4 rounds × 1δ (certified) + overhead
// Mysticeti: 3 rounds × 1δ (uncertified)
// total: 2s → 390ms (WAN)

// Byzantine handling:
// - Byzantine author equivocation?
//   → slashable offense (two blocks)
// - Byzantine references?
//   → reject invalid references
// - insufficient references?
//   → block skipped (like anchor skip)`}
        </pre>
        <p className="leading-7">
          Uncertified DAG: <strong>reference = implicit vote</strong>.<br />
          certificate round 제거 → 3x 빠름 per round.<br />
          safety equivalent to certified (quorum intersection).
        </p>

        {/* ── Uncertified의 Trade-off ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Uncertified DAG의 Trade-offs</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Uncertified DAG Trade-offs:

// 장점:
// 1. Lower latency:
//    - 1δ per round (vs 3δ in Narwhal)
//    - 3x speedup
//
// 2. Simpler protocol:
//    - no signature collection
//    - simpler DAG validation
//    - less state per vertex
//
// 3. Lower bandwidth:
//    - no certificates transmitted
//    - blocks only
//    - ~30% bandwidth savings

// 단점:
// 1. Availability proof weaker:
//    - no explicit signed proof
//    - rely on reference transitivity
//    - 2f+1 validator가 eventually reference
//
// 2. Complex correctness proofs:
//    - uncertified → indirect proofs
//    - more intricate safety arguments
//    - harder to verify
//
// 3. Slower failure propagation:
//    - certificate broadcast was fast
//    - references propagate slower
//    - Byzantine detection delayed

// 해결 방안:
//
// 1. Direct vote (optional):
//    - Mysticeti는 explicit vote 옵션
//    - slashable equivocation 감지
//    - consensus path에서 사용
//
// 2. Fast commit rule:
//    - 2f+1 votes at round r+1 = commit round r
//    - explicit commit message
//    - speedier progression
//
// 3. Implicit certification:
//    - subsequent references = proof
//    - causal history 완전성
//    - 마찬가지 availability 보장

// Mysticeti 결정:
// - uncertified base DAG
// - optional certified votes at commit
// - best of both worlds
// - latency 우선, safety 유지`}
        </pre>
        <p className="leading-7">
          Uncertified: <strong>3x 빠름 + 30% bandwidth 절약</strong>.<br />
          trade-off: 복잡한 proof, slower failure detection.<br />
          Mysticeti는 uncertified base + optional certified votes.
        </p>

        {/* ── Safety Proof Sketch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety Proof Sketch</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Mysticeti Safety Claim:
// committed block B는 revert 불가

// Uncertified safety 증명 sketch:
//
// 정의:
// - block B at round r
// - "2f+1 referenced" = round r+1의 2f+1 blocks가 B 참조
// - "committed" = 특정 anchor rule에 의해 decided

// Claim:
// block B committed → conflicting B' committed 불가

// Proof idea:
// 1. B committed → 2f+1 references at round r+1
// 2. 2f+1 references의 authors 중 f+1 honest
// 3. honest author는 두 conflicting block 참조 안 함
//    (byzantine detection + rejection)
// 4. → conflicting B' 2f+1 references 불가능
// 5. → B' commit 불가

// Key insight:
// certificate (explicit signatures) 없어도
// reference-based voting이 동일 guarantee 제공
// 조건: quorum intersection property

// Byzantine equivocation:
// - author가 두 block at same round?
// - honest validators detect + reject
// - slashing evidence
// - only one block gets 2f+1 references

// 실제 Mysticeti safety proof:
// - formal proof in paper
// - TLA+ specification
// - Coq/Isabelle verified (ongoing)
// - production-ready

// Comparison with certified:
// Certified: safety via explicit signatures
// Uncertified: safety via implicit references
// Both achieve quorum intersection
// → equivalent safety`}
        </pre>
        <p className="leading-7">
          Uncertified safety: <strong>reference = implicit vote</strong> + quorum intersection.<br />
          2f+1 references → f+1 honest → conflicting commit 불가.<br />
          certified와 equivalent safety guarantee.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Mysticeti 이전엔 certified DAG가 표준이었나</strong> — explicit &gt; implicit.<br />
          초기 DAG-BFT 연구 (Narwhal 2021): safety 증명 용이성 우선.<br />
          Mysticeti (2024): safety는 reference로 충분 증명 가능.<br />
          학문적 발견 → 실무 최적화 — 3년 걸린 breakthrough.
        </p>
      </div>
    </section>
  );
}
