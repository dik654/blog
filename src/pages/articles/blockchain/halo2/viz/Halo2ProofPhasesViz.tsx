import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.55 };

const C = {
  p1: '#3b82f6', // advice commit
  p2: '#10b981', // challenges β, γ
  p3: '#f59e0b', // permutation z(X)
  p4: '#a855f7', // lookup polynomials
  p5: '#ef4444', // SHPLONK opening
  cx: '#06b6d4', // complexity / memory
};

const PHASES = [
  { id: 1, label: 'Phase 1', sub: 'Advice commit', tag: '[a]_1', color: C.p1 },
  { id: 2, label: 'Phase 2', sub: 'Challenges', tag: 'β, γ', color: C.p2 },
  { id: 3, label: 'Phase 3', sub: 'Permutation', tag: 'z(X)', color: C.p3 },
  { id: 4, label: 'Phase 4', sub: 'Lookup', tag: 'h_A, h_T, g', color: C.p4 },
  { id: 5, label: 'Phase 5', sub: 'Opening', tag: 'SHPLONK', color: C.p5 },
];

const STEPS = [
  {
    label: '① PLONKish Proof 5단계 개요',
    body: (
      <>
        Halo2 의 <code>create_proof</code> 는 5단계 파이프라인. advice commit → challenge squeeze → permutation
        grand product → lookup → SHPLONK multi-point opening 순으로 진행. 각 phase 의 결과는 transcript 에 누적되어 다음 challenge 의 시드가 됨.
      </>
    ),
  },
  {
    label: '② Phase 1 — Advice Commit',
    body: (
      <>
        <code>synthesize()</code> 가 witness 를 advice column 에 채우고, 각 column <M>{'a(X)'}</M> 를 다항식으로 보간.
        MSM 으로 <M>{'[a(\\tau)]_1'}</M> commitment 계산 → transcript 추가.
      </>
    ),
  },
  {
    label: '③ Phase 2-3 — Challenges & Permutation z(X)',
    body: (
      <>
        Transcript hash 로 <M>{'\\beta, \\gamma'}</M> squeeze. Grand product
        <M>{' z(\\omega X) / z(X) = num/den '}</M>를 행 따라 누적 곱셈하여 column permutation 을 검증.
      </>
    ),
  },
  {
    label: '④ Phase 4 — Lookup Polynomials',
    body: (
      <>
        Plookup 변형. 각 lookup table 에 대해 advice 값과 table 값을 결합해
        <M>{' h_A(X), h_T(X), g(X) '}</M>를 만들고, multiset 포함 관계를 grand product 로 환원.
      </>
    ),
  },
  {
    label: '⑤ Phase 5 — Quotient & SHPLONK Opening',
    body: (
      <>
        모든 제약 다항식을 vanishing <M>{'Z_H(X)'}</M> 로 나눈 quotient <M>{'t(X)'}</M> 계산. 여러 다항식의
        point evaluation 을 SHPLONK 로 합쳐 단일 opening proof 로 압축 → 최종 proof.
      </>
    ),
  },
  {
    label: '⑥ 복잡도 & 메모리 요구',
    body: (
      <>
        FFT <M>{'O(n \\log n)'}</M>, MSM <M>{'O(n)'}</M>. 증명 시간 10s~60s, GPU 5-10x speedup.
        메모리는 회로 크기에 비례 — <M>{'2^{20}'}</M> ~8GB, <M>{'2^{24}'}</M> ~64GB, zkEVM 128GB+.
      </>
    ),
  },
];

const ROWS = 4, COLS = 6, CELL = 14;

export default function Halo2ProofPhasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="h2arr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* ① 5-phase overview */}
          {step === 0 && (
            <g>
              <text x={260} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fill="#475569">
                Halo2 create_proof — 5 Phases
              </text>
              {PHASES.map((p, i) => {
                const x = 16 + i * 100;
                return (
                  <g key={p.id}>
                    <motion.rect x={x} y={100} width={86} height={70} rx={8}
                      initial={{ opacity: 0, y: 116 }}
                      animate={{ opacity: 1, y: 100, fill: `${p.color}1c`, stroke: p.color, strokeWidth: 1.4 }}
                      transition={{ ...sp, delay: i * 0.08 }} />
                    <motion.text x={x + 43} y={124} textAnchor="middle" fontSize={11} fontWeight={700}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: p.color }}
                      transition={{ delay: i * 0.08 + 0.1 }}>{p.label}</motion.text>
                    <motion.text x={x + 43} y={140} textAnchor="middle" fontSize={9}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.9, fill: p.color }}
                      transition={{ delay: i * 0.08 + 0.15 }}>{p.sub}</motion.text>
                    <motion.text x={x + 43} y={156} textAnchor="middle" fontSize={8} fontStyle="italic"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.65, fill: p.color }}
                      transition={{ delay: i * 0.08 + 0.2 }}>{p.tag}</motion.text>
                    {i < PHASES.length - 1 && (
                      <motion.line x1={x + 86} y1={135} x2={x + 100} y2={135}
                        stroke="#94a3b8" strokeWidth={0.8} markerEnd="url(#h2arr)"
                        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                        transition={{ delay: i * 0.08 + 0.25 }} />
                    )}
                  </g>
                );
              })}
              <motion.rect x={20} y={196} width={480} height={28} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: 1, fill: '#64748b10', stroke: '#64748b', strokeWidth: 0.6 }}
                transition={{ delay: 0.6 }} />
              <text x={260} y={214} textAnchor="middle" fontSize={9} fill="#64748b">
                각 phase 의 결과 → Fiat-Shamir transcript → 다음 challenge 시드
              </text>
              <text x={260} y={250} textAnchor="middle" fontSize={9} fill="#94a3b8">
                다음 step 부터 각 phase 의 내부 동작을 drill-down
              </text>
            </g>
          )}

          {/* ② Phase 1: advice column → polynomial → MSM → commitment */}
          {step === 1 && (
            <g>
              <text x={260} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p1}>
                Advice Matrix → Column Polynomial a(X) → MSM → [a(τ)]₁
              </text>
              {/* Matrix rows × cols, highlight column 2 */}
              {Array.from({ length: ROWS }).map((_, r) =>
                Array.from({ length: COLS }).map((_, c) => {
                  const x = 40 + c * (CELL + 4);
                  const y = 60 + r * (CELL + 4);
                  const isHi = c === 2;
                  return (
                    <motion.rect key={`${r}-${c}`} x={x} y={y} width={CELL} height={CELL} rx={2}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{
                        opacity: 1, scale: 1,
                        fill: isHi ? `${C.p1}50` : `${C.p1}15`,
                        stroke: C.p1, strokeWidth: isHi ? 1.2 : 0.5,
                      }}
                      transition={{ ...sp, delay: (r * COLS + c) * 0.025 }} />
                  );
                })
              )}
              <text x={36} y={56} fontSize={8} fill="#64748b">advice cols</text>
              <text x={40 + 2 * (CELL + 4) + CELL / 2} y={142} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={C.p1}>a(X)</text>

              {/* Polynomial curve from highlighted column */}
              <motion.path
                d="M 175 110 Q 200 80 220 100 T 270 95"
                fill="none" stroke={C.p1} strokeWidth={1.4}
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: 0.9, pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }} />
              <text x={222} y={75} textAnchor="middle" fontSize={8} fill={C.p1}>polynomial interp.</text>

              {/* Arrow to MSM */}
              <motion.line x1={285} y1={100} x2={320} y2={100}
                stroke={C.p1} strokeWidth={1} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.9 }} />
              <text x={302} y={94} textAnchor="middle" fontSize={8} fill={C.p1}>MSM</text>

              {/* MSM box */}
              <motion.rect x={325} y={82} width={86} height={40} rx={6}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p1}18`, stroke: C.p1, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 1.0 }} />
              <text x={368} y={100} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p1}>
                Σ aᵢ · Gᵢ
              </text>
              <text x={368} y={114} textAnchor="middle" fontSize={8} fill={C.p1} opacity={0.75}>
                multi-scalar mul
              </text>

              {/* Arrow to commitment */}
              <motion.line x1={415} y1={100} x2={445} y2={100}
                stroke={C.p1} strokeWidth={1} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.4 }} />

              <motion.circle cx={472} cy={100} r={20}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p1}28`, stroke: C.p1, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 1.5 }} />
              <text x={472} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p1}>[a(τ)]₁</text>
              <text x={472} y={110} textAnchor="middle" fontSize={7} fill={C.p1} opacity={0.7}>G₁ point</text>

              {/* Transcript bar */}
              <motion.rect x={40} y={200} width={440} height={36} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.p1}08`, stroke: C.p1, strokeWidth: 0.8, strokeDasharray: '3 2' }}
                transition={{ delay: 1.7 }} />
              <text x={56} y={216} fontSize={9} fontWeight={700} fill={C.p1}>Transcript</text>
              <motion.rect x={120} y={208} width={50} height={20} rx={4}
                initial={{ opacity: 0, x: 472 }}
                animate={{ opacity: 1, x: 120, fill: `${C.p1}30`, stroke: C.p1, strokeWidth: 1 }}
                transition={{ ...sp, delay: 1.9 }} />
              <text x={145} y={222} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.p1}>[a]₁</text>
              <text x={260} y={252} textAnchor="middle" fontSize={9} fill="#64748b">
                advice column 다항식 → MSM commitment → transcript 누적
              </text>
            </g>
          )}

          {/* ③ Phase 2-3: challenge squeeze + grand product progress */}
          {step === 2 && (
            <g>
              <text x={260} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p3}>
                Squeeze β, γ → Grand Product z(X)
              </text>

              {/* Transcript hash → β, γ */}
              <motion.rect x={20} y={56} width={110} height={50} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.p2}12`, stroke: C.p2, strokeWidth: 1.2 }}
                transition={sp} />
              <text x={75} y={76} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p2}>Transcript</text>
              <text x={75} y={90} textAnchor="middle" fontSize={8} fill={C.p2} opacity={0.8}>hash state</text>
              <text x={75} y={102} textAnchor="middle" fontSize={7} fill={C.p2} opacity={0.6}>(Blake2b/Poseidon)</text>

              <motion.line x1={130} y1={81} x2={170} y2={81}
                stroke={C.p2} strokeWidth={1} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.4 }} />
              <text x={150} y={75} textAnchor="middle" fontSize={8} fill={C.p2}>squeeze</text>

              <motion.circle cx={194} cy={70} r={14}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p2}25`, stroke: C.p2, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 0.55 }} />
              <text x={194} y={74} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p2}>β</text>

              <motion.circle cx={194} cy={102} r={14}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p2}25`, stroke: C.p2, strokeWidth: 1.2 }}
                transition={{ ...sp, delay: 0.7 }} />
              <text x={194} y={106} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p2}>γ</text>

              {/* Arrow to grand product */}
              <motion.line x1={212} y1={86} x2={250} y2={86}
                stroke={C.p3} strokeWidth={1} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 0.95 }} />
              <text x={232} y={80} textAnchor="middle" fontSize={8} fill={C.p3}>randomize</text>

              {/* Grand product progress: rows accumulating */}
              <text x={380} y={56} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p3}>
                z(ωX)/z(X) = num/den
              </text>
              {Array.from({ length: 8 }).map((_, i) => {
                const y = 70 + i * 16;
                const w = 30 + i * 16;
                return (
                  <g key={`gp-${i}`}>
                    <text x={262} y={y + 9} fontSize={7} fill="#64748b">row {i}</text>
                    <motion.rect x={290} y={y} width={140} height={11} rx={2}
                      fill="#64748b15" stroke="#64748b" strokeWidth={0.4}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                      transition={{ delay: 1.0 + i * 0.05 }} />
                    <motion.rect x={290} y={y} width={w} height={11} rx={2}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: w, fill: `${C.p3}50`, stroke: C.p3, strokeWidth: 0.6 }}
                      transition={{ ...sp, delay: 1.1 + i * 0.07 }} />
                    <text x={436} y={y + 9} fontSize={7} fill={C.p3}>z[{i}]</text>
                  </g>
                );
              })}
              <text x={260} y={252} textAnchor="middle" fontSize={9} fill="#64748b">
                각 row 마다 num/den 곱이 누적 → permutation 일치 시 z(ωⁿ) = 1
              </text>
            </g>
          )}

          {/* ④ Phase 4: lookup table & advice matching → h_A, h_T, g */}
          {step === 3 && (
            <g>
              <text x={260} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p4}>
                Plookup — Advice ↔ Table 매칭 → h_A, h_T, g
              </text>

              {/* Advice column */}
              <text x={70} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p4}>Advice A</text>
              {[3, 7, 1, 5, 7, 3].map((v, i) => (
                <g key={`adv-${i}`}>
                  <motion.rect x={50} y={62 + i * 20} width={40} height={16} rx={3}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 50, fill: `${C.p4}1c`, stroke: C.p4, strokeWidth: 0.8 }}
                    transition={{ ...sp, delay: i * 0.05 }} />
                  <text x={70} y={73 + i * 20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.p4}>{v}</text>
                </g>
              ))}

              {/* Lookup table */}
              <text x={170} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p4}>Table T</text>
              {[1, 2, 3, 5, 7, 9].map((v, i) => (
                <g key={`tbl-${i}`}>
                  <motion.rect x={150} y={62 + i * 20} width={40} height={16} rx={3}
                    initial={{ opacity: 0, x: 190 }}
                    animate={{ opacity: 1, x: 150, fill: `${C.p4}1c`, stroke: C.p4, strokeWidth: 0.8 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.05 }} />
                  <text x={170} y={73 + i * 20} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.p4}>{v}</text>
                </g>
              ))}

              {/* Matching lines */}
              {[
                { a: 0, t: 2 },
                { a: 1, t: 4 },
                { a: 2, t: 0 },
                { a: 3, t: 3 },
                { a: 4, t: 4 },
                { a: 5, t: 2 },
              ].map((m, i) => (
                <motion.line key={`mat-${i}`}
                  x1={92} y1={70 + m.a * 20}
                  x2={148} y2={70 + m.t * 20}
                  stroke={C.p4} strokeWidth={0.6} strokeDasharray="2 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
                  transition={{ delay: 0.7 + i * 0.04 }} />
              ))}

              {/* Polynomials h_A, h_T, g */}
              {[
                { x: 260, lbl: 'h_A(X)', sub: 'sorted A' },
                { x: 350, lbl: 'h_T(X)', sub: 'sorted T' },
                { x: 440, lbl: 'g(X)', sub: 'grand prod' },
              ].map((p, i) => (
                <g key={`poly-${i}`}>
                  <motion.rect x={p.x - 38} y={108} width={76} height={48} rx={6}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1, fill: `${C.p4}18`, stroke: C.p4, strokeWidth: 1.2 }}
                    transition={{ ...sp, delay: 1.0 + i * 0.12 }} />
                  <text x={p.x} y={130} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p4}>
                    {p.lbl}
                  </text>
                  <text x={p.x} y={146} textAnchor="middle" fontSize={8} fill={C.p4} opacity={0.75}>
                    {p.sub}
                  </text>
                </g>
              ))}

              {/* Arrows from matching to polynomials */}
              <motion.line x1={195} y1={120} x2={220} y2={132}
                stroke={C.p4} strokeWidth={0.8} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.4 }} />

              {/* Multiset check */}
              <motion.rect x={140} y={202} width={240} height={40} rx={6}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.p4}10`, stroke: C.p4, strokeWidth: 1, strokeDasharray: '4 3' }}
                transition={{ delay: 1.7 }} />
              <text x={260} y={220} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p4}>
                multiset {'{A}'} ⊆ {'{T}'} 검증
              </text>
              <text x={260} y={234} textAnchor="middle" fontSize={8} fill={C.p4} opacity={0.75}>
                grand product g(ωⁿ) = 1
              </text>
              <text x={260} y={262} textAnchor="middle" fontSize={9} fill="#64748b">
                각 lookup 마다 3개 다항식 추가 → transcript 커밋
              </text>
            </g>
          )}

          {/* ⑤ Phase 5: quotient + SHPLONK opening combine */}
          {step === 4 && (
            <g>
              <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.p5}>
                Quotient t(X) = (제약합) / Z_H(X) → SHPLONK Multi-Point Opening
              </text>

              {/* Multiple polynomials feeding into combine */}
              {['a(X)', 'q(X)', 'z(X)', 'h(X)', 't(X)'].map((p, i) => {
                const y = 60 + i * 26;
                return (
                  <g key={`pl-${i}`}>
                    <motion.rect x={30} y={y} width={70} height={20} rx={4}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 30, fill: `${C.p5}15`, stroke: C.p5, strokeWidth: 0.8 }}
                      transition={{ ...sp, delay: i * 0.08 }} />
                    <text x={65} y={y + 13} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.p5}>
                      {p}
                    </text>
                    <motion.line x1={102} y1={y + 10} x2={210} y2={120}
                      stroke={C.p5} strokeWidth={0.6}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.55 + i * 0.05 }} />
                  </g>
                );
              })}

              {/* Quotient highlight */}
              <text x={140} y={208} fontSize={9} fontWeight={700} fill={C.p5}>quotient:</text>
              <motion.rect x={140} y={216} width={170} height={32} rx={5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.p5}10`, stroke: C.p5, strokeWidth: 1 }}
                transition={{ delay: 0.4 }} />
              <text x={225} y={236} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p5}>
                t(X) = Σ constraint / Z_H(X)
              </text>

              {/* Combine box */}
              <motion.rect x={210} y={106} width={100} height={56} rx={8}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p5}1c`, stroke: C.p5, strokeWidth: 1.4 }}
                transition={{ ...sp, delay: 1.0 }} />
              <text x={260} y={128} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p5}>
                SHPLONK
              </text>
              <text x={260} y={144} textAnchor="middle" fontSize={8} fill={C.p5} opacity={0.8}>
                eval at z, ωz
              </text>
              <text x={260} y={156} textAnchor="middle" fontSize={8} fill={C.p5} opacity={0.8}>
                batch open
              </text>

              {/* Arrow to single proof */}
              <motion.line x1={310} y1={134} x2={360} y2={134}
                stroke={C.p5} strokeWidth={1.2} markerEnd="url(#h2arr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.4 }} />

              <motion.rect x={365} y={104} width={130} height={60} rx={8}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1, fill: `${C.p5}25`, stroke: C.p5, strokeWidth: 1.6 }}
                transition={{ ...sp, delay: 1.5 }} />
              <text x={430} y={126} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.p5}>
                π = (C, e, W)
              </text>
              <text x={430} y={140} textAnchor="middle" fontSize={8} fill={C.p5} opacity={0.8}>
                single G₁ opening
              </text>
              <text x={430} y={154} textAnchor="middle" fontSize={8} fill={C.p5} opacity={0.7}>
                final proof
              </text>

              <text x={260} y={268} textAnchor="middle" fontSize={9} fill="#64748b">
                여러 다항식의 multi-point evaluation 이 단일 opening proof 로 압축
              </text>
            </g>
          )}

          {/* ⑥ Complexity & Memory comparison */}
          {step === 5 && (
            <g>
              <text x={260} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cx}>
                연산 복잡도 & 메모리 요구
              </text>

              {/* Complexity panel */}
              <motion.rect x={20} y={42} width={230} height={104} rx={8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.cx}08`, stroke: C.cx, strokeWidth: 1 }}
                transition={sp} />
              <text x={135} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cx}>
                연산 복잡도
              </text>
              {[
                { l: 'FFT', v: 'O(n log n)' },
                { l: 'MSM', v: 'O(n)' },
                { l: '증명 시간', v: '10s ~ 60s' },
                { l: 'GPU 가속', v: '5–10× speedup' },
              ].map((c, i) => (
                <g key={`cx-${i}`}>
                  <motion.text x={36} y={82 + i * 16} fontSize={9} fontWeight={600}
                    initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.cx }}
                    transition={{ delay: 0.2 + i * 0.06 }}>
                    {c.l}
                  </motion.text>
                  <motion.text x={234} y={82 + i * 16} textAnchor="end" fontSize={9} fontWeight={700}
                    initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.cx }}
                    transition={{ delay: 0.25 + i * 0.06 }}>
                    {c.v}
                  </motion.text>
                </g>
              ))}

              {/* Memory bars */}
              <text x={390} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cx}>
                메모리 요구
              </text>
              {[
                { l: '2²⁰ circuit', mem: '8 GB', w: 50 },
                { l: '2²⁴ circuit', mem: '64 GB', w: 130 },
                { l: 'zkEVM circuit', mem: '128 GB+', w: 220 },
              ].map((m, i) => {
                const y = 78 + i * 24;
                return (
                  <g key={`mem-${i}`}>
                    <text x={262} y={y + 10} fontSize={8.5} fontWeight={600} fill={C.cx}>{m.l}</text>
                    <motion.rect x={262} y={y + 14} width={236} height={8} rx={2}
                      fill="#64748b15" stroke="#64748b" strokeWidth={0.4}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.4 + i * 0.1 }} />
                    <motion.rect x={262} y={y + 14} height={8} rx={2}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: m.w, fill: `${C.cx}55`, stroke: C.cx, strokeWidth: 0.6 }}
                      transition={{ ...sp, delay: 0.5 + i * 0.12 }} />
                    <motion.text x={262 + m.w + 6} y={y + 21} fontSize={8} fontWeight={700}
                      initial={{ opacity: 0 }} animate={{ opacity: 1, fill: C.cx }}
                      transition={{ delay: 0.7 + i * 0.12 }}>
                      {m.mem}
                    </motion.text>
                  </g>
                );
              })}

              {/* Bottom callout */}
              <motion.rect x={20} y={166} width={478} height={50} rx={8}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, fill: `${C.cx}10`, stroke: C.cx, strokeWidth: 1, strokeDasharray: '4 3' }}
                transition={{ delay: 1.0 }} />
              <text x={260} y={186} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cx}>
                회로 크기가 4× 증가하면 메모리 ≈ 8× 증가 (FFT + MSM 임시 버퍼)
              </text>
              <text x={260} y={202} textAnchor="middle" fontSize={9} fill={C.cx} opacity={0.8}>
                zkEVM 은 prover 분산화 / GPU 가속 / 회로 분할이 사실상 필수
              </text>

              <text x={260} y={244} textAnchor="middle" fontSize={9} fill="#64748b">
                점근 복잡도는 같지만 상수항과 메모리가 prover UX 를 결정
              </text>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
