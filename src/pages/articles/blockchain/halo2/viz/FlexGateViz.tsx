import { motion, AnimatePresence } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const C = {
  cell: '#3b82f6',
  selector: '#a855f7',
  add: '#10b981',
  mul: '#f59e0b',
  muladd: '#ec4899',
  naive: '#ef4444',
  lookup: '#10b981',
  fg: '#e5e7eb',
  mut: '#9ca3af',
};

const STEPS = [
  {
    label: '1. FlexGate 핵심 제약식 — 4 cell + selector',
    body: (
      <>
        하나의 등식 <M>{'q \\cdot (a + b \\cdot c - d) = 0'}</M> 으로 모든 산술 게이트를 표현.{'\n'}
        4 advice cell <code>a, b, c, d</code> 와 selector <code>q</code> 만으로 구성.
      </>
    ),
  },
  {
    label: '2. ADD 모드 — c=1 로 고정',
    body: (
      <>
        <code>a=x, b=y, c=1, d=x+y</code> 할당 → <M>{'x + y \\cdot 1 = x + y \\;\\checkmark'}</M>.{'\n'}
        곱셈을 1배로 무력화하여 덧셈으로 환원.
      </>
    ),
  },
  {
    label: '3. MUL 모드 — a=0 으로 고정',
    body: (
      <>
        <code>a=0, b=x, c=y, d=x·y</code> → <M>{'0 + x \\cdot y = x \\cdot y \\;\\checkmark'}</M>.{'\n'}
        덧셈 항을 0으로 무력화하여 곱셈만 남김.
      </>
    ),
  },
  {
    label: '4. MULADD 모드 — 모든 cell 활용',
    body: (
      <>
        <code>a=z, b=x, c=y, d=x·y+z</code> → <M>{'z + x \\cdot y = x \\cdot y + z \\;\\checkmark'}</M>.{'\n'}
        ADD · MUL · MULADD 셋 모두 같은 단일 제약식 — gate 종류 폭발 방지.
      </>
    ),
  },
  {
    label: '5. RangeGate — Naive 16 constraints vs Lookup 1 constraint',
    body: (
      <>
        16-bit 범위 검사: bit 분해는 16개 boolean 제약 필요. lookup table은 미리 채운 <M>{'[0, 2^{16})'}</M> 컬럼에 단일 lookup으로 끝.{'\n'}
        constraint 수 <strong>16배 감소</strong> → witness · proving 비용 절감.
      </>
    ),
  },
  {
    label: '6. 결합 효과 — FlexGate + RangeGate',
    body: (
      <>
        FlexGate (산술 단일화) + RangeGate (lookup 범위) → halo2-lib 의 모든 고수준 API <code>add / mul / range_check / select</code> 가 두 게이트로 환원.{'\n'}
        제약 수 감소 → MSM·FFT 비용 감소 → proving time 단축.
      </>
    ),
  },
];

const VALUES: Record<string, { a: string; b: string; c: string; d: string; eq: string; mode: string; color: string }> = {
  empty: { a: '', b: '', c: '', d: '', eq: '', mode: '', color: C.cell },
  add: { a: 'x', b: 'y', c: '1', d: 'x+y', eq: 'x + y·1 = x+y', mode: 'ADD', color: C.add },
  mul: { a: '0', b: 'x', c: 'y', d: 'x·y', eq: '0 + x·y = x·y', mode: 'MUL', color: C.mul },
  muladd: { a: 'z', b: 'x', c: 'y', d: 'x·y+z', eq: 'z + x·y = x·y+z', mode: 'MULADD', color: C.muladd },
};

function GatePanel({ mode }: { mode: 'empty' | 'add' | 'mul' | 'muladd' }) {
  const v = VALUES[mode];
  const cells: Array<{ k: 'a' | 'b' | 'c' | 'd'; x: number }> = [
    { k: 'a', x: 110 },
    { k: 'b', x: 180 },
    { k: 'c', x: 250 },
    { k: 'd', x: 320 },
  ];

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Selector q box (left) */}
      <motion.rect
        x={30} y={70} width={60} height={48} rx={8}
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        fill={`${C.selector}18`} stroke={C.selector} strokeWidth={1.2}
      />
      <text x={60} y={92} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.selector}>q</text>
      <text x={60} y={108} textAnchor="middle" fontSize={8} fill={C.selector} opacity={0.75}>selector</text>
      <text x={60} y={132} textAnchor="middle" fontSize={8} fill={C.mut}>1: enabled</text>

      {/* Connector line selector → cells */}
      <motion.line
        x1={92} y1={94} x2={108} y2={94}
        stroke={C.selector} strokeWidth={1} opacity={0.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2 }}
      />

      {/* 4 advice cells */}
      {cells.map((c, i) => (
        <g key={c.k}>
          <text x={c.x + 25} y={62} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cell}>
            {c.k}
          </text>
          <motion.rect
            x={c.x} y={70} width={50} height={48} rx={6}
            initial={{ opacity: 0, y: 76 }} animate={{ opacity: 1, y: 70 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            fill={`${C.cell}14`} stroke={C.cell} strokeWidth={1}
          />
          <AnimatePresence mode="wait">
            <motion.text
              key={`${mode}-${c.k}`}
              x={c.x + 25} y={100}
              textAnchor="middle" fontSize={13} fontWeight={700}
              fontFamily="monospace" fill={v.color}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25 }}
            >
              {v[c.k] || '·'}
            </motion.text>
          </AnimatePresence>
          <text x={c.x + 25} y={132} textAnchor="middle" fontSize={7.5} fill={C.mut}>
            advice
          </text>
        </g>
      ))}

      {/* column header label */}
      <text x={235} y={48} textAnchor="middle" fontSize={9} fill={C.mut}>4 advice columns (one row)</text>

      {/* Constraint formula */}
      <motion.rect
        x={60} y={170} width={400} height={40} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        fill={`${C.selector}10`} stroke={C.selector} strokeWidth={1} strokeDasharray="3 2"
      />
      <text x={260} y={195} textAnchor="middle" fontSize={13} fontFamily="monospace"
        fontWeight={700} fill={C.selector}>
        q · (a + b · c − d) = 0
      </text>

      {/* Mode badge + verification */}
      {mode !== 'empty' && (
        <g>
          <motion.rect
            x={140} y={228} width={240} height={36} rx={8}
            initial={{ opacity: 0, y: 234 }} animate={{ opacity: 1, y: 228 }}
            transition={{ delay: 0.45 }}
            fill={`${v.color}1c`} stroke={v.color} strokeWidth={1}
          />
          <text x={160} y={250} fontSize={11} fontWeight={700} fill={v.color}>{v.mode}</text>
          <text x={210} y={250} fontSize={11} fontFamily="monospace" fill={v.color}>
            {v.eq}
          </text>
          <text x={365} y={250} fontSize={13} fontWeight={700} fill={v.color}>✓</text>
        </g>
      )}

      {mode === 'empty' && (
        <text x={260} y={250} textAnchor="middle" fontSize={10} fill={C.mut}>
          모드 선택 시 cell 값이 채워짐
        </text>
      )}
    </svg>
  );
}

function MulAddHighlightPanel() {
  // Step 4: MULADD mode on the 4-cell layout PLUS the "all 3 ops, same gate" emphasis
  const v = VALUES.muladd;
  const cells: Array<{ k: 'a' | 'b' | 'c' | 'd'; x: number }> = [
    { k: 'a', x: 60 },
    { k: 'b', x: 120 },
    { k: 'c', x: 180 },
    { k: 'd', x: 240 },
  ];
  const ops = [
    { mode: 'ADD', vals: 'c=1 · d=x+y', color: C.add },
    { mode: 'MUL', vals: 'a=0 · d=x·y', color: C.mul },
    { mode: 'MULADD', vals: 'd=x·y+z', color: C.muladd },
  ];

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Selector q (top-left) */}
      <motion.rect
        x={10} y={20} width={40} height={48} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${C.selector}18`} stroke={C.selector} strokeWidth={1}
      />
      <text x={30} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.selector}>q</text>
      <text x={30} y={56} textAnchor="middle" fontSize={7.5} fill={C.selector} opacity={0.7}>sel</text>

      {/* 4 advice cells (MULADD) */}
      {cells.map((c, i) => (
        <g key={c.k}>
          <text x={c.x + 22} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cell}>
            {c.k}
          </text>
          <motion.rect
            x={c.x} y={20} width={44} height={48} rx={6}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            fill={`${C.cell}14`} stroke={C.cell} strokeWidth={1}
          />
          <text x={c.x + 22} y={50} textAnchor="middle" fontSize={13} fontWeight={700}
            fontFamily="monospace" fill={v.color}>
            {v[c.k]}
          </text>
        </g>
      ))}

      {/* Constraint formula (top-right) */}
      <motion.rect
        x={310} y={20} width={200} height={48} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        fill={`${C.selector}10`} stroke={C.selector} strokeWidth={1} strokeDasharray="3 2"
      />
      <text x={410} y={40} textAnchor="middle" fontSize={9} fill={C.selector} opacity={0.8}>
        같은 제약식
      </text>
      <text x={410} y={58} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fontWeight={700} fill={C.selector}>
        q · (a + b·c − d) = 0
      </text>

      {/* Three op mini-cards converging upward */}
      {ops.map((op, i) => (
        <g key={op.mode}>
          <motion.rect
            x={30 + i * 165} y={130} width={140} height={50} rx={8}
            initial={{ opacity: 0, y: 136 }} animate={{ opacity: 1, y: 130 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            fill={`${op.color}14`} stroke={op.color} strokeWidth={1}
          />
          <text x={100 + i * 165} y={150} textAnchor="middle" fontSize={11}
            fontWeight={700} fill={op.color}>{op.mode}</text>
          <text x={100 + i * 165} y={168} textAnchor="middle" fontSize={9}
            fontFamily="monospace" fill={op.color} opacity={0.85}>{op.vals}</text>

          {/* Arrow up to the constraint formula */}
          <motion.path
            d={`M ${100 + i * 165} 130 C ${100 + i * 165} 105, 410 105, 410 70`}
            fill="none" stroke={op.color} strokeWidth={1} opacity={0.55}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
            markerEnd="url(#flexArrow)"
          />
        </g>
      ))}

      <defs>
        <marker id="flexArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.selector} opacity={0.7} />
        </marker>
      </defs>

      {/* Bottom highlight badge */}
      <motion.rect
        x={60} y={210} width={400} height={48} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        fill={`${C.muladd}10`} stroke={C.muladd} strokeWidth={1} strokeDasharray="3 2"
      />
      <text x={260} y={230} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muladd}>
        ADD · MUL · MULADD — 모두 단일 게이트로 처리
      </text>
      <text x={260} y={247} textAnchor="middle" fontSize={9} fill={C.muladd} opacity={0.8}>
        selector column 1개 · custom gate 폭발 방지 · constraint 표가 단순화
      </text>
    </svg>
  );
}

function RangePanel() {
  // Step 5: Naive 16-box decomposition vs Lookup table
  const naiveCells = Array.from({ length: 16 }, (_, i) => i);

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Naive side — left */}
      <text x={120} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.naive}>
        Naive Decomposition
      </text>
      <text x={120} y={34} textAnchor="middle" fontSize={8.5} fill={C.naive} opacity={0.7}>
        16-bit 분해 → bit constraint × 16
      </text>

      {naiveCells.map((i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <g key={i}>
            <motion.rect
              x={40 + col * 40} y={50 + row * 36} width={32} height={28} rx={4}
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 + i * 0.025 }}
              fill={`${C.naive}18`} stroke={C.naive} strokeWidth={0.9}
            />
            <text x={56 + col * 40} y={68 + row * 36} textAnchor="middle"
              fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.naive}>
              b{i}²=b{i}
            </text>
          </g>
        );
      })}
      <motion.rect
        x={40} y={210} width={160} height={26} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        fill={`${C.naive}10`} stroke={C.naive} strokeWidth={0.8} strokeDasharray="3 2"
      />
      <text x={120} y={227} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.naive}>
        16 constraints
      </text>

      {/* VS divider */}
      <line x1={245} y1={50} x2={245} y2={240} stroke={C.mut} strokeWidth={0.5} strokeDasharray="2 3" opacity={0.5} />
      <text x={245} y={150} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mut}>vs</text>

      {/* Lookup side — right */}
      <text x={395} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.lookup}>
        Lookup Table
      </text>
      <text x={395} y={34} textAnchor="middle" fontSize={8.5} fill={C.lookup} opacity={0.7}>
        미리 계산된 [0, 2¹⁶) 테이블
      </text>

      {/* Single constraint box */}
      <motion.rect
        x={290} y={50} width={90} height={36} rx={6}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        fill={`${C.lookup}1c`} stroke={C.lookup} strokeWidth={1.2}
      />
      <text x={335} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.lookup}>x ∈ T</text>
      <text x={335} y={80} textAnchor="middle" fontSize={8} fill={C.lookup} opacity={0.7}>1 lookup</text>

      {/* Arrow to table */}
      <motion.path
        d="M 380 68 L 408 68"
        stroke={C.lookup} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.55 }}
        markerEnd="url(#lookArrow)"
      />

      <defs>
        <marker id="lookArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.lookup} />
        </marker>
      </defs>

      {/* Table T */}
      <motion.rect
        x={410} y={50} width={80} height={150} rx={6}
        initial={{ opacity: 0, y: 56 }} animate={{ opacity: 1, y: 50 }}
        transition={{ delay: 0.6 }}
        fill={`${C.lookup}10`} stroke={C.lookup} strokeWidth={1}
      />
      <text x={450} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.lookup}>Table T</text>
      <line x1={418} y1={72} x2={482} y2={72} stroke={C.lookup} strokeWidth={0.5} opacity={0.5} />
      {['0', '1', '2', '...', '2¹⁶−1'].map((v, i) => (
        <text key={i} x={450} y={88 + i * 20} textAnchor="middle"
          fontSize={9} fontFamily="monospace" fill={C.lookup} opacity={0.85}>
          {v}
        </text>
      ))}

      <motion.rect
        x={290} y={210} width={200} height={26} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        fill={`${C.lookup}10`} stroke={C.lookup} strokeWidth={0.8} strokeDasharray="3 2"
      />
      <text x={390} y={227} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.lookup}>
        1 constraint
      </text>

      {/* 16x reduction badge */}
      <motion.rect
        x={195} y={250} width={130} height={24} rx={12}
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0 }}
        fill={`${C.lookup}28`} stroke={C.lookup} strokeWidth={1.4}
      />
      <text x={260} y={266} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.lookup}>
        16× reduction
      </text>
    </svg>
  );
}

function ComboPanel() {
  // Step 6: FlexGate + RangeGate combined effect
  const apis = ['add', 'sub', 'mul', 'select', 'is_equal', 'range_check', 'less_than'];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Top: high-level APIs */}
      <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fg}>
        halo2-lib 고수준 API
      </text>
      {apis.map((api, i) => {
        const x = 30 + i * 68;
        return (
          <g key={api}>
            <motion.rect
              x={x} y={32} width={62} height={26} rx={13}
              initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 32 }}
              transition={{ delay: i * 0.06 }}
              fill={`${C.cell}14`} stroke={C.cell} strokeWidth={0.8}
            />
            <text x={x + 31} y={49} textAnchor="middle" fontSize={9}
              fontFamily="monospace" fontWeight={600} fill={C.cell}>
              {api}
            </text>
          </g>
        );
      })}

      {/* Arrows down to two gates */}
      {apis.map((_, i) => {
        const x = 61 + i * 68;
        const targetX = i < 5 ? 160 : 380;
        return (
          <motion.path
            key={i}
            d={`M ${x} 60 C ${x} 90, ${targetX} 90, ${targetX} 110`}
            fill="none" stroke={C.mut} strokeWidth={0.8} opacity={0.45}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
          />
        );
      })}

      {/* FlexGate box */}
      <motion.rect
        x={50} y={110} width={220} height={64} rx={10}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        fill={`${C.selector}1c`} stroke={C.selector} strokeWidth={1.4}
      />
      <text x={160} y={132} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.selector}>
        FlexGate
      </text>
      <text x={160} y={150} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={C.selector}>
        q · (a + b·c − d) = 0
      </text>
      <text x={160} y={165} textAnchor="middle" fontSize={8.5} fill={C.selector} opacity={0.7}>
        ADD · MUL · MULADD
      </text>

      {/* RangeGate box */}
      <motion.rect
        x={290} y={110} width={180} height={64} rx={10}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
        fill={`${C.lookup}1c`} stroke={C.lookup} strokeWidth={1.4}
      />
      <text x={380} y={132} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.lookup}>
        RangeGate
      </text>
      <text x={380} y={150} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={C.lookup}>
        x ∈ T (lookup)
      </text>
      <text x={380} y={165} textAnchor="middle" fontSize={8.5} fill={C.lookup} opacity={0.7}>
        16× constraint reduction
      </text>

      {/* Combined effect — bottom */}
      <motion.path
        d="M 160 174 L 230 200"
        stroke={C.muladd} strokeWidth={1} opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.05 }}
      />
      <motion.path
        d="M 380 174 L 290 200"
        stroke={C.muladd} strokeWidth={1} opacity={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 1.05 }}
      />
      <motion.rect
        x={120} y={200} width={280} height={60} rx={10}
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.15 }}
        fill={`${C.muladd}14`} stroke={C.muladd} strokeWidth={1.4}
      />
      <text x={260} y={221} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.muladd}>
        제약 수 감소 → MSM · FFT 비용 감소
      </text>
      <text x={260} y={239} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.muladd}>
        proving time ↓ · circuit area ↓
      </text>
      <text x={260} y={254} textAnchor="middle" fontSize={8.5} fill={C.muladd} opacity={0.7}>
        halo2-lib = FlexGate ⊕ RangeGate
      </text>
    </svg>
  );
}

export default function FlexGateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <GatePanel mode="empty" />;
        if (step === 1) return <GatePanel mode="add" />;
        if (step === 2) return <GatePanel mode="mul" />;
        if (step === 3) return <MulAddHighlightPanel />;
        if (step === 4) return <RangePanel />;
        return <ComboPanel />;
      }}
    </StepViz>
  );
}
