import { motion } from 'framer-motion';
import StepViz, { type StepDef } from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const C = {
  doubling: '#3b82f6',
  addition: '#f59e0b',
  sparse: '#10b981',
  full: '#ef4444',
  cyclotomic: '#a855f7',
  tangent: '#06b6d4',
  double: '#3b82f6',
  text: '#e2e8f0',
  sub: '#94a3b8',
  grid: '#475569',
};

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.55 };

const STEPS: StepDef[] = [
  {
    label: '① 초기 상태: f = 1, T = Q, loop counter L',
    body: (
      <>
        BN254 의 loop counter 는 <M>{'6x + 2'}</M> 로 ~64 bits, Hamming weight 30. 매 비트마다 doubling 하고, 비트가 1 이면 addition 까지 추가.
      </>
    ),
  },
  {
    label: '② 1 iteration drill-down (doubling 단계)',
    body: 'tangent_line(T) → T = 2T → f = f² → f *= line (sparse). 4 substep 이 매 반복마다 실행.',
  },
  {
    label: '③ if bit set: addition 단계 추가',
    body: 'chord_line(T,Q) → T = T + Q → f *= line (sparse). 30 회 (Hamming weight) 만큼 추가 비용.',
  },
  {
    label: '④ 반복당 비용 (Fp mults)',
    body: 'Doubling 74m = cyclotomic 18 + tangent 12 + double 5 + sparse 39. Addition 64m = chord 15 + add 10 + sparse 39.',
  },
  {
    label: '⑤ 누적: 64 doubling × 74 + 30 addition × 64 = 6,700m',
    body: '4,736m (doubling) + 1,920m (addition) ≈ 6,700 Fp mults — Miller Loop 한 번 비용.',
  },
  {
    label: '⑥ Sparse vs Full: ~5,000m 절감 (~40%)',
    body: 'Sparse mul_by_034 없이 full Fp12×Fp12 (54m) 로 했다면 +5,076m 추가 → 총 ~11,700m. sparse 가 ~40% 비용 절감.',
  },
];

/* ---------- Step 1: Initial state ---------- */
function Step1() {
  // 64-bit loop counter — 30 bits set (Hamming weight)
  const bits = Array.from({ length: 64 }, (_, i) =>
    [0, 2, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31,
     33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 56, 60].includes(i) ? 1 : 0
  );
  const X0 = 30, BW = 7, GAP = 0.6, BY = 150;

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        Miller Loop 초기 상태
      </text>

      {/* f = 1 */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={50} y={56} width={140} height={56} rx={10}
          fill={`${C.sparse}15`} stroke={C.sparse} strokeWidth={1.4} />
        <text x={120} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sparse}>f (Fp12 accumulator)</text>
        <text x={120} y={100} textAnchor="middle" fontSize={16} fontWeight={800} fill={C.text}>= 1</text>
      </motion.g>

      {/* T = Q */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.15 }}>
        <rect x={330} y={56} width={140} height={56} rx={10}
          fill={`${C.doubling}15`} stroke={C.doubling} strokeWidth={1.4} />
        <text x={400} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.doubling}>T (G2 point)</text>
        <text x={400} y={100} textAnchor="middle" fontSize={16} fontWeight={800} fill={C.text}>= Q</text>
      </motion.g>

      {/* Loop counter L = 64-bit bar */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={X0} y={138} fontSize={10} fontWeight={700} fill={C.sub}>
          L = 6x + 2 (BN254 loop counter, 64 bits)
        </text>
        {bits.map((b, i) => {
          const x = X0 + i * (BW + GAP);
          return (
            <motion.rect key={i}
              x={x} y={BY} width={BW} height={20} rx={1.5}
              fill={b ? C.addition : `${C.doubling}55`}
              stroke={b ? C.addition : C.doubling} strokeWidth={0.5}
              initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.006 }}
              style={{ transformOrigin: `${x}px ${BY + 10}px` }} />
          );
        })}
        <text x={X0} y={186} fontSize={8} fill={C.sub}>bit 63 (MSB)</text>
        <text x={X0 + 64 * (BW + GAP) - 28} y={186} fontSize={8} fill={C.sub}>bit 0</text>
      </motion.g>

      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <rect x={60} y={210} width={12} height={9} rx={1.5} fill={`${C.doubling}55`} stroke={C.doubling} strokeWidth={0.5} />
        <text x={78} y={219} fontSize={9} fontWeight={600} fill={C.doubling}>bit 0 → doubling only (~64×)</text>
        <rect x={290} y={210} width={12} height={9} rx={1.5} fill={C.addition} stroke={C.addition} strokeWidth={0.5} />
        <text x={308} y={219} fontSize={9} fontWeight={600} fill={C.addition}>bit 1 → doubling + addition (~30×)</text>

        <text x={260} y={250} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.text}>
          64 doublings + 30 additions (Hamming weight = 30)
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- Step 2: Doubling drill-down ---------- */
function Step2() {
  const sub = [
    { x: 30,  label: 'tangent_line(T)', sub: '12m', color: C.tangent },
    { x: 160, label: 'T = 2·T',         sub: '5m',  color: C.double },
    { x: 290, label: 'f = f²',          sub: '18m', color: C.cyclotomic },
    { x: 420, label: 'f *= line',       sub: '39m sparse', color: C.sparse },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        Doubling step — 4 substep (매 iteration 마다)
      </text>

      {sub.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.18 }}>
          <rect x={s.x} y={86} width={75} height={68} rx={10}
            fill={`${s.color}18`} stroke={s.color} strokeWidth={1.4} />
          <text x={s.x + 37.5} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>
            {s.label}
          </text>
          <line x1={s.x + 12} y1={118} x2={s.x + 63} y2={118} stroke={s.color} strokeWidth={0.5} opacity={0.4} />
          <text x={s.x + 37.5} y={140} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.text}>
            {s.sub}
          </text>
        </motion.g>
      ))}

      {/* Arrows */}
      {[0, 1, 2].map((i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.3 + i * 0.18 }}>
          <line x1={sub[i].x + 78} y1={120} x2={sub[i + 1].x - 3} y2={120}
            stroke={C.sub} strokeWidth={1} markerEnd="url(#arrR)" />
        </motion.g>
      ))}

      <defs>
        <marker id="arrR" viewBox="0 0 10 10" refX={7} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.sub} />
        </marker>
      </defs>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.95 }}>
        <line x1={30} y1={186} x2={490} y2={186} stroke={C.grid} strokeWidth={0.6} />
        <text x={260} y={208} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.doubling}>
          Total per doubling: 12 + 5 + 18 + 39 = 74m
        </text>
        <text x={260} y={228} textAnchor="middle" fontSize={9} fill={C.sub}>
          sparse mul_by_034 가 비용의 약 53% — line 함수의 4 zero coefficient 활용
        </text>
        <text x={260} y={252} textAnchor="middle" fontSize={9} fill={C.sub}>
          매 iteration (64 회) 무조건 실행 → doubling 누적 = 64 × 74 = 4,736m
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- Step 3: Addition substeps (when bit set) ---------- */
function Step3() {
  const sub = [
    { x: 60,  label: 'chord_line(T,Q)', sub: '15m', color: C.tangent },
    { x: 210, label: 'T = T + Q',       sub: '10m', color: C.double },
    { x: 360, label: 'f *= line',       sub: '39m sparse', color: C.sparse },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        Addition step — bit 이 1 일 때만 추가 실행
      </text>

      {/* Conditional gate */}
      <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
        <rect x={170} y={50} width={180} height={26} rx={13}
          fill={`${C.addition}18`} stroke={C.addition} strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={260} y={68} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.addition}>
          if L.get_bit(i) {'{ ... }'}
        </text>
      </motion.g>

      {sub.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.25 + i * 0.18 }}>
          <rect x={s.x} y={108} width={92} height={64} rx={10}
            fill={`${s.color}18`} stroke={s.color} strokeWidth={1.4} />
          <text x={s.x + 46} y={130} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.color}>
            {s.label}
          </text>
          <line x1={s.x + 12} y1={140} x2={s.x + 80} y2={140} stroke={s.color} strokeWidth={0.5} opacity={0.4} />
          <text x={s.x + 46} y={160} textAnchor="middle" fontSize={11} fontWeight={800} fill={C.text}>
            {s.sub}
          </text>
        </motion.g>
      ))}

      {/* Arrows */}
      {[0, 1].map((i) => (
        <motion.g key={i}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.45 + i * 0.18 }}>
          <line x1={sub[i].x + 95} y1={140} x2={sub[i + 1].x - 3} y2={140}
            stroke={C.sub} strokeWidth={1} markerEnd="url(#arrA)" />
        </motion.g>
      ))}

      <defs>
        <marker id="arrA" viewBox="0 0 10 10" refX={7} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.sub} />
        </marker>
      </defs>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.95 }}>
        <line x1={30} y1={196} x2={490} y2={196} stroke={C.grid} strokeWidth={0.6} />
        <text x={260} y={218} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.addition}>
          Total per addition: 15 + 10 + 39 = 64m
        </text>
        <text x={260} y={238} textAnchor="middle" fontSize={9} fill={C.sub}>
          BN254 Hamming weight = 30 → 30 회만 발생
        </text>
        <text x={260} y={258} textAnchor="middle" fontSize={9} fill={C.sub}>
          addition 누적 = 30 × 64 = 1,920m
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- Step 4: Stacked cost bars ---------- */
function Step4() {
  // doubling 74m: cyclotomic 18 + tangent 12 + double 5 + sparse 39
  // addition 64m: chord 15 + double 10 + sparse 39
  const X0 = 110, W_MAX = 360, MAX = 80;
  const segDoubling = [
    { v: 18, color: C.cyclotomic, name: 'cyclotomic f²' },
    { v: 12, color: C.tangent,    name: 'tangent line' },
    { v: 5,  color: C.double,     name: '2·T' },
    { v: 39, color: C.sparse,     name: 'sparse mul' },
  ];
  const segAddition = [
    { v: 15, color: C.tangent,    name: 'chord line' },
    { v: 10, color: C.double,     name: 'T + Q' },
    { v: 39, color: C.sparse,     name: 'sparse mul' },
  ];

  function StackBar({ y, segs, label, total, baseDelay }: { y: number; segs: typeof segDoubling; label: string; total: number; baseDelay: number }) {
    let acc = 0;
    return (
      <g>
        <text x={X0 - 8} y={y + 18} textAnchor="end" fontSize={10} fontWeight={700} fill={C.text}>{label}</text>
        {segs.map((s, i) => {
          const w = (s.v / MAX) * W_MAX;
          const x = X0 + (acc / MAX) * W_MAX;
          acc += s.v;
          return (
            <motion.rect key={i}
              x={x} y={y + 4} height={28} rx={2}
              fill={s.color} stroke={s.color} strokeWidth={0.6}
              initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.9 }}
              transition={{ duration: 0.45, delay: baseDelay + i * 0.12 }}
              style={{ transformOrigin: `${x}px ${y + 18}px`, width: w }} />
          );
        })}
        <motion.text x={X0 + (total / MAX) * W_MAX + 6} y={y + 22}
          fontSize={11} fontWeight={800} fill={C.text}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: baseDelay + 0.6 }}>
          {total}m
        </motion.text>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        반복당 비용 — 구성 요소별 (stacked)
      </text>

      <StackBar y={56}  segs={segDoubling} label="Doubling" total={74} baseDelay={0.1} />
      <StackBar y={120} segs={segAddition} label="Addition" total={64} baseDelay={0.55} />

      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.1 }}>
        {[
          { c: C.cyclotomic, n: 'cyclotomic f²' },
          { c: C.tangent,    n: 'line eval' },
          { c: C.double,     n: 'point op' },
          { c: C.sparse,     n: 'sparse mul_by_034' },
        ].map((l, i) => {
          const lx = 60 + (i % 2) * 230;
          const ly = 190 + Math.floor(i / 2) * 18;
          return (
            <g key={i}>
              <rect x={lx} y={ly} width={12} height={9} rx={1.5} fill={l.c} />
              <text x={lx + 18} y={ly + 8} fontSize={9} fontWeight={600} fill={l.c}>{l.n}</text>
            </g>
          );
        })}
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 1.3 }}>
        <text x={260} y={252} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sparse}>
          sparse mul 39m 이 두 step 모두에서 가장 큰 비중 (53% / 61%)
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- Step 5: Cumulative total ---------- */
function Step5() {
  const TOTAL = 6700;
  const X0 = 90, W_MAX = 360;
  const wDbl = (4736 / TOTAL) * W_MAX;
  const wAdd = (1920 / TOTAL) * W_MAX;

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        BN254 Miller Loop 누적 비용
      </text>

      {/* Separated bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <text x={X0 - 8} y={72} textAnchor="end" fontSize={10} fontWeight={700} fill={C.doubling}>64 doublings</text>
        <motion.rect x={X0} y={58} height={24} rx={3}
          fill={`${C.doubling}40`} stroke={C.doubling} strokeWidth={1.2}
          initial={{ width: 0 }} animate={{ width: wDbl }}
          transition={{ duration: 0.6 }} />
        <text x={X0 + wDbl + 6} y={75} fontSize={10} fontWeight={700} fill={C.doubling}>
          × 74m = 4,736m
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.25 }}>
        <text x={X0 - 8} y={108} textAnchor="end" fontSize={10} fontWeight={700} fill={C.addition}>30 additions</text>
        <motion.rect x={X0} y={94} height={24} rx={3}
          fill={`${C.addition}40`} stroke={C.addition} strokeWidth={1.2}
          initial={{ width: 0 }} animate={{ width: wAdd }}
          transition={{ duration: 0.6, delay: 0.25 }} />
        <text x={X0 + wAdd + 6} y={111} fontSize={10} fontWeight={700} fill={C.addition}>
          × 64m = 1,920m
        </text>
      </motion.g>

      {/* Stacked total */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.55 }}>
        <text x={X0 - 8} y={158} textAnchor="end" fontSize={10} fontWeight={700} fill={C.text}>Total</text>
        <motion.rect x={X0} y={144} width={wDbl} height={28} rx={3}
          fill={`${C.doubling}70`} stroke={C.doubling} strokeWidth={1.2}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ transformOrigin: `${X0}px 158px` }} />
        <motion.rect x={X0 + wDbl} y={144} width={wAdd} height={28} rx={3}
          fill={`${C.addition}70`} stroke={C.addition} strokeWidth={1.2}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.95 }}
          style={{ transformOrigin: `${X0 + wDbl}px 158px` }} />
        <text x={X0 + wDbl / 2} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">doubling</text>
        <text x={X0 + wDbl + wAdd / 2} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">addition</text>
        <text x={X0 + W_MAX + 8} y={162} fontSize={11} fontWeight={800} fill={C.text}>6,700m</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1.2 }}>
        <rect x={90} y={200} width={340} height={60} rx={10}
          fill={`${C.sparse}10`} stroke={C.sparse} strokeWidth={1.2} />
        <text x={260} y={222} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sparse}>
          Miller Loop 1 회 ≈ 6,700 Fp mults
        </text>
        <text x={260} y={242} textAnchor="middle" fontSize={9} fill={C.sub}>
          20 ns/Fp mult 기준 ≈ 0.13 ms / Miller loop
        </text>
        <text x={260} y={256} textAnchor="middle" fontSize={9} fill={C.sub}>
          Final exp (~3,500m) 추가 → 한 pairing ≈ 10,200m
        </text>
      </motion.g>
    </svg>
  );
}

/* ---------- Step 6: Sparse vs Full comparison ---------- */
function Step6() {
  const MAX = 12000, X0 = 140, W_MAX = 320;
  const rows = [
    { name: 'With sparse',    m: 6700,  ms: '0.13 ms', color: C.sparse, badge: null as string | null },
    { name: 'Without sparse', m: 11700, ms: '0.23 ms', color: C.full,   badge: '+5,000m (+75%)' },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.text}>
        Sparse vs Full Fp12×Fp12 비교
      </text>

      {rows.map((r, i) => {
        const w = (r.m / MAX) * W_MAX;
        const y = 64 + i * 80;
        return (
          <g key={r.name}>
            <text x={X0 - 8} y={y + 18} textAnchor="end" fontSize={10} fontWeight={700} fill={r.color}>{r.name}</text>
            <motion.rect x={X0} y={y + 4} width={w} height={28} rx={4}
              fill={`${r.color}35`} stroke={r.color} strokeWidth={1.4}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.3 }}
              style={{ transformOrigin: `${X0}px ${y + 18}px` }} />
            <motion.text x={X0 + w + 8} y={y + 22} fontSize={11} fontWeight={800} fill={r.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 + i * 0.3 }}>
              {r.m.toLocaleString()}m
            </motion.text>
            <motion.text x={X0} y={y + 50} fontSize={9} fill={C.sub}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + i * 0.3 }}>
              ≈ {r.ms} / Miller loop
            </motion.text>
            {r.badge && (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.95 }}>
                <rect x={X0 + w + 90} y={y + 4} width={120} height={28} rx={14}
                  fill={C.full} />
                <text x={X0 + w + 150} y={y + 22} textAnchor="middle" fontSize={10}
                  fontWeight={800} fill="#0b1220">{r.badge}</text>
              </motion.g>
            )}
          </g>
        );
      })}

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 1.15 }}>
        <line x1={X0} y1={232} x2={X0 + W_MAX} y2={232} stroke={C.grid} strokeWidth={0.6} />
        <text x={260} y={252} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sparse}>
          sparse mul_by_034 → ~5,000m 절감 ≈ Miller loop 의 40%
        </text>
        <text x={260} y={270} textAnchor="middle" fontSize={9} fill={C.sub}>
          twist 가 만든 4-zero structure 가 페어링을 실용적으로 만듦
        </text>
      </motion.g>
    </svg>
  );
}

export default function MillerLoopTraceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        step === 0 ? <Step1 /> :
        step === 1 ? <Step2 /> :
        step === 2 ? <Step3 /> :
        step === 3 ? <Step4 /> :
        step === 4 ? <Step5 /> :
        <Step6 />
      )}
    </StepViz>
  );
}
