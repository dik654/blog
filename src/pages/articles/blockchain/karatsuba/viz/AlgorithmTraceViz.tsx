import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  input: '#6366f1',
  naive_mult: '#ef4444',
  karat_mult: '#10b981',
  reuse: '#f59e0b',
  output: '#8b5cf6',
  muted: '#64748b',
};

const STEPS = [
  {
    label: '① 입력 — 동일한 4 원소',
    body: (
      <>
        양쪽 모두 <code>a1, a2, b1, b2</code> 4개의 Fp 원소로 시작.
        {'\n'}같은 Fp2 곱 <code>(a1+b1·u)(a2+b2·u)</code>를 두 알고리즘이 어떻게 다르게 계산하는지 추적한다.
      </>
    ),
  },
  {
    label: '② Mult #1 — v0 = a1 × a2 (양쪽 동일)',
    body: (
      <>
        실수부의 첫 번째 항. Naive는 <code>t1</code>, Karatsuba는 <code>v0</code>로 명명만 다를 뿐 동일한 곱셈.
        {'\n'}양쪽 카운터: <strong>1 mult</strong>.
      </>
    ),
  },
  {
    label: '③ Mult #2 — v1 = b1 × b2 (양쪽 동일)',
    body: (
      <>
        실수부의 두 번째 항. <code>real = v0 - v1 = a1·a2 - b1·b2</code>를 위해 양쪽 모두 필수.
        {'\n'}양쪽 카운터: <strong>2 mults</strong>. 여기까지는 비용 동일.
      </>
    ),
  },
  {
    label: '④ 분기 — Naive Mult #3 vs Karatsuba 덧셈 2회',
    body: (
      <>
        <strong>Naive</strong>: <code>t3 = a1 × b2</code> 새 곱셈 추가 → 카운터 <strong>3</strong>.
        {'\n'}<strong>Karatsuba</strong>: <code>s1 = a1+b1, s2 = a2+b2</code> 덧셈 두 번 (곱셈 0). 곱셈 카운터는 여전히 <strong>2</strong>.
      </>
    ),
  },
  {
    label: '⑤ Naive Mult #4 vs Karatsuba Mult #3',
    body: (
      <>
        <strong>Naive</strong>: <code>t4 = a2 × b1</code> 네 번째 곱셈 → 카운터 <strong>4</strong>.
        {'\n'}<strong>Karatsuba</strong>: <code>v2 = s1 × s2 = (a1+b1)(a2+b2)</code> 단 한 번의 곱셈 → 카운터 <strong>3</strong>.
      </>
    ),
  },
  {
    label: '⑥ 결합 — v0, v1 재사용이 핵심',
    body: (
      <>
        <strong>Naive</strong>: <code>real = t1 - t2</code>, <code>imag = t3 + t4</code> — 단순 가감.
        {'\n'}<strong>Karatsuba</strong>: <code>imag = v2 - v0 - v1</code> — <span style={{ color: C.reuse }}>실수부에서 이미 만든 v0, v1을 재사용</span>해 한 곱셈을 절약한다.
      </>
    ),
  },
  {
    label: '⑦ 최종 — 4 vs 3 mults (25% 감소)',
    body: (
      <>
        같은 결과를 만들지만 Karatsuba는 곱셈 1회를 덧셈 3회로 교환했다.
        {'\n'}256-bit Fp 곱셈 ~20 cyc, 덧셈 ~3 cyc → 순 <strong>~11 cyc 절감</strong>. Fp12까지 누적되면 페어링 전체가 ~3배 빨라진다.
      </>
    ),
  },
];

const sp = { type: 'spring' as const, bounce: 0.18, duration: 0.45 };

// ───────────────────────────── Layout constants

const LEFT_X = 10;       // Naive panel origin x
const RIGHT_X = 280;     // Karatsuba panel origin x
const PANEL_W = 250;
const PANEL_H = 300;

// Input node positions (within panel local coords, add panel x to get absolute)
const INPUTS = [
  { id: 'a1', dx: 30 },
  { id: 'a2', dx: 90 },
  { id: 'b1', dx: 150 },
  { id: 'b2', dx: 210 },
];
const INPUT_Y = 36;
const COUNTER_Y = 168;
const OUT_Y = 256;

// Helper: input chip
function InputNode({ x, y, id }: { x: number; y: number; id: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 10} width={28} height={20} rx={5}
        fill={`${C.input}1f`} stroke={C.input} strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10}
        fontFamily="monospace" fontWeight={700} fill={C.input}>{id}</text>
    </g>
  );
}

// ───────────────────────────── Naive panel

function NaivePanel({ step }: { step: number }) {
  const naiveMults = step >= 5 ? 4 : step >= 4 ? 3 : step >= 2 ? 2 : step >= 1 ? 1 : 0;

  // mult chips: (label, ax, bx) — ax/bx are input dx
  const mults = [
    { id: 't1', expr: 'a1·a2', ax: 30, bx: 90, color: C.naive_mult, atStep: 1 },
    { id: 't2', expr: 'b1·b2', ax: 150, bx: 210, color: C.naive_mult, atStep: 2 },
    { id: 't3', expr: 'a1·b2', ax: 30, bx: 210, color: C.naive_mult, atStep: 3 },
    { id: 't4', expr: 'a2·b1', ax: 90, bx: 150, color: C.naive_mult, atStep: 4 },
  ];

  return (
    <g transform={`translate(${LEFT_X} 5)`}>
      {/* panel frame */}
      <rect x={0} y={0} width={PANEL_W} height={PANEL_H} rx={10}
        fill="#ffffff04" stroke={`${C.muted}55`} strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={PANEL_W / 2} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.naive_mult}>Naive (4 mults)</text>

      {/* inputs */}
      {INPUTS.map((n) => (
        <InputNode key={n.id} x={n.dx} y={INPUT_Y} id={n.id} />
      ))}

      {/* mult edges + chips */}
      {mults.map((m, i) => {
        const visible = step >= m.atStep;
        if (!visible) return null;
        const justFired = step === m.atStep;
        const cy = 90 + i * 16;
        return (
          <motion.g key={m.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.05 * i }}>
            {/* edge from a-side input to chip */}
            <motion.line x1={m.ax} y1={INPUT_Y + 10} x2={m.ax} y2={cy}
              stroke={m.color} strokeWidth={1}
              animate={justFired ? { opacity: [0.2, 1, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 0.6 }} />
            <motion.line x1={m.bx} y1={INPUT_Y + 10} x2={m.bx} y2={cy}
              stroke={m.color} strokeWidth={1}
              animate={justFired ? { opacity: [0.2, 1, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 0.6 }} />
            {/* horizontal join */}
            <line x1={m.ax} y1={cy} x2={m.bx} y2={cy}
              stroke={m.color} strokeWidth={1} opacity={0.6} />
            {/* mult chip */}
            <motion.rect x={(m.ax + m.bx) / 2 - 30} y={cy - 7} width={60} height={14} rx={3}
              fill={`${m.color}26`} stroke={m.color} strokeWidth={1}
              animate={justFired ? { scale: [0.6, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: `${(m.ax + m.bx) / 2}px ${cy}px` }} />
            <text x={(m.ax + m.bx) / 2} y={cy + 3} textAnchor="middle" fontSize={8}
              fontFamily="monospace" fontWeight={700} fill={m.color}>
              {m.id}={m.expr}
            </text>
          </motion.g>
        );
      })}

      {/* mult counter */}
      <rect x={PANEL_W / 2 - 50} y={COUNTER_Y} width={100} height={36} rx={6}
        fill={`${C.naive_mult}10`} stroke={C.naive_mult} strokeWidth={1.2} />
      <text x={PANEL_W / 2} y={COUNTER_Y + 13} textAnchor="middle" fontSize={8}
        fontWeight={700} fill={C.naive_mult} opacity={0.8}>MULT COUNTER</text>
      <motion.text x={PANEL_W / 2} y={COUNTER_Y + 30} textAnchor="middle"
        fontSize={16} fontWeight={800} fill={C.naive_mult}
        key={`nc-${naiveMults}`}
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ ...sp }}>
        {naiveMults}
      </motion.text>

      {/* outputs (step 6+) */}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 }}>
          <rect x={20} y={OUT_Y - 6} width={100} height={36} rx={6}
            fill={`${C.output}14`} stroke={C.output} strokeWidth={1} />
          <text x={70} y={OUT_Y + 6} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={700} fill={C.output}>real = t1 − t2</text>
          <text x={70} y={OUT_Y + 20} textAnchor="middle" fontSize={7}
            fontFamily="monospace" fill={C.output} opacity={0.75}>(2 inputs)</text>

          <rect x={130} y={OUT_Y - 6} width={100} height={36} rx={6}
            fill={`${C.output}14`} stroke={C.output} strokeWidth={1} />
          <text x={180} y={OUT_Y + 6} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={700} fill={C.output}>imag = t3 + t4</text>
          <text x={180} y={OUT_Y + 20} textAnchor="middle" fontSize={7}
            fontFamily="monospace" fill={C.output} opacity={0.75}>(2 inputs)</text>
        </motion.g>
      )}

      {/* final summary banner */}
      {step >= 6 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect x={20} y={PANEL_H - 14} width={210} height={11} rx={3}
            fill={`${C.naive_mult}1a`} stroke={C.naive_mult} strokeWidth={0.6} />
          <text x={PANEL_W / 2} y={PANEL_H - 6} textAnchor="middle" fontSize={8}
            fontWeight={700} fill={C.naive_mult}>4 mults · 2 add/sub</text>
        </motion.g>
      )}
    </g>
  );
}

// ───────────────────────────── Karatsuba panel

function KaratPanel({ step }: { step: number }) {
  // Karatsuba mult count: step1→1, step2→2, step3→2 (only adds), step4→3
  const karatMults = step >= 4 ? 3 : step >= 2 ? 2 : step >= 1 ? 1 : 0;

  const mults = [
    { id: 'v0', expr: 'a1·a2', ax: 30, bx: 90, atStep: 1 },
    { id: 'v1', expr: 'b1·b2', ax: 150, bx: 210, atStep: 2 },
  ];

  return (
    <g transform={`translate(${RIGHT_X} 5)`}>
      <rect x={0} y={0} width={PANEL_W} height={PANEL_H} rx={10}
        fill="#ffffff04" stroke={`${C.muted}55`} strokeWidth={0.8} strokeDasharray="3 2" />
      <text x={PANEL_W / 2} y={16} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.karat_mult}>Karatsuba (3 mults)</text>

      {INPUTS.map((n) => (
        <InputNode key={n.id} x={n.dx} y={INPUT_Y} id={n.id} />
      ))}

      {/* v0, v1 mult chips */}
      {mults.map((m, i) => {
        const visible = step >= m.atStep;
        if (!visible) return null;
        const justFired = step === m.atStep;
        const cy = 90 + i * 16;
        const reuseHighlight = step >= 5;
        const color = reuseHighlight ? C.reuse : C.karat_mult;
        return (
          <motion.g key={m.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: 0.05 * i }}>
            <motion.line x1={m.ax} y1={INPUT_Y + 10} x2={m.ax} y2={cy}
              stroke={color} strokeWidth={1}
              animate={justFired ? { opacity: [0.2, 1, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 0.6 }} />
            <motion.line x1={m.bx} y1={INPUT_Y + 10} x2={m.bx} y2={cy}
              stroke={color} strokeWidth={1}
              animate={justFired ? { opacity: [0.2, 1, 0.6] } : { opacity: 0.6 }}
              transition={{ duration: 0.6 }} />
            <line x1={m.ax} y1={cy} x2={m.bx} y2={cy}
              stroke={color} strokeWidth={1} opacity={0.6} />
            <motion.rect x={(m.ax + m.bx) / 2 - 30} y={cy - 7} width={60} height={14} rx={3}
              fill={`${color}26`} stroke={color}
              strokeWidth={reuseHighlight ? 1.6 : 1}
              animate={justFired ? { scale: [0.6, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
              style={{ transformOrigin: `${(m.ax + m.bx) / 2}px ${cy}px` }} />
            <text x={(m.ax + m.bx) / 2} y={cy + 3} textAnchor="middle" fontSize={8}
              fontFamily="monospace" fontWeight={700} fill={color}>
              {m.id}={m.expr}
            </text>
          </motion.g>
        );
      })}

      {/* s1, s2 add chips (step >= 3) */}
      {step >= 3 && (
        <motion.g initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp }}>
          {/* s1 = a1 + b1 */}
          <line x1={30} y1={INPUT_Y + 10} x2={30} y2={132}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <line x1={150} y1={INPUT_Y + 10} x2={150} y2={132}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <line x1={30} y1={132} x2={150} y2={132}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <rect x={60} y={125} width={60} height={14} rx={3}
            fill={`${C.karat_mult}14`} stroke={C.karat_mult} strokeWidth={0.8} strokeDasharray="2 2" />
          <text x={90} y={135} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={700} fill={C.karat_mult}>s1=a1+b1</text>

          {/* s2 = a2 + b2 */}
          <line x1={90} y1={INPUT_Y + 10} x2={90} y2={148}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <line x1={210} y1={INPUT_Y + 10} x2={210} y2={148}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <line x1={90} y1={148} x2={210} y2={148}
            stroke={C.karat_mult} strokeWidth={0.8} opacity={0.4} strokeDasharray="2 2" />
          <rect x={120} y={141} width={60} height={14} rx={3}
            fill={`${C.karat_mult}14`} stroke={C.karat_mult} strokeWidth={0.8} strokeDasharray="2 2" />
          <text x={150} y={151} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={700} fill={C.karat_mult}>s2=a2+b2</text>
        </motion.g>
      )}

      {/* v2 = s1 * s2 (step >= 4) */}
      {step >= 4 && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp }}
          style={{ transformOrigin: `${PANEL_W / 2}px 124px` }}>
          {/* lines from s1 chip and s2 chip toward v2 chip */}
          <line x1={90} y1={139} x2={125} y2={120}
            stroke={C.karat_mult} strokeWidth={1.2} />
          <line x1={150} y1={155} x2={125} y2={120}
            stroke={C.karat_mult} strokeWidth={1.2} />
          <rect x={125 - 32} y={113} width={64} height={14} rx={3}
            fill={`${C.karat_mult}33`} stroke={C.karat_mult} strokeWidth={1.4} />
          <text x={125} y={123} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={800} fill={C.karat_mult}>v2=s1·s2</text>
        </motion.g>
      )}

      {/* mult counter */}
      <rect x={PANEL_W / 2 - 50} y={COUNTER_Y} width={100} height={36} rx={6}
        fill={`${C.karat_mult}10`} stroke={C.karat_mult} strokeWidth={1.2} />
      <text x={PANEL_W / 2} y={COUNTER_Y + 13} textAnchor="middle" fontSize={8}
        fontWeight={700} fill={C.karat_mult} opacity={0.8}>MULT COUNTER</text>
      <motion.text x={PANEL_W / 2} y={COUNTER_Y + 30} textAnchor="middle"
        fontSize={16} fontWeight={800} fill={C.karat_mult}
        key={`kc-${karatMults}`}
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ ...sp }}>
        {karatMults}
      </motion.text>

      {/* outputs */}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 }}>
          <rect x={20} y={OUT_Y - 6} width={100} height={36} rx={6}
            fill={`${C.output}14`} stroke={C.output} strokeWidth={1} />
          <text x={70} y={OUT_Y + 6} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={700} fill={C.output}>real = v0 − v1</text>
          <text x={70} y={OUT_Y + 20} textAnchor="middle" fontSize={7}
            fontFamily="monospace" fill={C.output} opacity={0.75}>(reuses v0,v1)</text>

          <rect x={130} y={OUT_Y - 6} width={100} height={36} rx={6}
            fill={`${C.reuse}1c`} stroke={C.reuse} strokeWidth={1.4} />
          <text x={180} y={OUT_Y + 6} textAnchor="middle" fontSize={8}
            fontFamily="monospace" fontWeight={800} fill={C.reuse}>imag = v2 − v0 − v1</text>
          <text x={180} y={OUT_Y + 20} textAnchor="middle" fontSize={7}
            fontFamily="monospace" fill={C.reuse} opacity={0.85}>3 terms, 0 new mult</text>
        </motion.g>
      )}

      {/* reuse arrows v0, v1 → imag (step 6) */}
      {step >= 5 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}>
          <defs>
            <marker id="reuseArrow" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.reuse} />
            </marker>
          </defs>
          {/* v0 chip → imag box */}
          <path d="M 60 97 C 80 200, 150 230, 175 250"
            stroke={C.reuse} strokeWidth={1} strokeDasharray="3 2"
            fill="none" markerEnd="url(#reuseArrow)" opacity={0.85} />
          {/* v1 chip → imag box */}
          <path d="M 180 113 C 195 170, 195 220, 188 250"
            stroke={C.reuse} strokeWidth={1} strokeDasharray="3 2"
            fill="none" markerEnd="url(#reuseArrow)" opacity={0.85} />
          <text x={120} y={210} fontSize={7}
            fontFamily="monospace" fontWeight={700} fill={C.reuse} opacity={0.9}>재사용</text>
        </motion.g>
      )}

      {/* final summary banner */}
      {step >= 6 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <rect x={20} y={PANEL_H - 14} width={210} height={11} rx={3}
            fill={`${C.karat_mult}1a`} stroke={C.karat_mult} strokeWidth={0.6} />
          <text x={PANEL_W / 2} y={PANEL_H - 6} textAnchor="middle" fontSize={8}
            fontWeight={700} fill={C.karat_mult}>3 mults · 5 add/sub</text>
        </motion.g>
      )}
    </g>
  );
}

// ───────────────────────────── Final-step delta banner

function DeltaBanner() {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ ...sp, delay: 0.3 }}
      style={{ transformOrigin: '270px 318px' }}>
      <rect x={130} y={310} width={280} height={18} rx={5}
        fill={`${C.reuse}22`} stroke={C.reuse} strokeWidth={1.2} />
      <text x={270} y={322} textAnchor="middle" fontSize={9}
        fontWeight={800} fill={C.reuse}>
        ▼ 1 mult 절약 (4 → 3, 25% 감소)
      </text>
    </motion.g>
  );
}

export default function AlgorithmTraceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 340" className="w-full max-w-3xl" style={{ height: 'auto' }}>
          <NaivePanel step={step} />
          <KaratPanel step={step} />
          {step >= 6 && <DeltaBanner />}
        </svg>
      )}
    </StepViz>
  );
}
