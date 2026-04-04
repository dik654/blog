import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '보안 전략 개요', body: 'Full round → 차분·통계 방어. Partial round → 대수·보간 방어.' },
  { label: 'Poseidon S-box', body: 'x→x⁵. 빠르고 제약 적음 (~250). ZK 생태계 표준.' },
  { label: 'Rescue S-box', body: 'x^α ↔ x^{1/α} 교대. 역방향 지수 커서 네이티브 느림. ~500 제약.' },
];

/* ── Step 0: security strategy ── */
function SecurityStrategy() {
  const attacks = [
    { name: '차분 공격', defender: 'Full Round', color: C1, desc: '입력 차분 → 출력 차분 추적' },
    { name: '통계적 공격', defender: 'Full Round', color: C1, desc: '출력 분포 편향 분석' },
    { name: '대수적 공격', defender: 'Partial Round', color: C3, desc: '연립방정식으로 키 복원' },
    { name: '보간 공격', defender: 'Partial Round', color: C3, desc: '다항식 보간으로 역산' },
  ];

  const x0 = 30, colW = [120, 110, 200];

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">공격 유형별 방어 전략</text>

      {/* headers */}
      <text x={x0} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">공격 유형</text>
      <text x={x0 + colW[0]} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">방어 라운드</text>
      <text x={x0 + colW[0] + colW[1]} y={42} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">원리</text>
      <line x1={x0} y1={48} x2={x0 + colW[0] + colW[1] + colW[2]}
        y2={48} stroke="var(--border)" strokeWidth={0.5} />

      {attacks.map((a, i) => {
        const y = 66 + i * 30;
        return (
          <motion.g key={a.name} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <text x={x0} y={y} fontSize={9} fontWeight={500}
              fill="var(--foreground)">{a.name}</text>
            <rect x={x0 + colW[0]} y={y - 12} width={90} height={18} rx={9}
              fill={`${a.color}12`} stroke={a.color} strokeWidth={0.7} />
            <text x={x0 + colW[0] + 45} y={y} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={a.color}>{a.defender}</text>
            <text x={x0 + colW[0] + colW[1]} y={y}
              fontSize={9} fill="var(--muted-foreground)">{a.desc}</text>
          </motion.g>
        );
      })}
    </motion.g>
  );
}

/* ── Step 1: Poseidon detail with computation ── */
function PoseidonDetail() {
  const y0 = 30;
  const chain = [
    { val: 'x', w: 36 }, { val: 'x²', w: 36 }, { val: 'x⁴', w: 36 }, { val: 'x⁵', w: 36 },
  ];
  const cx = 50, gap = 56;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C2}>
        Poseidon S-box: x → x⁵ (한 방향)
      </text>

      {/* computation chain */}
      {chain.map((c, i) => {
        const x = cx + i * (c.w + gap);
        const isLast = i === chain.length - 1;
        return (
          <g key={i}>
            {i > 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}>
                <line x1={x - gap + 4} y1={y0 + 14} x2={x - 4} y2={y0 + 14}
                  stroke={C2} strokeWidth={0.6} markerEnd="url(#sec-arr)" />
                <text x={x - gap / 2} y={y0 + 8} textAnchor="middle"
                  fontSize={9} fill={C2}>MUL</text>
              </motion.g>
            )}
            <motion.rect x={x} y={y0} width={c.w} height={28} rx={5}
              fill={isLast ? `${C2}15` : 'transparent'}
              stroke={isLast ? C2 : 'var(--border)'} strokeWidth={isLast ? 1.2 : 0.6}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} />
            <text x={x + c.w / 2} y={y0 + 18} textAnchor="middle"
              fontSize={10} fontWeight={600} fill={isLast ? C2 : 'var(--foreground)'}>{c.val}</text>
          </g>
        );
      })}

      {/* cost badge */}
      <motion.rect x={cx + 3 * (36 + gap) + 50} y={y0 - 2} width={90} height={32} rx={6}
        fill={`${C2}10`} stroke={C2} strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
      <text x={cx + 3 * (36 + gap) + 95} y={y0 + 12} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={C2}>곱셈 3회</text>
      <text x={cx + 3 * (36 + gap) + 95} y={y0 + 24} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">= R1CS 3제약</text>

      {/* specs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.4 }}>
        {[
          { label: 'R1CS 제약', val: '~250', x: 50 },
          { label: '네이티브 속도', val: '빠름 (지수 5)', x: 180 },
          { label: '생태계', val: 'Filecoin · Mina · Zcash', x: 330 },
        ].map((s) => (
          <g key={s.label}>
            <text x={s.x} y={y0 + 52} fontSize={9} fontWeight={500}
              fill="var(--muted-foreground)">{s.label}</text>
            <text x={s.x} y={y0 + 68} fontSize={9} fontWeight={600} fill={C2}>{s.val}</text>
          </g>
        ))}
      </motion.g>

      <defs>
        <marker id="sec-arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C2} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* ── Step 2: Rescue detail with alternating chain ── */
function RescueDetail() {
  const y0 = 28;
  /* 교대 S-box 과정 시각화 */
  const chain = [
    { val: 'x', op: '', color: 'var(--foreground)' },
    { val: 'x^α', op: '정방향', color: C3 },
    { val: 'x^(1/α)', op: '역방향', color: C1 },
    { val: 'x^α', op: '정방향', color: C3 },
  ];
  const cx = 30, gap = 58, w = 52;

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>
        Rescue S-box: x^α ↔ x^(1/α) 교대 적용
      </text>

      {/* alternating chain */}
      {chain.map((c, i) => {
        const x = cx + i * (w + gap);
        return (
          <g key={i}>
            {i > 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.12 }}>
                <line x1={x - gap + 4} y1={y0 + 14} x2={x - 4} y2={y0 + 14}
                  stroke={c.color} strokeWidth={0.6} markerEnd={`url(#sec-arr-${i % 2})`} />
                <rect x={x - gap / 2 - 16} y={y0} width={32} height={14} rx={3}
                  fill="var(--background)" />
                <text x={x - gap / 2} y={y0 + 10} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={c.color}>{c.op}</text>
              </motion.g>
            )}
            <motion.rect x={x} y={y0} width={w} height={28} rx={5}
              fill={i === 0 ? 'transparent' : `${c.color}12`}
              stroke={i === 0 ? 'var(--border)' : c.color}
              strokeWidth={i === 0 ? 0.6 : 0.8}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }} />
            <text x={x + w / 2} y={y0 + 18} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={c.color}>{c.val}</text>
          </g>
        );
      })}

      {/* problem: 역방향 지수 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={y0 + 42} width={420} height={36} rx={6}
          fill="#ef444406" stroke="#ef4444" strokeWidth={0.5} />
        <text x={40} y={y0 + 56} fontSize={9} fontWeight={600} fill="#ef4444">
          문제: 역방향 x^(1/α)
        </text>
        <text x={40} y={y0 + 72} fontSize={9} fill="var(--muted-foreground)">
          BN254에서 1/α ≈ 10¹⁷ → 역 S-box 네이티브 연산 극도로 느림
        </text>
        <text x={300} y={y0 + 56} fontSize={9} fontWeight={600} fill="#ef4444">
          결과: ~500 R1CS 제약 (Poseidon의 2배)
        </text>
      </motion.g>

      {/* specs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.5 }}>
        {[
          { label: 'R1CS 제약', val: '~500 (2×)', x: 50 },
          { label: '네이티브 속도', val: '느림 (지수 ~10¹⁷)', x: 190 },
          { label: '생태계', val: '학술적 대안', x: 360 },
        ].map((s) => (
          <g key={s.label}>
            <text x={s.x} y={y0 + 98} fontSize={9} fontWeight={500}
              fill="var(--muted-foreground)">{s.label}</text>
            <text x={s.x} y={y0 + 114} fontSize={9} fontWeight={600} fill={C3}>{s.val}</text>
          </g>
        ))}
      </motion.g>

      <defs>
        <marker id="sec-arr-0" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C1} opacity={0.6} />
        </marker>
        <marker id="sec-arr-1" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={C3} opacity={0.6} />
        </marker>
      </defs>
    </motion.g>
  );
}

export default function SecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 2 ? '0 0 480 170' : step === 0 ? '0 0 480 190' : '0 0 480 130'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SecurityStrategy />}
          {step === 1 && <PoseidonDetail />}
          {step === 2 && <RescueDetail />}
        </svg>
      )}
    </StepViz>
  );
}
