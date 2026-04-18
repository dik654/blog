import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import M from '@/components/ui/math';

const C = {
  a: '#3b82f6',
  b: '#10b981',
  c: '#f59e0b',
  d: '#a855f7',
  carry: '#ef4444',
  mult: '#ec4899',
  mut: '#9ca3af',
  fg: '#e5e7eb',
};

const STEPS = [
  {
    label: '1. 256bit 워드 4개 — 각 64bit limb 4개로 분해',
    body: (
      <>
        EVM 워드 <M>{'a, b, c, d \\in [0, 2^{256})'}</M> 각각을 4개의 64bit limb로 쪼갠다.{'\n'}
        분해: <M>{'a = a_0 + a_1 \\cdot 2^{64} + a_2 \\cdot 2^{128} + a_3 \\cdot 2^{192}'}</M>.
      </>
    ),
  },
  {
    label: '2. 회로 layout — 8행 × 4열, q_step=1 행 강조',
    body: (
      <>
        4 advice column에 4행으로 배치: a-limb / b-limb / (c_lo, c_hi, d_lo, d_hi) / carry.{'\n'}
        <code>q_step=1</code>인 첫 행이 게이트 활성 trigger.
      </>
    ),
  },
  {
    label: '3. 하위 부분곱 t_0 = a[0] · b[0]',
    body: (
      <>
        가장 낮은 limb 두 개의 곱이 결과의 하위 128bit 핵심.{'\n'}
        <M>{'t_0 \\in [0, 2^{128})'}</M> — 64bit · 64bit이라 최대 128bit.
      </>
    ),
  },
  {
    label: '4. 교차 부분곱 t_1 = a[0]·b[1] + a[1]·b[0]',
    body: (
      <>
        다음 자릿수의 두 교차곱 합산. <M>{'t_1 \\cdot 2^{64}'}</M>로 시프트되어 t_0와 합쳐진다.{'\n'}
        4개 셀이 동시에 게이트 입력.
      </>
    ),
  },
  {
    label: '5. carry 전파 + 16-bit lookup 검증',
    body: (
      <>
        <M>{'(t_0 + t_1 \\cdot 2^{64}) + c_{\\text{lo}} = d_{\\text{lo}} + \\text{carry} \\cdot 2^{128}'}</M>{'\n'}
        carry는 16bit 단위로 분해 → u16 lookup table로 범위 검증.
      </>
    ),
  },
];

function WordBreakdownPanel() {
  const words: Array<{ k: string; color: string; y: number }> = [
    { k: 'a', color: C.a, y: 30 },
    { k: 'b', color: C.b, y: 90 },
    { k: 'c', color: C.c, y: 150 },
    { k: 'd', color: C.d, y: 210 },
  ];
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={14} textAnchor="middle" fontSize={9} fill={C.mut}>
        256bit word → 4 × 64bit limb
      </text>

      {words.map((w, wi) => (
        <g key={w.k}>
          {/* full 256bit bar */}
          <motion.rect
            x={20} y={w.y} width={120} height={36} rx={6}
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: wi * 0.1 }}
            fill={`${w.color}1c`} stroke={w.color} strokeWidth={1}
          />
          <text x={80} y={w.y + 16} textAnchor="middle" fontSize={13}
            fontWeight={700} fill={w.color}>{w.k}</text>
          <text x={80} y={w.y + 30} textAnchor="middle" fontSize={7.5}
            fill={w.color} opacity={0.7}>256 bit</text>

          {/* arrow → split */}
          <motion.path
            d={`M 145 ${w.y + 18} L 175 ${w.y + 18}`}
            stroke={w.color} strokeWidth={1} opacity={0.6}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + wi * 0.1 }}
            markerEnd={`url(#arr-${w.k})`}
          />
          <defs>
            <marker id={`arr-${w.k}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={w.color} opacity={0.7} />
            </marker>
          </defs>

          {/* 4 limbs */}
          {[0, 1, 2, 3].map((li) => (
            <g key={li}>
              <motion.rect
                x={180 + li * 80} y={w.y} width={72} height={36} rx={5}
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + wi * 0.1 + li * 0.06 }}
                fill={`${w.color}10`} stroke={w.color} strokeWidth={0.9}
              />
              <text x={216 + li * 80} y={w.y + 15} textAnchor="middle" fontSize={10}
                fontWeight={700} fontFamily="monospace" fill={w.color}>
                {w.k}[{li}]
              </text>
              <text x={216 + li * 80} y={w.y + 28} textAnchor="middle" fontSize={7}
                fill={w.color} opacity={0.7}>64b</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function GridLayoutPanel() {
  const rows: Array<{ q: string; cells: string[]; tag: string; tagColor: string }> = [
    { q: '1', cells: ['a[0]', 'a[1]', 'a[2]', 'a[3]'], tag: 'a-limb', tagColor: C.a },
    { q: '0', cells: ['b[0]', 'b[1]', 'b[2]', 'b[3]'], tag: 'b-limb', tagColor: C.b },
    { q: '0', cells: ['c_lo', 'c_hi', 'd_lo', 'd_hi'], tag: 'c/d half', tagColor: C.c },
    { q: '0', cells: ['car0', 'car1', 'car2', 'car3'], tag: 'carry 16b', tagColor: C.carry },
  ];

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* col headers */}
      <text x={130} y={32} textAnchor="middle" fontSize={9} fill={C.mut}>q_step</text>
      {[0, 1, 2, 3].map((ci) => (
        <text key={ci} x={195 + ci * 65} y={32} textAnchor="middle" fontSize={9} fill={C.mut}>
          col{ci}
        </text>
      ))}
      <text x={485} y={32} textAnchor="middle" fontSize={9} fill={C.mut}>role</text>

      {rows.map((r, ri) => {
        const y = 50 + ri * 50;
        const isQActive = r.q === '1';
        const rowColor = ri === 0 ? C.a : ri === 1 ? C.b : ri === 2 ? C.c : C.carry;
        return (
          <g key={ri}>
            {/* q_step cell */}
            <motion.rect
              x={100} y={y} width={60} height={36} rx={5}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: ri * 0.08 }}
              fill={isQActive ? `${C.mult}24` : `${C.mut}10`}
              stroke={isQActive ? C.mult : C.mut}
              strokeWidth={isQActive ? 1.4 : 0.7}
            />
            <text x={130} y={y + 22} textAnchor="middle" fontSize={11}
              fontWeight={700} fontFamily="monospace"
              fill={isQActive ? C.mult : C.mut}>
              {r.q}
            </text>

            {/* 4 cells */}
            {r.cells.map((cell, ci) => (
              <g key={ci}>
                <motion.rect
                  x={165 + ci * 65} y={y} width={60} height={36} rx={5}
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 + ri * 0.08 + ci * 0.04 }}
                  fill={`${rowColor}14`} stroke={rowColor} strokeWidth={1}
                />
                <text x={195 + ci * 65} y={y + 22} textAnchor="middle" fontSize={9.5}
                  fontWeight={600} fontFamily="monospace" fill={rowColor}>
                  {cell}
                </text>
              </g>
            ))}

            {/* role label */}
            <text x={485} y={y + 22} textAnchor="middle" fontSize={8.5}
              fontWeight={600} fill={r.tagColor}>{r.tag}</text>
          </g>
        );
      })}

      {/* highlight arrow on q_step=1 */}
      <motion.path
        d="M 80 68 L 96 68"
        stroke={C.mult} strokeWidth={1.5}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.6 }}
        markerEnd="url(#qArrow)"
      />
      <defs>
        <marker id="qArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.mult} />
        </marker>
      </defs>
      <text x={50} y={71} textAnchor="middle" fontSize={8.5}
        fontWeight={700} fill={C.mult}>q=1</text>
    </svg>
  );
}

function PartialProductPanel({ cross }: { cross: boolean }) {
  // cells: a row at top, b row below, result node at bottom
  const aCells = [
    { x: 60, label: 'a[0]' },
    { x: 140, label: 'a[1]' },
    { x: 220, label: 'a[2]' },
    { x: 300, label: 'a[3]' },
  ];
  const bCells = [
    { x: 60, label: 'b[0]' },
    { x: 140, label: 'b[1]' },
    { x: 220, label: 'b[2]' },
    { x: 300, label: 'b[3]' },
  ];

  // active indices
  const aActive = cross ? [0, 1] : [0];
  const bActive = cross ? [0, 1] : [0];
  // edges for partial product
  const edges = cross
    ? [{ a: 0, b: 1 }, { a: 1, b: 0 }]
    : [{ a: 0, b: 0 }];

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={260} y={16} textAnchor="middle" fontSize={9.5} fontWeight={600}
        fill={cross ? C.mult : C.mult}>
        {cross ? 't₁ = a[0]·b[1] + a[1]·b[0]  (교차 부분곱)' : 't₀ = a[0] · b[0]  (하위 부분곱)'}
      </text>

      {/* a row */}
      <text x={30} y={52} textAnchor="middle" fontSize={9} fill={C.a} fontWeight={700}>a</text>
      {aCells.map((c, i) => {
        const on = aActive.includes(i);
        return (
          <g key={`a${i}`}>
            <motion.rect
              x={c.x} y={36} width={64} height={36} rx={5}
              initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.18 }}
              transition={{ delay: i * 0.04 }}
              fill={on ? `${C.a}22` : `${C.a}08`} stroke={C.a}
              strokeWidth={on ? 1.6 : 0.6}
            />
            {on && (
              <motion.rect
                x={c.x - 2} y={34} width={68} height={40} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 + i * 0.08 }}
                fill="none" stroke={C.mult} strokeWidth={1.2}
              />
            )}
            <text x={c.x + 32} y={58} textAnchor="middle" fontSize={11}
              fontWeight={700} fontFamily="monospace"
              fill={on ? C.a : `${C.a}80`}>{c.label}</text>
          </g>
        );
      })}

      {/* b row */}
      <text x={30} y={132} textAnchor="middle" fontSize={9} fill={C.b} fontWeight={700}>b</text>
      {bCells.map((c, i) => {
        const on = bActive.includes(i);
        return (
          <g key={`b${i}`}>
            <motion.rect
              x={c.x} y={116} width={64} height={36} rx={5}
              initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.18 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              fill={on ? `${C.b}22` : `${C.b}08`} stroke={C.b}
              strokeWidth={on ? 1.6 : 0.6}
            />
            {on && (
              <motion.rect
                x={c.x - 2} y={114} width={68} height={40} rx={6}
                initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 + i * 0.08 }}
                fill="none" stroke={C.mult} strokeWidth={1.2}
              />
            )}
            <text x={c.x + 32} y={138} textAnchor="middle" fontSize={11}
              fontWeight={700} fontFamily="monospace"
              fill={on ? C.b : `${C.b}80`}>{c.label}</text>
          </g>
        );
      })}

      {/* multiplication arrows from a/b cells → result node */}
      {edges.map((e, ei) => {
        const ax = aCells[e.a].x + 32;
        const bx = bCells[e.b].x + 32;
        const targetX = 260, targetY = 220;
        return (
          <g key={ei}>
            <motion.path
              d={`M ${ax} 72 Q ${ax} 180, ${targetX} ${targetY}`}
              fill="none" stroke={C.mult} strokeWidth={1.1} opacity={0.75}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + ei * 0.15, duration: 0.6 }}
              strokeDasharray="3 2"
            />
            <motion.path
              d={`M ${bx} 152 Q ${bx} 200, ${targetX} ${targetY}`}
              fill="none" stroke={C.mult} strokeWidth={1.1} opacity={0.75}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.6 + ei * 0.15, duration: 0.6 }}
              strokeDasharray="3 2"
            />
            {/* mid dot for the multiplication */}
            <motion.circle
              cx={(ax + bx) / 2} cy={94} r={3}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + ei * 0.15 }}
              fill={C.mult}
            />
            <motion.text
              x={(ax + bx) / 2 + 8} y={97}
              fontSize={8} fontWeight={700} fill={C.mult}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.85 + ei * 0.15 }}
            >×</motion.text>
          </g>
        );
      })}

      {/* result node */}
      <motion.rect
        x={195} y={200} width={130} height={42} rx={8}
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0 }}
        fill={`${C.mult}1c`} stroke={C.mult} strokeWidth={1.4}
      />
      <text x={260} y={219} textAnchor="middle" fontSize={11}
        fontWeight={700} fontFamily="monospace" fill={C.mult}>
        {cross ? 't₁' : 't₀'}
      </text>
      <text x={260} y={234} textAnchor="middle" fontSize={8} fill={C.mult} opacity={0.8}>
        {cross ? '∈ [0, 2¹²⁹)' : '∈ [0, 2¹²⁸)'}
      </text>

      {/* sum sign for cross case */}
      {cross && (
        <motion.text
          x={260} y={188} textAnchor="middle"
          fontSize={14} fontWeight={700} fill={C.mult}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >+</motion.text>
      )}
    </svg>
  );
}

function CarryPropagationPanel() {
  // Show: t0 + t1·2^64 + c_lo = d_lo + carry·2^128
  // Visualize carry chain across limbs with 16-bit lookup
  const carryNodes = [
    { x: 80, label: 'car0' },
    { x: 175, label: 'car1' },
    { x: 270, label: 'car2' },
    { x: 365, label: 'car3' },
  ];

  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Top: equation summary */}
      <motion.rect
        x={30} y={14} width={460} height={32} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${C.mult}10`} stroke={C.mult} strokeWidth={0.9} strokeDasharray="3 2"
      />
      <text x={260} y={34} textAnchor="middle" fontSize={10.5}
        fontFamily="monospace" fontWeight={700} fill={C.mult}>
        (t₀ + t₁·2⁶⁴) + c_lo = d_lo + carry · 2¹²⁸
      </text>

      {/* Source: t0+t1, c_lo */}
      <motion.rect
        x={30} y={70} width={100} height={36} rx={6}
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
        fill={`${C.mult}18`} stroke={C.mult} strokeWidth={1}
      />
      <text x={80} y={88} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.mult}>t₀+t₁·2⁶⁴</text>
      <text x={80} y={100} textAnchor="middle" fontSize={7.5} fill={C.mult} opacity={0.75}>부분곱 합</text>

      <motion.rect
        x={155} y={70} width={70} height={36} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        fill={`${C.c}18`} stroke={C.c} strokeWidth={1}
      />
      <text x={190} y={88} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.c}>c_lo</text>
      <text x={190} y={100} textAnchor="middle" fontSize={7.5} fill={C.c} opacity={0.75}>+</text>

      <motion.text
        x={245} y={91} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.fg}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
      >=</motion.text>

      <motion.rect
        x={270} y={70} width={70} height={36} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        fill={`${C.d}18`} stroke={C.d} strokeWidth={1}
      />
      <text x={305} y={88} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.d}>d_lo</text>
      <text x={305} y={100} textAnchor="middle" fontSize={7.5} fill={C.d} opacity={0.75}>결과 하위</text>

      <motion.text
        x={355} y={91} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.fg}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >+</motion.text>

      <motion.rect
        x={370} y={70} width={120} height={36} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        fill={`${C.carry}1c`} stroke={C.carry} strokeWidth={1.2}
      />
      <text x={430} y={88} textAnchor="middle" fontSize={10}
        fontWeight={700} fontFamily="monospace" fill={C.carry}>carry · 2¹²⁸</text>
      <text x={430} y={100} textAnchor="middle" fontSize={7.5} fill={C.carry} opacity={0.75}>올림</text>

      {/* carry chain — 4 carry nodes */}
      {carryNodes.map((n, i) => (
        <g key={i}>
          <motion.rect
            x={n.x - 28} y={150} width={56} height={32} rx={5}
            initial={{ opacity: 0, y: 156 }} animate={{ opacity: 1, y: 150 }}
            transition={{ delay: 0.7 + i * 0.12 }}
            fill={`${C.carry}1a`} stroke={C.carry} strokeWidth={1}
          />
          <text x={n.x} y={166} textAnchor="middle" fontSize={9.5}
            fontWeight={700} fontFamily="monospace" fill={C.carry}>{n.label}</text>
          <text x={n.x} y={176} textAnchor="middle" fontSize={7} fill={C.carry} opacity={0.75}>16b</text>

          {/* propagation arrow to next */}
          {i < carryNodes.length - 1 && (
            <motion.path
              d={`M ${n.x + 28} 166 L ${carryNodes[i + 1].x - 28} 166`}
              stroke={C.carry} strokeWidth={1.1} opacity={0.8}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.85 + i * 0.12, duration: 0.4 }}
              markerEnd="url(#carryArr)"
            />
          )}

          {/* lookup verification arrow → table */}
          <motion.path
            d={`M ${n.x} 182 L ${n.x} 210`}
            stroke={C.b} strokeWidth={0.9} opacity={0.7} strokeDasharray="2 2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 1.2 + i * 0.08 }}
          />
        </g>
      ))}

      <defs>
        <marker id="carryArr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={C.carry} />
        </marker>
      </defs>

      {/* 16-bit lookup table */}
      <motion.rect
        x={40} y={216} width={400} height={42} rx={8}
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4 }}
        fill={`${C.b}14`} stroke={C.b} strokeWidth={1.2} strokeDasharray="3 2"
      />
      <text x={240} y={236} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.b}>u16 lookup table  [0, 2¹⁶)</text>
      <text x={240} y={250} textAnchor="middle" fontSize={8.5}
        fill={C.b} opacity={0.78}>각 carry 셀이 16-bit 범위 내임을 단일 lookup으로 검증</text>

      {/* edge label "carry-in" arrow */}
      <motion.path
        d="M 130 116 L 80 144"
        stroke={C.mult} strokeWidth={0.9} opacity={0.55}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.65 }}
      />
    </svg>
  );
}

export default function MulAddLimbViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <WordBreakdownPanel />;
        if (step === 1) return <GridLayoutPanel />;
        if (step === 2) return <PartialProductPanel cross={false} />;
        if (step === 3) return <PartialProductPanel cross={true} />;
        return <CarryPropagationPanel />;
      }}
    </StepViz>
  );
}
