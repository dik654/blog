import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.6 };

const C = {
  p1: '#6366f1', // trace commit
  p2: '#10b981', // quotient
  p3: '#f59e0b', // FRI
  p4: '#ec4899', // opening
  p5: '#8b5cf6', // final
  opt: '#3b82f6',
};

const PHASES = [
  { id: 1, label: 'Phase 1', sub: 'Trace Commit', color: C.p1 },
  { id: 2, label: 'Phase 2', sub: 'Quotient C(X)', color: C.p2 },
  { id: 3, label: 'Phase 3', sub: 'FRI Test', color: C.p3 },
  { id: 4, label: 'Phase 4', sub: 'Openings', color: C.p4 },
  { id: 5, label: 'Phase 5', sub: 'Final Check', color: C.p5 },
];

const STEPS = [
  { label: '① 5단계 개요', body: 'AIR 트레이스 커밋 → 몫 다항식 → FRI 저차 검증 → 개구 증명 → 최종 검증.\n각 phase 의 내부를 차례로 펼쳐본다.' },
  { label: '② Phase 1 — Trace Commitment', body: 'AIR 실행 트레이스 M[rows×cols] 의 각 column 을 다항식으로 보간.\nLDE(Low-Degree Extension) 후 Merkle 트리에 커밋, root 를 transcript 에 추가.' },
  { label: '③ Phase 2 — Quotient C(X)', body: 'AIR 제약 만족 시 C(X) = AIR_poly(M) / Z_H(X) 가 low-degree.\nZ_H 는 trace domain 의 vanishing polynomial.' },
  { label: '④ Phase 3 — FRI Folding', body: 'C(X) 의 degree 를 log N 단계 folding 으로 검증.\n각 round 마다 commitment + Fiat-Shamir challenge.' },
  { label: '⑤ Phase 4 — Opening Proofs', body: 'Verifier 가 random query points 선택, Prover 가 Merkle path + claimed value 제출.\nTrace 와 constraint 의 consistency 검증.' },
  { label: '⑥ Phase 5 — Final Check', body: '마지막 FRI folding 결과가 constant (degree 0) 다항식이어야 한다.\nVerifier 가 모든 commitment 와 opening 을 재검증.' },
  { label: '⑦ Complexity & Plonky3 최적화', body: 'Prover O(n log n) FFT, Verifier O(log² n), Proof O(log² n × λ).\nbatching · DEEP-ALI · multi-thread · SIMD 로 상수항 단축.' },
];

const ROWS = 3, COLS = 5;
const CELL = 14;

export default function STARKFivePhaseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* ① 5-phase overview row */}
          {step === 0 && (
            <g>
              {PHASES.map((p, i) => {
                const x = 20 + i * 90;
                return (
                  <g key={p.id}>
                    <motion.rect x={x} y={80} width={80} height={60} rx={8}
                      initial={{ opacity: 0, y: 90 }}
                      animate={{ opacity: 1, y: 80, fill: `${p.color}18`, stroke: p.color, strokeWidth: 1.4 }}
                      transition={{ ...sp, delay: i * 0.08 }} />
                    <motion.text x={x + 40} y={108} textAnchor="middle" fontSize={11} fontWeight={700}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: p.color }}
                      transition={{ delay: i * 0.08 + 0.1 }}>{p.label}</motion.text>
                    <motion.text x={x + 40} y={124} textAnchor="middle" fontSize={9}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: p.color }}
                      transition={{ delay: i * 0.08 + 0.15 }}>{p.sub}</motion.text>
                    {i < PHASES.length - 1 && (
                      <motion.line x1={x + 80} y1={110} x2={x + 90} y2={110}
                        stroke="#94a3b8" strokeWidth={0.8}
                        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                        transition={{ delay: i * 0.08 + 0.2 }} />
                    )}
                  </g>
                );
              })}
              <text x={240} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill="#475569">
                STARK 증명 5단계
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="#64748b">
                각 phase 를 클릭하면 내부 동작을 drill-down 한다
              </text>
            </g>
          )}

          {/* ② Phase 1: matrix → polynomial column → LDE → merkle root */}
          {step === 1 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p1}>
                Trace Matrix M[3×5] → Column Polynomials → LDE → Merkle Root
              </text>
              {/* Matrix */}
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const x = 50 + c * (CELL + 4);
                  const y = 60 + r * (CELL + 4);
                  return (
                    <motion.rect key={`${r}-${c}`} x={x} y={y} width={CELL} height={CELL} rx={2}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1, fill: `${C.p1}25`, stroke: C.p1, strokeWidth: 0.6 }}
                      transition={{ ...sp, delay: (r * COLS + c) * 0.04 }} />
                  );
                })
              )}
              <text x={50 - 6} y={70} fontSize={8} fill="#64748b">M</text>
              {/* Column → polynomial curves above each column */}
              {Array.from({ length: COLS }).map((_, c) => {
                const x0 = 50 + c * (CELL + 4) + CELL / 2;
                const cx = x0;
                return (
                  <motion.path key={`poly-${c}`}
                    d={`M ${cx - 7} 130 Q ${cx} ${118 + (c % 2) * 4} ${cx + 7} 130`}
                    fill="none" stroke={C.p1} strokeWidth={1.2}
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 0.9, pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + c * 0.08 }} />
                );
              })}
              <text x={130} y={148} textAnchor="middle" fontSize={8} fill={C.p1}>column polynomials</text>
              {/* LDE arrow */}
              <motion.line x1={210} y1={95} x2={260} y2={95} stroke={C.p1} strokeWidth={1}
                markerEnd="url(#arr1)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 1.0 }} />
              <text x={235} y={88} textAnchor="middle" fontSize={8} fill={C.p1}>LDE ×8</text>
              {/* Extended evaluation domain */}
              {Array.from({ length: 16 }).map((_, i) => (
                <motion.circle key={`lde-${i}`} cx={270 + (i % 8) * 8} cy={85 + Math.floor(i / 8) * 10}
                  r={2.4}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.85, fill: C.p1 }}
                  transition={{ delay: 1.1 + i * 0.02 }} />
                ))}
              <text x={302} y={118} textAnchor="middle" fontSize={8} fill={C.p1}>evaluation domain</text>
              {/* Merkle root */}
              <motion.line x1={350} y1={95} x2={385} y2={95} stroke={C.p1} strokeWidth={1}
                markerEnd="url(#arr1)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ delay: 1.6 }} />
              <motion.rect x={388} y={78} width={70} height={36} rx={5}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p1}25`, stroke: C.p1, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 1.7 }} />
              <text x={423} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p1}>Merkle</text>
              <text x={423} y={106} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p1}>Root</text>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="#64748b">
                root → Fiat-Shamir transcript
              </text>
              <defs>
                <marker id="arr1" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill={C.p1} />
                </marker>
              </defs>
            </g>
          )}

          {/* ③ Phase 2: Quotient formula */}
          {step === 2 && (
            <g>
              <text x={240} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p2}>
                Constraint Quotient Polynomial
              </text>
              <motion.rect x={80} y={66} width={320} height={70} rx={8}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p2}10`, stroke: C.p2, strokeWidth: 1.3 }}
                transition={sp} />
              <motion.text x={240} y={102} textAnchor="middle" fontSize={18} fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.p2 }}
                transition={{ delay: 0.2 }}>
                C(X) = AIR_poly(M) / Z_H(X)
              </motion.text>
              <motion.text x={240} y={124} textAnchor="middle" fontSize={9}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7, fill: C.p2 }}
                transition={{ delay: 0.4 }}>
                Z_H(X) = vanishing polynomial on trace domain H
              </motion.text>
              {/* low-degree line */}
              <motion.path d="M 60 180 Q 240 160 420 180" fill="none" stroke={C.p2} strokeWidth={1.6}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.9, pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }} />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill={C.p2}>
                low-degree iff constraints hold
              </text>
              <text x={240} y={218} textAnchor="middle" fontSize={8} fill="#64748b">
                division 이 정수(low-degree) 면 모든 row 가 제약 만족
              </text>
            </g>
          )}

          {/* ④ Phase 3: FRI folding bars */}
          {step === 3 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p3}>
                FRI Folding — log N = 20 단계
              </text>
              {Array.from({ length: 20 }).map((_, i) => {
                const x = 30 + i * 21;
                return (
                  <motion.rect key={i} x={x} y={70} width={16} height={80} rx={2}
                    initial={{ opacity: 0, height: 80, y: 70 }}
                    animate={{
                      opacity: 1,
                      height: Math.max(6, 80 - i * 4),
                      y: 70 + i * 2,
                      fill: `${C.p3}28`, stroke: C.p3, strokeWidth: 0.8,
                    }}
                    transition={{ ...sp, delay: i * 0.06 }} />
                );
              })}
              {/* round labels */}
              <text x={38} y={166} fontSize={8} fill={C.p3} fontWeight={600}>r=0</text>
              <text x={240 + 18} y={166} fontSize={8} fill={C.p3} fontWeight={600}>r=10</text>
              <text x={420} y={166} fontSize={8} fill={C.p3} fontWeight={600}>r=19</text>
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill={C.p3}>
                각 round: commitment + Fiat-Shamir β challenge → fold
              </text>
              <motion.text x={240} y={208} textAnchor="middle" fontSize={9} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.p3 }}
                transition={{ delay: 1.2 }}>
                degree 가 절반씩 축소 → constant 에 도달
              </motion.text>
            </g>
          )}

          {/* ⑤ Phase 4: random query → Merkle path */}
          {step === 4 && (
            <g>
              <text x={240} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p4}>
                Random Query Points → Merkle Path Openings
              </text>
              {/* Merkle tree: root + 2 + 4 + 8 leaves */}
              <motion.circle cx={240} cy={60} r={9}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${C.p4}30`, stroke: C.p4, strokeWidth: 1.2 }}
                transition={sp} />
              <text x={240} y={63} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.p4}>R</text>
              {[180, 300].map((x, i) => (
                <g key={`l1-${i}`}>
                  <motion.line x1={240} y1={68} x2={x} y2={92} stroke={C.p4} strokeWidth={0.8}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.1 + i * 0.05 }} />
                  <motion.circle cx={x} cy={100} r={7}
                    initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${C.p4}20`, stroke: C.p4, strokeWidth: 1 }}
                    transition={{ ...sp, delay: 0.15 + i * 0.05 }} />
                </g>
              ))}
              {[150, 210, 270, 330].map((x, i) => {
                const parent = i < 2 ? 180 : 300;
                return (
                  <g key={`l2-${i}`}>
                    <motion.line x1={parent} y1={107} x2={x} y2={132} stroke={C.p4} strokeWidth={0.8}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.25 + i * 0.04 }} />
                    <motion.circle cx={x} cy={140} r={6}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${C.p4}15`, stroke: C.p4, strokeWidth: 1 }}
                      transition={{ ...sp, delay: 0.3 + i * 0.04 }} />
                  </g>
                );
              })}
              {[120, 150, 180, 210, 240, 270, 300, 330].map((x, i) => {
                const parents = [150, 150, 210, 210, 270, 270, 330, 330];
                const isQuery = i === 2 || i === 5;
                return (
                  <g key={`leaf-${i}`}>
                    <motion.line x1={parents[i]} y1={146} x2={x} y2={170} stroke={C.p4}
                      strokeWidth={isQuery ? 1.6 : 0.6}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isQuery ? 0.95 : 0.4 }}
                      transition={{ delay: 0.5 + i * 0.03 }} />
                    <motion.rect x={x - 7} y={172} width={14} height={14} rx={2}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        fill: isQuery ? `${C.p4}45` : `${C.p4}10`,
                        stroke: C.p4,
                        strokeWidth: isQuery ? 1.4 : 0.6,
                      }}
                      transition={{ ...sp, delay: 0.55 + i * 0.03 }} />
                  </g>
                );
              })}
              <motion.text x={180} y={208} textAnchor="middle" fontSize={9} fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.p4 }}
                transition={{ delay: 1.0 }}>query #1</motion.text>
              <motion.text x={270} y={208} textAnchor="middle" fontSize={9} fontWeight={700}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.p4 }}
                transition={{ delay: 1.1 }}>query #2</motion.text>
              <text x={240} y={228} textAnchor="middle" fontSize={8} fill="#64748b">
                Merkle path + claimed value 로 trace ↔ constraint 일치 검증
              </text>
            </g>
          )}

          {/* ⑥ Phase 5: final constant check */}
          {step === 5 && (
            <g>
              <text x={240} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p5}>
                Final Folding → Constant Polynomial 검증
              </text>
              {/* descending bars */}
              {[60, 50, 40, 30, 20, 12, 8, 6].map((h, i) => (
                <motion.rect key={i} x={50 + i * 28} y={130 - h} width={20} height={h} rx={2}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1, fill: `${C.p5}30`, stroke: C.p5, strokeWidth: 0.8 }}
                  transition={{ ...sp, delay: i * 0.08 }}
                  style={{ transformOrigin: `${60 + i * 28}px 130px` }} />
              ))}
              <text x={155} y={148} textAnchor="middle" fontSize={9} fill={C.p5}>fold rounds → degree ↓</text>
              {/* arrow to final box */}
              <motion.line x1={290} y1={120} x2={330} y2={120} stroke={C.p5} strokeWidth={1.2}
                markerEnd="url(#arr5)" initial={{ opacity: 0 }} animate={{ opacity: 0.9 }}
                transition={{ delay: 0.9 }} />
              <motion.rect x={335} y={100} width={110} height={50} rx={6}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p5}20`, stroke: C.p5, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 1.0 }} />
              <text x={390} y={120} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p5}>
                f(X) = c
              </text>
              <text x={390} y={138} textAnchor="middle" fontSize={8} fill={C.p5}>degree 0 (constant)</text>
              <motion.text x={240} y={185} textAnchor="middle" fontSize={9} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.p5 }}
                transition={{ delay: 1.4 }}>
                Verifier 가 모든 commitment + opening 재검증
              </motion.text>
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="#64748b">
                마지막 fold 결과가 constant 가 아니면 reject
              </text>
              <defs>
                <marker id="arr5" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <path d="M 0 0 L 6 3 L 0 6 z" fill={C.p5} />
                </marker>
              </defs>
            </g>
          )}

          {/* ⑦ Complexity table + Plonky3 optimizations */}
          {step === 6 && (
            <g>
              <text x={240} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.opt}>
                Complexity & Plonky3 최적화
              </text>
              {/* complexity table */}
              <motion.rect x={40} y={42} width={400} height={66} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: `${C.opt}08`, stroke: C.opt, strokeWidth: 1 }}
                transition={sp} />
              {[
                { l: 'Prover', v: 'O(n log n)', n: 'FFT 다수' },
                { l: 'Verifier', v: 'O(log² n)', n: 'succinct' },
                { l: 'Proof', v: 'O(log² n × λ)', n: 'λ = 보안' },
              ].map((c, i) => {
                const x = 60 + i * 130;
                return (
                  <g key={i}>
                    <motion.text x={x + 55} y={60} textAnchor="middle" fontSize={9} fontWeight={700}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opt }}
                      transition={{ delay: 0.1 + i * 0.08 }}>{c.l}</motion.text>
                    <motion.text x={x + 55} y={80} textAnchor="middle" fontSize={11} fontWeight={700}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.opt }}
                      transition={{ delay: 0.15 + i * 0.08 }}>{c.v}</motion.text>
                    <motion.text x={x + 55} y={98} textAnchor="middle" fontSize={8}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.7, fill: C.opt }}
                      transition={{ delay: 0.2 + i * 0.08 }}>{c.n}</motion.text>
                  </g>
                );
              })}
              {/* 4 optimization cards */}
              {[
                { l: 'Batching', s: '여러 다항식 묶음 커밋' },
                { l: 'DEEP-ALI', s: '제약 결합 강화' },
                { l: 'Multi-thread', s: 'Rayon 병렬화' },
                { l: 'SIMD', s: 'AVX2/NEON vector' },
              ].map((o, i) => {
                const x = 40 + i * 105;
                return (
                  <g key={i}>
                    <motion.rect x={x} y={130} width={95} height={62} rx={6}
                      initial={{ opacity: 0, y: 140 }}
                      animate={{ opacity: 1, y: 130, fill: `${C.opt}15`, stroke: C.opt, strokeWidth: 1.1 }}
                      transition={{ ...sp, delay: 0.5 + i * 0.1 }} />
                    <text x={x + 47} y={155} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.opt}>
                      {o.l}
                    </text>
                    <text x={x + 47} y={172} textAnchor="middle" fontSize={8} fill={C.opt} opacity={0.8}>
                      {o.s}
                    </text>
                  </g>
                );
              })}
              <text x={240} y={216} textAnchor="middle" fontSize={8} fill="#64748b">
                4가지 최적화로 점근적 복잡도는 유지하되 상수항을 크게 단축
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
