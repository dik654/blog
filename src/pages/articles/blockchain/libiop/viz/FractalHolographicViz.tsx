import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  old: '#ef4444',     // legacy IOP — bottleneck
  idx: '#8b5cf6',     // indexer
  setup: '#f59e0b',   // setup phase
  prv: '#6366f1',     // prover
  vrf: '#10b981',     // verifier
  ben: '#3b82f6',     // benefit
  muted: '#94a3b8',
};

const STEPS = [
  {
    label: '① 기존 IOP — Verifier 가 full circuit 처리',
    body: '기존 IOP 한계: Verifier 가 R1CS 행렬 A, B, C 전체를 알아야 함.\n\n  verify_time = O(|Circuit|)\n\n→ 회로가 100만 게이트면 verifier 도 100만 step.\n→ L1 on-chain 검증에 부적합.',
  },
  {
    label: '② Indexer 도입 — sparse 분해',
    body: 'R1CS (A, B, C) 를 row/col/val 다항식으로 분해.\n\n  A → (row_a(x), col_a(x), val_a(x))\n  B → (row_b(x), col_b(x), val_b(x))\n  C → (row_c(x), col_c(x), val_c(x))\n\n→ Sparse matrix representation. 0 이 아닌 entry 만 저장.\n→ 행렬 자체가 다항식 oracle 로 변신.',
  },
  {
    label: '③ Setup 단계 — Indexer 한 번만 실행',
    body: 'Setup 에서 Indexer 가 한 번 동작.\n\n  Indexer(R1CS)  →  indexed_oracles\n                  =  { (row_*, col_*, val_*) }_{A,B,C}\n\n→ 결과는 compact representation.\n→ 동일 회로에 대해 영구 보관 가능.',
  },
  {
    label: '④ Prover/Verifier 분리 — Index 재사용',
    body: 'Index 는 한 번, Prover 는 매 입력마다, Verifier 는 O(log N).\n\n  Prover(Index, witness)   →  proof\n  Verifier(Index, x, π)    →  accept / reject     // O(log |C|)\n\n→ 동일 circuit + 다양한 inputs → indexer once, prove many times.',
  },
  {
    label: '⑤ Fractal Benefits — 4 가지',
    body: '① O(log N) verification — L1 on-chain 가능.\n② Reusable Indexer — 회로 변경 없을 때 setup 재사용.\n③ Recursive Composition — IVC, cycle of curves 불요.\n④ Post-quantum — FRI 기반, transparent setup.\n\nMarlin O(log² N) 보다 한 단계 더 압축.\nNova / HyperNova folding scheme 의 영감원.',
  },
];

export default function FractalHolographicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ① Verifier 가 full circuit */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.old}>
                기존 IOP — Verifier 가 모든 행렬 직접 처리
              </text>
              {/* Big circuit matrix */}
              <ModuleBox x={30} y={50} w={120} h={140} label="Full Circuit" sub="A, B, C ∈ F^{N×N}" color={C.old} />
              {/* matrix grid */}
              {[0, 1, 2, 3, 4, 5].map((r) => (
                [0, 1, 2, 3, 4, 5].map((c) => (
                  <motion.rect key={`g${r}-${c}`}
                    x={45 + c * 17} y={75 + r * 17} width={14} height={14} rx={1.5}
                    fill={(r + c) % 3 === 0 ? `${C.old}40` : `${C.old}10`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.05 + (r + c) * 0.015 }} />
                ))
              ))}
              {/* arrow */}
              <motion.line x1={155} y1={120} x2={300} y2={120}
                stroke={C.old} strokeWidth={1.2} markerEnd="url(#oa)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.2 }} />
              <text x={228} y={114} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.old}>
                전체 행렬 전송
              </text>
              <ModuleBox x={310} y={90} w={140} h={60} label="Verifier" sub="O(N) work" color={C.old} />
              <AlertBox x={310} y={165} w={140} h={30} label="bottleneck" sub="L1 on-chain ✗" color={C.old} />
              <defs>
                <marker id="oa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.old} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ② Indexer — matrix → row/col/val */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.idx}>
                R1CS 행렬 → (row, col, val) 다항식 분해
              </text>
              {/* 3 source matrices */}
              {[
                { x: 30, y: 60, label: 'A' },
                { x: 30, y: 110, label: 'B' },
                { x: 30, y: 160, label: 'C' },
              ].map((m, i) => (
                <motion.g key={m.label}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.08 }}>
                  <DataBox x={m.x} y={m.y} w={50} h={36} label={m.label} sub="sparse" color={C.idx} outlined />
                </motion.g>
              ))}
              {/* indexer */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ModuleBox x={120} y={110} w={90} h={36} label="Indexer" sub="분해" color={C.idx} />
              </motion.g>
              {/* lines from matrices to indexer */}
              {[78, 128, 178].map((y, i) => (
                <motion.line key={i} x1={80} y1={y} x2={120} y2={128}
                  stroke={C.idx} strokeWidth={0.6} opacity={0.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.05 }} />
              ))}
              {/* output polynomials */}
              {[
                { y: 50, label: 'row_a(x)', color: '#10b981' },
                { y: 76, label: 'col_a(x)', color: '#f59e0b' },
                { y: 102, label: 'val_a(x)', color: '#ec4899' },
                { y: 128, label: 'row_b(x), col_b(x), val_b(x)', color: C.idx },
                { y: 154, label: 'row_c(x), col_c(x), val_c(x)', color: C.idx },
              ].map((o, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.35 + i * 0.06 }}>
                  <rect x={240} y={o.y} width={210} height={20} rx={4}
                    fill={`${o.color}14`} stroke={o.color} strokeWidth={0.6} />
                  <text x={250} y={o.y + 14} fontSize={9} fontFamily="monospace" fill={o.color}>
                    {o.label}
                  </text>
                </motion.g>
              ))}
              <text x={345} y={200} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                sparse representation: nonzero entry 만 저장
              </text>
            </motion.g>
          )}

          {/* ③ Setup — indexer 한 번 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.setup}>
                Setup — Indexer 한 번 실행, 결과 영구 저장
              </text>
              <DataBox x={30} y={70} w={90} h={50} label="R1CS" sub="(A, B, C)" color={C.idx} outlined />
              <motion.line x1={120} y1={95} x2={170} y2={95}
                stroke={C.setup} strokeWidth={1.2} markerEnd="url(#sa)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.1 }} />
              <ModuleBox x={170} y={70} w={100} h={50} label="Indexer" sub="setup-time" color={C.setup} />
              <motion.line x1={270} y1={95} x2={320} y2={95}
                stroke={C.setup} strokeWidth={1.2} markerEnd="url(#sa)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: 0.25 }} />
              <DataBox x={320} y={70} w={130} h={50} label="indexed oracles" sub="compact, reusable" color={C.setup} outlined />

              <text x={195} y={140} fontSize={9} fontFamily="monospace" fill={C.muted}>
                I = Indexer(R1CS)
              </text>
              <text x={195} y={155} fontSize={9} fontFamily="monospace" fill={C.muted}>
                I = {'{ (row_*, col_*, val_*) }_{A,B,C}'}
              </text>

              <AlertBox x={30} y={180} w={200} h={40} label="한 번만 실행" sub="회로 고정 → I 영구 저장" color={C.setup} />
              <AlertBox x={250} y={180} w={200} h={40} label="universal-ish" sub="circuit 별 indexed oracles" color={C.idx} />
              <defs>
                <marker id="sa" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L6,3 z" fill={C.setup} />
                </marker>
              </defs>
            </motion.g>
          )}

          {/* ④ Prover/Verifier 분리 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.vrf}>
                Index 한 번 → Prover N 번 → Verifier O(log N)
              </text>
              {/* Index source */}
              <DataBox x={30} y={50} w={80} h={40} label="Index I" sub="setup once" color={C.setup} outlined />
              {/* Multiple prover runs */}
              {[0, 1, 2].map((i) => (
                <motion.g key={`p${i}`}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                  <ActionBox x={150} y={45 + i * 50} w={140} h={36}
                    label={`Prover(I, w_${i + 1})`} sub={`witness ${i + 1}`} color={C.prv} />
                  <line x1={110} y1={70} x2={150} y2={63 + i * 50}
                    stroke={C.setup} strokeWidth={0.6} opacity={0.5} />
                  <line x1={290} y1={63 + i * 50} x2={330} y2={120}
                    stroke={C.prv} strokeWidth={0.6} opacity={0.5} />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <ModuleBox x={330} y={100} w={120} h={40} label="Verifier" sub="O(log |C|)" color={C.vrf} />
              </motion.g>
              <text x={390} y={158} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.vrf}>
                accept / reject
              </text>

              <text x={30} y={180} fontSize={9} fontFamily="monospace" fill={C.muted}>
                Prover(Index, witness)  →  proof π
              </text>
              <text x={30} y={196} fontSize={9} fontFamily="monospace" fill={C.muted}>
                Verifier(Index, x, π)   →  accept     // O(log |C|)
              </text>
              <text x={30} y={216} fontSize={9} fontWeight={600} fill={C.vrf}>
                indexer once, prove many times
              </text>
            </motion.g>
          )}

          {/* ⑤ Benefits — 4 cards */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ben}>
                Fractal Benefits
              </text>
              {[
                { x: 30, y: 50, label: 'O(log N) verify', sub: 'L1 on-chain', color: C.vrf },
                { x: 250, y: 50, label: 'Reusable Indexer', sub: '회로 1회 setup', color: C.setup },
                { x: 30, y: 130, label: 'Recursive (IVC)', sub: 'no cycle of curves', color: C.idx },
                { x: 250, y: 130, label: 'Post-quantum', sub: 'FRI / hash-based', color: C.ben },
              ].map((b, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ ...sp, delay: 0.05 + i * 0.1 }}>
                  <ModuleBox x={b.x} y={b.y} w={200} h={64} label={b.label} sub={b.sub} color={b.color} />
                </motion.g>
              ))}
              <text x={240} y={220} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={C.muted}>
                Marlin O(log² N)  →  Fractal O(log N)  →  Nova folding 의 영감
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
