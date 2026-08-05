import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const COLORS = {
  r1cs: '#6366f1',
  plonk: '#f59e0b',
  air: '#10b981',
  logup: '#ec4899',
};

const STEPS = [
  {
    label: '1. R1CS — Rank-1 Constraint System',
    body: (
      <>
        각 제약이 <M>{'(A\\cdot x)\\times(B\\cdot x)=(C\\cdot x)'}</M> 형태의 rank-1 등식. Groth16·Marlin의 기반.
        {'\n'}장점: 범용 회로 표현. 단점: 순차 연산에 행렬이 희소하게 커짐.
      </>
    ),
  },
  {
    label: '2. PLONKish — Custom Gates + Lookup',
    body: (
      <>
        selector <M>q(X)</M>가 각 행의 게이트 종류를 스위칭: <M>{'q(X)\\cdot \\text{gate}(X)=0'}</M>.{'\n'}
        회전(rotation)으로 인접 행 참조, lookup 인수로 테이블 조회(zkEVM에 강력).
      </>
    ),
  },
  {
    label: '3. AIR — Transition over Trace Rows',
    body: (
      <>
        실행 트레이스를 행 단위로 보고 <M>{'\\text{next} - f(\\text{current}) = 0'}</M> 형태의 전이 제약.{'\n'}
        Fibonacci: <M>{'\\text{next}.a - \\text{cur}.b = 0'}</M>, <M>{'\\text{next}.b - \\text{cur}.a - \\text{cur}.b = 0'}</M>. 상태 머신·zkVM에 자연스러움.
      </>
    ),
  },
  {
    label: '4. Plonky3 — AIR + logUp',
    body: (
      <>
        AIR의 간결한 전이 표현에 logUp lookup argument를 결합.{'\n'}
        범용성(R1CS) · lookup(PLONKish) · 순차(AIR)의 장점을 동시에 취함 — zkVM 최적.
      </>
    ),
  },
];

// Fibonacci trace rows for step 3
const FIB = [
  { a: 1, b: 1 },
  { a: 1, b: 2 },
  { a: 2, b: 3 },
  { a: 3, b: 5 },
];

function R1CSPanel() {
  // Matrix-like visual: A, B, C stacked
  const mats = [
    { name: 'A', x: 30 },
    { name: 'B', x: 170 },
    { name: 'C', x: 310 },
  ];
  return (
    <svg viewBox="0 0 460 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {mats.map((m, i) => (
        <g key={m.name}>
          <motion.rect
            x={m.x} y={40} width={90} height={90} rx={6}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            fill={`${COLORS.r1cs}18`} stroke={COLORS.r1cs} strokeWidth={1.2}
          />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => (
            <text key={`${r}-${c}`} x={m.x + 15 + c * 30} y={60 + r * 28}
              fontSize={9} fontFamily="monospace" fill={COLORS.r1cs} opacity={0.75}>
              {(r === c ? '1' : (r + c) % 2 === 0 ? '0' : '*')}
            </text>
          )))}
          <text x={m.x + 45} y={35} fontSize={11} textAnchor="middle"
            fontWeight={700} fill={COLORS.r1cs}>{m.name}</text>
          <text x={m.x + 45} y={148} fontSize={9} textAnchor="middle"
            fill={COLORS.r1cs} opacity={0.7}>{m.name}·x</text>
        </g>
      ))}
      <text x={140} y={95} fontSize={16} textAnchor="middle" fill={COLORS.r1cs} fontWeight={700}>×</text>
      <text x={280} y={95} fontSize={16} textAnchor="middle" fill={COLORS.r1cs} fontWeight={700}>=</text>
      <text x={230} y={185} textAnchor="middle" fontSize={11} fontFamily="monospace"
        fill={COLORS.r1cs}>(A·x) × (B·x) = (C·x)</text>
      <text x={230} y={205} textAnchor="middle" fontSize={8} fill={COLORS.r1cs} opacity={0.6}>
        rank-1 equation · Groth16 / Marlin
      </text>
    </svg>
  );
}

function PLONKishPanel() {
  const cols = ['a', 'b', 'c', 'q_add', 'q_mul'];
  const rows = [
    ['2', '3', '5', '1', '0'],
    ['4', '5', '20', '0', '1'],
    ['7', '2', '9', '1', '0'],
  ];
  return (
    <svg viewBox="0 0 460 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {cols.map((c, i) => (
        <g key={c}>
          <motion.rect x={50 + i * 65} y={20} width={60} height={20} rx={4}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}
            fill={`${COLORS.plonk}18`} stroke={COLORS.plonk} strokeWidth={1} />
          <text x={80 + i * 65} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace"
            fontWeight={700} fill={COLORS.plonk}>{c}</text>
        </g>
      ))}
      {rows.map((row, ri) => row.map((v, ci) => {
        const isSel = ci >= 3;
        const on = v === '1';
        return (
          <g key={`${ri}-${ci}`}>
            <motion.rect x={50 + ci * 65} y={45 + ri * 26} width={60} height={22} rx={3}
              initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + ri * 0.1 + ci * 0.05 }}
              fill={isSel && on ? `${COLORS.plonk}28` : '#ffffff04'}
              stroke={`${COLORS.plonk}40`} strokeWidth={0.6} />
            <text x={80 + ci * 65} y={60 + ri * 26} textAnchor="middle" fontSize={9}
              fontFamily="monospace"
              fill={isSel ? (on ? COLORS.plonk : `${COLORS.plonk}50`) : COLORS.plonk}
              fontWeight={isSel && on ? 700 : 400}>{v}</text>
          </g>
        );
      }))}
      <text x={230} y={145} textAnchor="middle" fontSize={10} fontFamily="monospace"
        fill={COLORS.plonk} fontWeight={600}>q_add·(a+b−c) + q_mul·(a·b−c) = 0</text>
      <text x={230} y={168} textAnchor="middle" fontSize={9} fill={COLORS.plonk} opacity={0.75}>
        selector q(X)로 gate 선택 · rotation으로 인접 row 참조
      </text>
      <motion.rect x={50} y={180} width={360} height={22} rx={4}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        fill={`${COLORS.plonk}10`} stroke={`${COLORS.plonk}50`} strokeDasharray="3 2" />
      <text x={230} y={195} textAnchor="middle" fontSize={9} fill={COLORS.plonk}>
        + lookup table (XOR / range / SBOX…) — zkEVM 친화
      </text>
    </svg>
  );
}

function AIRPanel() {
  const rowH = 28, startY = 35, x0 = 130;
  return (
    <svg viewBox="0 0 460 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={x0 + 30} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.air}>a</text>
      <text x={x0 + 90} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.air}>b</text>
      <text x={80} y={25} textAnchor="middle" fontSize={9} fill={COLORS.air} opacity={0.7}>row</text>

      {FIB.map((r, i) => (
        <g key={i}>
          <text x={80} y={startY + 15 + i * rowH} textAnchor="middle" fontSize={9}
            fontFamily="monospace" fill={COLORS.air} opacity={0.7}>{i}</text>
          <motion.rect x={x0} y={startY + i * rowH} width={60} height={22} rx={4}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            fill={`${COLORS.air}18`} stroke={COLORS.air} strokeWidth={1} />
          <text x={x0 + 30} y={startY + 15 + i * rowH} textAnchor="middle"
            fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.air}>{r.a}</text>
          <motion.rect x={x0 + 60} y={startY + i * rowH} width={60} height={22} rx={4}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 + i * 0.15 }}
            fill={`${COLORS.air}18`} stroke={COLORS.air} strokeWidth={1} />
          <text x={x0 + 90} y={startY + 15 + i * rowH} textAnchor="middle"
            fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.air}>{r.b}</text>

          {/* Arrows to next row */}
          {i < FIB.length - 1 && (
            <>
              {/* cur.b -> next.a (shift) */}
              <motion.path
                d={`M ${x0 + 90} ${startY + 22 + i * rowH} C ${x0 + 110} ${startY + rowH + i * rowH}, ${x0 + 50} ${startY + rowH + i * rowH}, ${x0 + 30} ${startY + (i + 1) * rowH}`}
                fill="none" stroke={COLORS.air} strokeWidth={1} opacity={0.7}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
                markerEnd="url(#airArrow)" />
              {/* cur.a + cur.b -> next.b */}
              <motion.path
                d={`M ${x0 + 30} ${startY + 22 + i * rowH} C ${x0} ${startY + rowH + i * rowH}, ${x0 + 130} ${startY + rowH + i * rowH + 4}, ${x0 + 90} ${startY + (i + 1) * rowH}`}
                fill="none" stroke={COLORS.air} strokeWidth={1} opacity={0.55} strokeDasharray="2 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.7 + i * 0.15, duration: 0.4 }}
                markerEnd="url(#airArrow)" />
            </>
          )}
        </g>
      ))}

      <defs>
        <marker id="airArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={COLORS.air} />
        </marker>
      </defs>

      {/* Side: constraints */}
      <text x={270} y={50} fontSize={10} fontWeight={700} fill={COLORS.air}>Fibonacci transitions</text>
      <text x={270} y={72} fontSize={9} fontFamily="monospace" fill={COLORS.air} opacity={0.9}>
        next.a − cur.b = 0
      </text>
      <text x={270} y={88} fontSize={8} fill={COLORS.air} opacity={0.55}>(shift)</text>
      <text x={270} y={110} fontSize={9} fontFamily="monospace" fill={COLORS.air} opacity={0.9}>
        next.b − cur.a − cur.b = 0
      </text>
      <text x={270} y={126} fontSize={8} fill={COLORS.air} opacity={0.55}>(fib step)</text>

      <text x={270} y={160} fontSize={9} fill={COLORS.air} opacity={0.8}>boundary:</text>
      <text x={270} y={176} fontSize={9} fontFamily="monospace" fill={COLORS.air}>
        row_0 = (1, 1)
      </text>
      <text x={270} y={200} fontSize={8} fill={COLORS.air} opacity={0.6}>
        rotation ω·x → 다음 행 참조
      </text>
    </svg>
  );
}

function ComboPanel() {
  const cards = [
    { color: COLORS.r1cs, name: 'R1CS', tag: 'rank-1 matrix', use: 'general', y: 30 },
    { color: COLORS.plonk, name: 'PLONKish', tag: 'custom gates', use: 'zkEVM', y: 30 },
    { color: COLORS.air, name: 'AIR', tag: 'row transition', use: 'zkVM', y: 30 },
    { color: COLORS.logup, name: '+ logUp', tag: 'lookup arg.', use: 'tables', y: 30 },
  ];
  return (
    <svg viewBox="0 0 460 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {cards.map((c, i) => {
        const x = 15 + i * 112;
        return (
          <g key={c.name}>
            <motion.rect x={x} y={c.y} width={100} height={110} rx={8}
              initial={{ opacity: 0, y: c.y + 10 }} animate={{ opacity: 1, y: c.y }}
              transition={{ delay: i * 0.15 }}
              fill={`${c.color}14`} stroke={c.color} strokeWidth={1.2} />
            <text x={x + 50} y={c.y + 22} textAnchor="middle" fontSize={11}
              fontWeight={700} fill={c.color}>{c.name}</text>
            <text x={x + 50} y={c.y + 42} textAnchor="middle" fontSize={8.5}
              fontFamily="monospace" fill={c.color} opacity={0.85}>{c.tag}</text>
            <line x1={x + 15} y1={c.y + 55} x2={x + 85} y2={c.y + 55}
              stroke={c.color} strokeWidth={0.6} opacity={0.4} />
            <text x={x + 50} y={c.y + 75} textAnchor="middle" fontSize={8} fill={c.color} opacity={0.65}>
              fit for
            </text>
            <text x={x + 50} y={c.y + 92} textAnchor="middle" fontSize={10}
              fontFamily="monospace" fontWeight={600} fill={c.color}>{c.use}</text>
          </g>
        );
      })}

      {/* bracket showing AIR+logUp */}
      <motion.path d="M 245 150 Q 340 175 435 150" fill="none"
        stroke={COLORS.logup} strokeWidth={1.2} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }} />
      <text x={340} y={190} textAnchor="middle" fontSize={10}
        fontFamily="monospace" fontWeight={700} fill={COLORS.logup}>
        Plonky3 = AIR + logUp
      </text>
      <text x={340} y={208} textAnchor="middle" fontSize={8} fill={COLORS.logup} opacity={0.7}>
        순차 전이 + 효율적 lookup
      </text>
    </svg>
  );
}

export default function ArithmetizationCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <R1CSPanel />;
        if (step === 1) return <PLONKishPanel />;
        if (step === 2) return <AIRPanel />;
        return <ComboPanel />;
      }}
    </StepViz>
  );
}
