import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import HADESRoundViz from './HADESRoundViz';

const C1 = '#6366f1', C2 = '#f59e0b', C3 = '#10b981';

const STEPS = [
  { label: 'HADES 라운드 배치', body: 'RF/2 full → RP partial → RF/2 full 순서.\nBN254: 4 + 57 + 4 = 65 라운드.' },
  { label: 'Full Round 내부 과정', body: '모든 T개 원소에 AddRC → S-box → MDS.\n전체 비선형성으로 차분·통계적 공격 방어.' },
  { label: 'Partial Round 내부 과정', body: '첫 번째 원소에만 S-box, 나머지는 통과.\n대수적 공격 방어하면서 제약 수 1/3로 절감.' },
  { label: '제약 수 비교', body: 'HADES: 8×9 + 57×3 = 243 제약.\n전부 Full이면: 65×9 = 585 → 58% 절감.' },
];

/* Step 0: layout overview */
function LayoutOverview() {
  const y = 45, h = 44;
  const sections = [
    { label: 'Full Round', sub: 'RF/2 = 4', color: C1, w: 80, x: 30 },
    { label: 'Partial Round', sub: 'RP = 57', color: C2, w: 180, x: 132 },
    { label: 'Full Round', sub: 'RF/2 = 4', color: C1, w: 80, x: 334 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={222} y={26} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">BN254: 65 라운드 배치</text>
      {sections.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={s.x} y={y} width={s.w} height={h} rx={6}
            fill={`${s.color}10`} stroke={s.color} strokeWidth={1.2} />
          <text x={s.x + s.w / 2} y={y + 20} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={s.color}>{s.label}</text>
          <text x={s.x + s.w / 2} y={y + 36} textAnchor="middle"
            fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
          {i < 2 && (
            <line x1={s.x + s.w + 4} y1={y + h / 2} x2={sections[i + 1].x - 4} y2={y + h / 2}
              stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#hd-a)" />
          )}
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.4 }}>
        <text x={70} y={y + h + 18} textAnchor="middle" fontSize={9} fill={C1}>모든 원소 S-box</text>
        <text x={222} y={y + h + 18} textAnchor="middle" fontSize={9} fill={C2}>첫 원소만 S-box</text>
        <text x={374} y={y + h + 18} textAnchor="middle" fontSize={9} fill={C1}>모든 원소 S-box</text>
      </motion.g>
      <defs>
        <marker id="hd-a" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="var(--muted-foreground)" opacity={0.5} />
        </marker>
      </defs>
    </motion.g>
  );
}

/* Step 3: constraint comparison */
function ConstraintBars() {
  const y = 30, maxW = 280, hadesW = (243 / 585) * maxW;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={210} y={20} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">제약 수 비교 (BN254)</text>
      <text x={40} y={y + 14} fontSize={9} fill="var(--muted-foreground)">전부 Full</text>
      <motion.rect x={40} y={y + 22} width={maxW} height={28} rx={5}
        fill="#ef444412" stroke="#ef4444" strokeWidth={1}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformOrigin: '40px 0' }} />
      <text x={40 + maxW / 2} y={y + 40} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#ef4444">585 제약 (65 × 9)</text>

      <text x={40} y={y + 68} fontSize={9} fill={C3}>HADES</text>
      <motion.rect x={40} y={y + 76} width={hadesW} height={28} rx={5}
        fill={`${C3}15`} stroke={C3} strokeWidth={1}
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 0.2 }} style={{ transformOrigin: '40px 0' }} />
      <text x={40 + hadesW / 2} y={y + 94} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={C3}>243 제약 (8×9 + 57×3)</text>

      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}>
        <rect x={250} y={y + 76} width={80} height={28} rx={14}
          fill={`${C3}18`} stroke={C3} strokeWidth={1} />
        <text x={290} y={y + 94} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C3}>58% 절감</text>
      </motion.g>
    </motion.g>
  );
}

export default function HADESViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 1 || step === 2 ? '0 0 420 270' : '0 0 444 140'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <LayoutOverview />}
          {step === 1 && <HADESRoundViz mode="full" />}
          {step === 2 && <HADESRoundViz mode="partial" />}
          {step === 3 && <ConstraintBars />}
        </svg>
      )}
    </StepViz>
  );
}
