import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const COLORS = {
  constrain: '#10b981',      // <==  제약+대입 (안전)
  assignOnly: '#f59e0b',     // <--  대입만 (주의)
  constrainOnly: '#6366f1',  // ===  제약만
  danger: '#ef4444',
  safe: '#10b981',
  muted: '#64748b',
};

const STEPS = [
  {
    label: '1. <== 제약 + 대입',
    body: (
      <>
        <code>{'c <== a * b'}</code> — 값 대입 AND R1CS 제약 추가. 선형·이차 표현식에서 항상 권장.
        {'\n'}대입: c = a*b. 제약: c − a*b = 0 → A=[a], B=[b], C=[c] 한 행 삽입.
      </>
    ),
  },
  {
    label: '2. <-- 대입만 (비결정적)',
    body: (
      <>
        <code>{'c <-- a * b'}</code> — 값만 대입, 제약 없음. R1CS 테이블은 비어있다.
        {'\n'}위험: 증명자가 임의 값을 넣어도 검증 통과. 반드시 === 로 제약 따로 추가.
      </>
    ),
  },
  {
    label: '3. === 제약만 (Circom 2)',
    body: (
      <>
        <code>{'c === a * b'}</code> — 대입 없이 제약만 추가. c는 이미 값이 있어야 한다.
        {'\n'}용도: <code>{'<--'}</code>로 대입한 witness에 나중에 제약을 강제할 때.
      </>
    ),
  },
  {
    label: '4. 안티패턴 vs 올바른 사용',
    body: (
      <>
        <code>{'out <-- in / 2;'}</code> 단독은 제약 없음 — 악의적 증명자가 임의 <code>out</code>으로 증명 생성 가능.
        {'\n'}해결: <code>{'in === out * 2;'}</code>로 제약 강제 (나눗셈은 R1CS 표현 불가 → 곱셈 형태로 바꿔 제약).
      </>
    ),
  },
];

// ───────────────────────────── Panel 1: <==  (constrain + assign)

function ConstrainAssignPanel() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* code line */}
      <motion.rect x={20} y={14} width={440} height={28} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${COLORS.constrain}14`} stroke={COLORS.constrain} strokeWidth={1.2} />
      <text x={240} y={33} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fontWeight={700} fill={COLORS.constrain}>
        c {'<=='} a * b     // a=3, b=7
      </text>

      {/* Variable assign area */}
      <text x={30} y={64} fontSize={10} fontWeight={700} fill={COLORS.muted}>변수 대입 영역</text>
      <motion.rect x={20} y={72} width={200} height={130} rx={8}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        fill="#ffffff06" stroke={COLORS.muted} strokeWidth={0.8} strokeDasharray="3 2" />

      {[
        { k: 'a', v: '3', delay: 0.2 },
        { k: 'b', v: '7', delay: 0.3 },
        { k: 'c', v: '21', delay: 0.7, highlight: true },
      ].map((row, i) => (
        <g key={row.k}>
          <motion.rect x={32} y={84 + i * 38} width={176} height={28} rx={5}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: row.delay }}
            fill={row.highlight ? `${COLORS.constrain}22` : '#ffffff08'}
            stroke={row.highlight ? COLORS.constrain : `${COLORS.muted}80`}
            strokeWidth={row.highlight ? 1.4 : 0.8} />
          <text x={46} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={row.highlight ? COLORS.constrain : COLORS.muted}>{row.k}</text>
          <text x={72} y={103 + i * 38} fontSize={10} fontFamily="monospace"
            fill={COLORS.muted}>=</text>
          <text x={90} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={row.highlight ? COLORS.constrain : COLORS.muted}>{row.v}</text>
          {row.highlight && (
            <motion.text x={200} y={103 + i * 38} textAnchor="end" fontSize={9}
              fontFamily="monospace" fill={COLORS.constrain}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}>← 대입</motion.text>
          )}
        </g>
      ))}

      {/* R1CS table */}
      <text x={240} y={64} fontSize={10} fontWeight={700} fill={COLORS.constrain}>R1CS 제약 테이블</text>
      <motion.rect x={240} y={72} width={220} height={130} rx={8}
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        fill={`${COLORS.constrain}0c`} stroke={COLORS.constrain} strokeWidth={1} />

      {['A', 'B', 'C'].map((col, i) => (
        <text key={col} x={272 + i * 60} y={92} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={COLORS.constrain}>{col}</text>
      ))}
      <line x1={250} y1={98} x2={450} y2={98} stroke={COLORS.constrain} strokeWidth={0.6} opacity={0.5} />

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        {['[a]', '[b]', '[c]'].map((cell, i) => (
          <g key={i}>
            <rect x={252 + i * 60} y={106} width={40} height={22} rx={4}
              fill={`${COLORS.constrain}22`} stroke={COLORS.constrain} strokeWidth={0.8} />
            <text x={272 + i * 60} y={121} textAnchor="middle" fontSize={10}
              fontFamily="monospace" fontWeight={700} fill={COLORS.constrain}>{cell}</text>
          </g>
        ))}
      </motion.g>

      <motion.text x={350} y={156} textAnchor="middle" fontSize={10} fontFamily="monospace"
        fontWeight={700} fill={COLORS.constrain}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        (A·x)(B·x) = (C·x)
      </motion.text>
      <motion.text x={350} y={176} textAnchor="middle" fontSize={9} fontFamily="monospace"
        fill={COLORS.constrain} opacity={0.85}
        initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} transition={{ delay: 1.2 }}>
        3 · 7 = 21 ✓
      </motion.text>
      <motion.text x={350} y={192} textAnchor="middle" fontSize={8}
        fill={COLORS.constrain} opacity={0.65}
        initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 1.3 }}>
        제약 행 1개 추가 · 안전
      </motion.text>
    </svg>
  );
}

// ───────────────────────────── Panel 2: <--  (assign only, danger)

function AssignOnlyPanel() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.rect x={20} y={14} width={440} height={28} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${COLORS.assignOnly}14`} stroke={COLORS.assignOnly} strokeWidth={1.2} />
      <text x={240} y={33} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fontWeight={700} fill={COLORS.assignOnly}>
        c {'<--'} a * b     // 대입만, 제약 없음
      </text>

      {/* Variable assign area — populated */}
      <text x={30} y={64} fontSize={10} fontWeight={700} fill={COLORS.muted}>변수 대입 영역</text>
      <motion.rect x={20} y={72} width={200} height={130} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill="#ffffff06" stroke={COLORS.muted} strokeWidth={0.8} strokeDasharray="3 2" />

      {[
        { k: 'a', v: '3', delay: 0.2 },
        { k: 'b', v: '7', delay: 0.3 },
        { k: 'c', v: '21 (?)', delay: 0.6, warn: true },
      ].map((row, i) => (
        <g key={row.k}>
          <motion.rect x={32} y={84 + i * 38} width={176} height={28} rx={5}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: row.delay }}
            fill={row.warn ? `${COLORS.assignOnly}22` : '#ffffff08'}
            stroke={row.warn ? COLORS.assignOnly : `${COLORS.muted}80`}
            strokeWidth={row.warn ? 1.4 : 0.8} />
          <text x={46} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={row.warn ? COLORS.assignOnly : COLORS.muted}>{row.k}</text>
          <text x={72} y={103 + i * 38} fontSize={10} fontFamily="monospace"
            fill={COLORS.muted}>=</text>
          <text x={90} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={row.warn ? COLORS.assignOnly : COLORS.muted}>{row.v}</text>
          {row.warn && (
            <motion.text x={200} y={103 + i * 38} textAnchor="end" fontSize={9}
              fontFamily="monospace" fill={COLORS.assignOnly}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}>← 검증X</motion.text>
          )}
        </g>
      ))}

      {/* R1CS table — empty */}
      <text x={240} y={64} fontSize={10} fontWeight={700} fill={COLORS.danger}>R1CS 제약 테이블</text>
      <motion.rect x={240} y={72} width={220} height={130} rx={8}
        animate={{ x: [240, 241.5, 240, 238.5, 240] }}
        transition={{ duration: 0.35, repeat: 3, delay: 1.0 }}
        fill={`${COLORS.danger}08`} stroke={COLORS.danger} strokeWidth={1.2} strokeDasharray="4 3" />

      {['A', 'B', 'C'].map((col, i) => (
        <text key={col} x={272 + i * 60} y={92} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={COLORS.danger} opacity={0.7}>{col}</text>
      ))}
      <line x1={250} y1={98} x2={450} y2={98} stroke={COLORS.danger} strokeWidth={0.5} opacity={0.4} />

      <motion.text x={350} y={130} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={COLORS.danger}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        (비어있음)
      </motion.text>
      <motion.text x={350} y={154} textAnchor="middle" fontSize={9}
        fill={COLORS.danger} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.0 }}>
        제약 없음 — 증명자는
      </motion.text>
      <motion.text x={350} y={170} textAnchor="middle" fontSize={9}
        fill={COLORS.danger} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.1 }}>
        c=999도 주장 가능!
      </motion.text>
      <motion.text x={350} y={190} textAnchor="middle" fontSize={12}
        fontWeight={700} fill={COLORS.danger}
        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}>
        ⚠ 위험
      </motion.text>
    </svg>
  );
}

// ───────────────────────────── Panel 3: ===  (constrain only)

function ConstrainOnlyPanel() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.rect x={20} y={14} width={440} height={28} rx={6}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${COLORS.constrainOnly}14`} stroke={COLORS.constrainOnly} strokeWidth={1.2} />
      <text x={240} y={33} textAnchor="middle" fontSize={12} fontFamily="monospace"
        fontWeight={700} fill={COLORS.constrainOnly}>
        c {'==='} a * b     // 제약만 (c는 이미 대입됨)
      </text>

      {/* Variable area — pre-populated (grey) */}
      <text x={30} y={64} fontSize={10} fontWeight={700} fill={COLORS.muted}>변수 대입 영역 (기존 상태)</text>
      <motion.rect x={20} y={72} width={200} height={130} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill="#ffffff06" stroke={COLORS.muted} strokeWidth={0.8} strokeDasharray="3 2" />

      {[
        { k: 'a', v: '3' },
        { k: 'b', v: '7' },
        { k: 'c', v: '21' },
      ].map((row, i) => (
        <g key={row.k}>
          <rect x={32} y={84 + i * 38} width={176} height={28} rx={5}
            fill="#ffffff08" stroke={`${COLORS.muted}80`} strokeWidth={0.8} />
          <text x={46} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={COLORS.muted}>{row.k}</text>
          <text x={72} y={103 + i * 38} fontSize={10} fontFamily="monospace"
            fill={COLORS.muted}>=</text>
          <text x={90} y={103 + i * 38} fontSize={11} fontFamily="monospace"
            fontWeight={700} fill={COLORS.muted}>{row.v}</text>
        </g>
      ))}
      <motion.text x={120} y={198} textAnchor="middle" fontSize={8}
        fill={COLORS.muted} opacity={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.2 }}>
        대입은 변하지 않음
      </motion.text>

      {/* R1CS table — new row appended */}
      <text x={240} y={64} fontSize={10} fontWeight={700} fill={COLORS.constrainOnly}>R1CS 제약 테이블</text>
      <motion.rect x={240} y={72} width={220} height={130} rx={8}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${COLORS.constrainOnly}0c`} stroke={COLORS.constrainOnly} strokeWidth={1} />

      {['A', 'B', 'C'].map((col, i) => (
        <text key={col} x={272 + i * 60} y={92} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={COLORS.constrainOnly}>{col}</text>
      ))}
      <line x1={250} y1={98} x2={450} y2={98} stroke={COLORS.constrainOnly} strokeWidth={0.6} opacity={0.5} />

      {/* previous row (faded) */}
      <g opacity={0.35}>
        {['[·]', '[·]', '[·]'].map((cell, i) => (
          <g key={i}>
            <rect x={252 + i * 60} y={104} width={40} height={20} rx={3}
              fill={`${COLORS.constrainOnly}14`} stroke={COLORS.constrainOnly} strokeWidth={0.6} />
            <text x={272 + i * 60} y={118} textAnchor="middle" fontSize={9}
              fontFamily="monospace" fill={COLORS.constrainOnly}>{cell}</text>
          </g>
        ))}
      </g>

      {/* new row highlighted */}
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        {['[a]', '[b]', '[c]'].map((cell, i) => (
          <g key={i}>
            <rect x={252 + i * 60} y={130} width={40} height={22} rx={4}
              fill={`${COLORS.constrainOnly}26`} stroke={COLORS.constrainOnly} strokeWidth={1.2} />
            <text x={272 + i * 60} y={145} textAnchor="middle" fontSize={10}
              fontFamily="monospace" fontWeight={700} fill={COLORS.constrainOnly}>{cell}</text>
          </g>
        ))}
      </motion.g>

      <motion.text x={350} y={170} textAnchor="middle" fontSize={9}
        fontFamily="monospace" fill={COLORS.constrainOnly} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.9 }}>
        새 제약 한 행 추가
      </motion.text>
      <motion.text x={350} y={188} textAnchor="middle" fontSize={8}
        fill={COLORS.constrainOnly} opacity={0.65}
        initial={{ opacity: 0 }} animate={{ opacity: 0.65 }} transition={{ delay: 1.0 }}>
        witness는 수정 없음 · 검증 강화
      </motion.text>
    </svg>
  );
}

// ───────────────────────────── Panel 4: anti-pattern vs correct

function AntiPatternPanel() {
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Left: BAD */}
      <motion.rect x={16} y={16} width={214} height={188} rx={10}
        animate={{
          x: [16, 17.5, 16, 14.5, 16],
          stroke: [COLORS.danger, '#fca5a5', COLORS.danger],
        }}
        transition={{ x: { duration: 0.4, repeat: 4, delay: 0.3 },
          stroke: { duration: 1.2, repeat: Infinity } }}
        fill={`${COLORS.danger}0c`} strokeWidth={1.6} />
      <text x={123} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.danger}>
        잘못된 사용
      </text>
      <text x={123} y={50} textAnchor="middle" fontSize={9} fill={COLORS.danger} opacity={0.7}>
        제약 없음
      </text>

      <rect x={28} y={62} width={190} height={30} rx={5}
        fill={`${COLORS.danger}14`} stroke={COLORS.danger} strokeWidth={0.8} />
      <text x={123} y={82} textAnchor="middle" fontSize={11} fontFamily="monospace"
        fontWeight={700} fill={COLORS.danger}>
        out {'<--'} in / 2;
      </text>

      {/* Attacker icon */}
      <motion.g
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <text x={38} y={118} fontSize={10} fontWeight={700} fill={COLORS.danger}>공격자:</text>
        <rect x={28} y={125} width={190} height={22} rx={4}
          fill={`${COLORS.danger}18`} stroke={COLORS.danger} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={123} y={140} textAnchor="middle" fontSize={10} fontFamily="monospace"
          fontWeight={700} fill={COLORS.danger}>
          out := 999 ← 임의값
        </text>
      </motion.g>

      <motion.text x={123} y={166} textAnchor="middle" fontSize={9}
        fill={COLORS.danger} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.0 }}>
        검증 통과 — witness 위조
      </motion.text>

      <motion.text x={123} y={192} textAnchor="middle" fontSize={18} fontWeight={700}
        fill={COLORS.danger}
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}>
        ✕
      </motion.text>

      {/* Right: GOOD */}
      <motion.rect x={250} y={16} width={214} height={188} rx={10}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        fill={`${COLORS.safe}0c`} stroke={COLORS.safe} strokeWidth={1.4} />
      <text x={357} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.safe}>
        올바른 사용
      </text>
      <text x={357} y={50} textAnchor="middle" fontSize={9} fill={COLORS.safe} opacity={0.75}>
        대입 + 제약 분리
      </text>

      <motion.rect x={262} y={62} width={190} height={30} rx={5}
        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        fill={`${COLORS.assignOnly}16`} stroke={COLORS.assignOnly} strokeWidth={0.8} />
      <text x={357} y={82} textAnchor="middle" fontSize={11} fontFamily="monospace"
        fontWeight={700} fill={COLORS.assignOnly}>
        out {'<--'} in / 2;
      </text>

      <motion.rect x={262} y={98} width={190} height={30} rx={5}
        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55 }}
        fill={`${COLORS.constrainOnly}16`} stroke={COLORS.constrainOnly} strokeWidth={0.8} />
      <text x={357} y={118} textAnchor="middle" fontSize={11} fontFamily="monospace"
        fontWeight={700} fill={COLORS.constrainOnly}>
        in {'==='} out * 2;
      </text>

      <motion.text x={357} y={146} textAnchor="middle" fontSize={9}
        fill={COLORS.safe} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 0.85 }}>
        witness out = in/2 주입
      </motion.text>
      <motion.text x={357} y={162} textAnchor="middle" fontSize={9}
        fill={COLORS.safe} opacity={0.9}
        initial={{ opacity: 0 }} animate={{ opacity: 0.9 }} transition={{ delay: 1.0 }}>
        제약이 out·2 = in 강제
      </motion.text>

      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: 'spring' }}>
        <circle cx={357} cy={186} r={12} fill={`${COLORS.safe}22`}
          stroke={COLORS.safe} strokeWidth={1.4} />
        <path d="M 351 186 L 355 190 L 363 182" fill="none"
          stroke={COLORS.safe} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </svg>
  );
}

export default function AssignmentOperatorsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        if (step === 0) return <ConstrainAssignPanel />;
        if (step === 1) return <AssignOnlyPanel />;
        if (step === 2) return <ConstrainOnlyPanel />;
        return <AntiPatternPanel />;
      }}
    </StepViz>
  );
}
