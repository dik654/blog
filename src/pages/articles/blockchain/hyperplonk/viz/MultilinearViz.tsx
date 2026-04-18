import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  uni: '#6366f1',   // univariate (indigo)
  multi: '#10b981', // multilinear (emerald)
  eq: '#f59e0b',    // eq polynomial (amber)
  fold: '#ec4899',  // folding (pink)
  dim: '#94a3b8',   // muted labels
  grid: '#334155',  // grid lines
  hi: '#8b5cf6',    // highlight (violet)
};

/* truth table values for n=2: f(00)=1, f(01)=2, f(10)=3, f(11)=7 */
const TRUTH = [
  { b: '00', x1: 0, x2: 0, val: 1 },
  { b: '01', x1: 0, x2: 1, val: 2 },
  { b: '10', x1: 1, x2: 0, val: 3 },
  { b: '11', x1: 1, x2: 1, val: 7 },
];

const STEPS = [
  {
    label: '단변수 vs 다중선형 다항식',
    body: '단변수: 변수 1개, 차수 n → 계수 n+1개, FFT 필요.\n다중선형: 변수 n개, 각 차수 최대 1 → 진리표 2^n개 값으로 인코딩, FFT 불필요.',
  },
  {
    label: '불리언 하이퍼큐브 인코딩',
    body: '{0,1}^n의 각 꼭짓점(비트 조합)에 witness 값을 배정.\nn=2이면 4개 꼭짓점: (0,0)→1, (0,1)→2, (1,0)→3, (1,1)→7.',
  },
  {
    label: 'eq(b,x) — 등호 지시자 다항식',
    body: 'eq(b,x) = Π(bᵢxᵢ + (1-bᵢ)(1-xᵢ)). x=b일 때만 1, 나머지 0.\n특정 꼭짓점을 정확히 "선택"하는 라그랑주 기저 역할.',
  },
  {
    label: 'MLE 평가: 폴딩으로 배열 절반 축소',
    body: '2^n개 값에서 시작, 각 라운드마다 rᵢ로 폴딩:\nnew[j] = (1-rᵢ)·left[j] + rᵢ·right[j] → 배열 절반.\nn 라운드 후 1개 값 = 최종 평가 결과. 비용 O(2^n).',
  },
];

/* ── Step 0: Univariate vs Multilinear ─────────────────────────── */
function UniVsMulti() {
  /* Univariate curve: a simple polynomial shape */
  const curvePts = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20;
    const x = 20 + t * 190;
    const y = 120 - (60 * (t - 0.2) * (t - 0.7) * (t - 0.9) * 8 + 30);
    return `${x},${Math.max(30, Math.min(140, y))}`;
  }).join(' ');

  return (
    <g>
      {/* Left: Univariate */}
      <motion.text x={110} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.uni}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        단변수 다항식
      </motion.text>
      {/* axes */}
      <line x1={20} y1={140} x2={210} y2={140} stroke={C.dim} strokeWidth={0.6} />
      <line x1={20} y1={140} x2={20} y2={25} stroke={C.dim} strokeWidth={0.6} />
      <text x={115} y={155} textAnchor="middle" fontSize={8} fill={C.dim}>x</text>
      <text x={12} y={80} textAnchor="middle" fontSize={8} fill={C.dim}>f</text>
      {/* curve */}
      <motion.polyline points={curvePts} fill="none" stroke={C.uni}
        strokeWidth={2} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ ...sp, duration: 0.8 }} />
      {/* label */}
      <motion.text x={110} y={130} textAnchor="middle" fontSize={8}
        fill={C.dim} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        계수 n+1개, FFT/NTT 필수
      </motion.text>

      {/* Right: Multilinear truth table grid */}
      <motion.text x={370} y={18} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.multi}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        다중선형 다항식
      </motion.text>
      {/* 2x2 grid */}
      {TRUTH.map((t, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const gx = 300 + col * 70;
        const gy = 35 + row * 55;
        return (
          <motion.g key={t.b}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={gx} y={gy} width={60} height={42} rx={5}
              fill={`${C.multi}14`} stroke={C.multi} strokeWidth={1.2} />
            <text x={gx + 30} y={gy + 16} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C.multi}>
              ({t.x1},{t.x2})
            </text>
            <text x={gx + 30} y={gy + 32} textAnchor="middle"
              fontSize={12} fontWeight={700} fill={C.multi}>
              {t.val}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={370} y={150} textAnchor="middle" fontSize={8}
        fill={C.dim} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        진리표 2^n개 값, FFT 불필요
      </motion.text>
      {/* divider */}
      <line x1={240} y1={20} x2={240} y2={150} stroke={C.dim}
        strokeWidth={0.5} strokeDasharray="3 3" />
    </g>
  );
}

/* ── Step 1: Boolean Hypercube ─────────────────────────────────── */
function HypercubeStep() {
  /* 2D hypercube (square) with labeled vertices */
  const verts = [
    { b: '(0,0)', val: 1, x: 100, y: 120 },
    { b: '(0,1)', val: 2, x: 260, y: 120 },
    { b: '(1,0)', val: 3, x: 100, y: 40 },
    { b: '(1,1)', val: 7, x: 260, y: 40 },
  ];
  const edges = [
    [0, 1], [0, 2], [1, 3], [2, 3],
  ];
  const bitLabels = [
    { text: 'x₂=0', x: 80, y: 80, rot: -90 },
    { text: 'x₂=1', x: 280, y: 80, rot: -90 },
    { text: 'x₁=0', x: 180, y: 135 },
    { text: 'x₁=1', x: 180, y: 30 },
  ];
  return (
    <g>
      <motion.text x={240} y={15} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.hi}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        {'{0,1}'}^2 하이퍼큐브
      </motion.text>
      {/* edges */}
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={verts[a].x} y1={verts[a].y}
          x2={verts[b].x} y2={verts[b].y}
          stroke={C.grid} strokeWidth={1}
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ ...sp, delay: 0.1 }} />
      ))}
      {/* vertices */}
      {verts.map((v, i) => (
        <motion.g key={v.b}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: i * 0.12 }}>
          <circle cx={v.x} cy={v.y} r={22} fill={`${C.hi}18`}
            stroke={C.hi} strokeWidth={1.5} />
          <text x={v.x} y={v.y - 5} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={C.hi}>{v.b}</text>
          <text x={v.x} y={v.y + 10} textAnchor="middle"
            fontSize={13} fontWeight={700} fill={C.hi}>{v.val}</text>
        </motion.g>
      ))}
      {/* bit decomposition labels */}
      {bitLabels.map((lb, i) => (
        <motion.text key={i} x={lb.x} y={lb.y} textAnchor="middle"
          fontSize={8} fill={C.dim} fontWeight={500}
          transform={lb.rot ? `rotate(${lb.rot} ${lb.x} ${lb.y})` : undefined}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ ...sp, delay: 0.4 }}>
          {lb.text}
        </motion.text>
      ))}
      {/* right side: index mapping */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <text x={380} y={38} fontSize={9} fontWeight={600} fill={C.dim}>인덱싱</text>
        {TRUTH.map((t, i) => (
          <g key={i}>
            <text x={370} y={58 + i * 22} fontSize={9} fill={C.dim}>
              {t.b}
            </text>
            <text x={400} y={58 + i * 22} fontSize={9} fill={C.dim}>→</text>
            <text x={420} y={58 + i * 22} fontSize={10} fontWeight={700}
              fill={C.hi}>
              f={t.val}
            </text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 2: eq polynomial selector ───────────────────────────── */
function EqPolynomialStep() {
  const targetIdx = 2; // highlight b=(1,0)
  const target = TRUTH[targetIdx];

  const verts = [
    { b: '(0,0)', val: 1, x: 80, y: 110 },
    { b: '(0,1)', val: 2, x: 200, y: 110 },
    { b: '(1,0)', val: 3, x: 80, y: 45 },
    { b: '(1,1)', val: 7, x: 200, y: 45 },
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];

  return (
    <g>
      <motion.text x={140} y={15} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.eq}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        eq(10, x) = x₁·(1-x₂)
      </motion.text>
      {/* edges */}
      {edges.map(([a, b], i) => (
        <line key={i} x1={verts[a].x} y1={verts[a].y}
          x2={verts[b].x} y2={verts[b].y}
          stroke={C.grid} strokeWidth={0.6} opacity={0.3} />
      ))}
      {/* vertices — highlighted one glows */}
      {verts.map((v, i) => {
        const isTarget = i === targetIdx;
        return (
          <motion.g key={v.b}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <circle cx={v.x} cy={v.y} r={20}
              fill={isTarget ? `${C.eq}30` : `${C.dim}10`}
              stroke={isTarget ? C.eq : C.dim}
              strokeWidth={isTarget ? 2 : 0.8} />
            <text x={v.x} y={v.y - 4} textAnchor="middle"
              fontSize={8} fontWeight={600}
              fill={isTarget ? C.eq : C.dim}>{v.b}</text>
            <text x={v.x} y={v.y + 10} textAnchor="middle"
              fontSize={11} fontWeight={700}
              fill={isTarget ? C.eq : C.dim}>
              {isTarget ? '1' : '0'}
            </text>
          </motion.g>
        );
      })}
      {/* "lights up" arrow */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <line x1={105} y1={42} x2={240} y2={42}
          stroke={C.eq} strokeWidth={1} markerEnd="url(#arrowEq)" />
        <text x={260} y={34} fontSize={9} fontWeight={600} fill={C.eq}>
          eq(10, x) = 1
        </text>
        <text x={260} y={48} fontSize={8} fill={C.dim}>
          x=(1,0) 일 때만 활성
        </text>
      </motion.g>

      {/* right side: eq formula for each vertex */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <text x={320} y={72} fontSize={9} fontWeight={600} fill={C.dim}>
          eq 지시자 값:
        </text>
        {TRUTH.map((t, i) => (
          <g key={i}>
            <rect x={310} y={78 + i * 18} width={150} height={15} rx={3}
              fill={i === targetIdx ? `${C.eq}18` : 'transparent'}
              stroke={i === targetIdx ? C.eq : 'transparent'}
              strokeWidth={0.8} />
            <text x={320} y={90 + i * 18} fontSize={8}
              fill={i === targetIdx ? C.eq : C.dim}>
              eq({t.b}, 10) = {i === targetIdx ? '1 ← 선택' : '0'}
            </text>
          </g>
        ))}
      </motion.g>

      {/* arrow marker */}
      <defs>
        <marker id="arrowEq" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.eq} />
        </marker>
      </defs>
    </g>
  );
}

/* ── Step 3: Folding ──────────────────────────────────────────── */
function FoldingStep() {
  /* folding example: 4 values → 2 → 1 with r₁=0.4, r₂=0.6 */
  const r1 = 0.4, r2 = 0.6;
  const level0 = [1, 2, 3, 7];
  const level1 = [
    (1 - r1) * level0[0] + r1 * level0[2],  // (1-0.4)*1 + 0.4*3 = 1.8
    (1 - r1) * level0[1] + r1 * level0[3],  // (1-0.4)*2 + 0.4*7 = 4.0
  ];
  const level2 = [
    (1 - r2) * level1[0] + r2 * level1[1],  // (1-0.6)*1.8 + 0.6*4.0 = 3.12
  ];

  const levels = [
    { vals: level0, label: '원본 (2² = 4)', y: 28, w: 50, color: C.fold },
    { vals: level1, label: `r₁=${r1} 폴딩 → 2`, y: 72, w: 70, color: C.hi },
    { vals: level2, label: `r₂=${r2} 폴딩 → 1`, y: 118, w: 90, color: C.eq },
  ];

  return (
    <g>
      <motion.text x={155} y={15} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.fold}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        폴딩: 배열 절반 축소
      </motion.text>

      {levels.map((lv, li) => {
        const totalW = lv.vals.length * lv.w + (lv.vals.length - 1) * 8;
        const startX = 155 - totalW / 2;
        return (
          <motion.g key={li}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: li * 0.2 }}>
            {lv.vals.map((v, vi) => {
              const bx = startX + vi * (lv.w + 8);
              return (
                <g key={vi}>
                  <rect x={bx} y={lv.y} width={lv.w} height={28} rx={4}
                    fill={`${lv.color}14`} stroke={lv.color} strokeWidth={1.2} />
                  <text x={bx + lv.w / 2} y={lv.y + 18} textAnchor="middle"
                    fontSize={11} fontWeight={700} fill={lv.color}>
                    {Number.isInteger(v) ? v : v.toFixed(1)}
                  </text>
                </g>
              );
            })}
            <text x={startX - 8} y={lv.y + 18} textAnchor="end"
              fontSize={8} fill={C.dim}>{lv.label}</text>
          </motion.g>
        );
      })}

      {/* fold arrows between levels */}
      {/* level0 → level1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        {/* pair 0,2 → result 0 */}
        <line x1={130} y1={56} x2={120} y2={70} stroke={C.fold}
          strokeWidth={0.8} strokeDasharray="2 2" />
        <line x1={180} y1={56} x2={120} y2={70} stroke={C.fold}
          strokeWidth={0.8} strokeDasharray="2 2" />
        {/* pair 1,3 → result 1 */}
        <line x1={188} y1={56} x2={198} y2={70} stroke={C.fold}
          strokeWidth={0.8} strokeDasharray="2 2" />
        <line x1={238} y1={56} x2={198} y2={70} stroke={C.fold}
          strokeWidth={0.8} strokeDasharray="2 2" />
      </motion.g>
      {/* level1 → level2 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <line x1={120} y1={100} x2={155} y2={116} stroke={C.hi}
          strokeWidth={0.8} strokeDasharray="2 2" />
        <line x1={198} y1={100} x2={155} y2={116} stroke={C.hi}
          strokeWidth={0.8} strokeDasharray="2 2" />
      </motion.g>

      {/* right side: formula */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={300} y={25} width={170} height={75} rx={6}
          fill={`${C.fold}08`} stroke={C.fold} strokeWidth={0.8} />
        <text x={310} y={42} fontSize={9} fontWeight={600} fill={C.fold}>
          폴딩 연산
        </text>
        <text x={310} y={58} fontSize={8} fill={C.dim}>
          new[j] = (1-rᵢ)·left + rᵢ·right
        </text>
        <text x={310} y={74} fontSize={8} fill={C.dim}>
          1.8 = 0.6×1 + 0.4×3
        </text>
        <text x={310} y={90} fontSize={8} fill={C.dim}>
          4.0 = 0.6×2 + 0.4×7
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={300} y={108} width={170} height={40} rx={6}
          fill={`${C.eq}08`} stroke={C.eq} strokeWidth={0.8} />
        <text x={310} y={125} fontSize={8} fill={C.dim}>
          3.1 = 0.4×1.8 + 0.6×4.0
        </text>
        <text x={310} y={140} fontSize={9} fontWeight={600} fill={C.eq}>
          최종 평가 결과 = 3.1
        </text>
      </motion.g>
    </g>
  );
}

export default function MultilinearViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <UniVsMulti />}
          {step === 1 && <HypercubeStep />}
          {step === 2 && <EqPolynomialStep />}
          {step === 3 && <FoldingStep />}
        </svg>
      )}
    </StepViz>
  );
}
