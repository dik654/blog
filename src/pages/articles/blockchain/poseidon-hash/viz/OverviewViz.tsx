import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import OverviewSPNViz from './OverviewSPNViz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'SHA-256 vs Poseidon', body: 'SHA-256: ~25,000 제약. Poseidon: ~250 제약. 100배 효율.' },
  { label: 'SPN 라운드 내부 과정', body: 'AddRC → S-box(x⁵) → MDS 행렬 확산. 매 라운드 3단계.' },
  { label: 'HADES 전략', body: 'Full round(모든 원소 S-box) + Partial round(첫 원소만 S-box).\n보안 유지 + 제약 수 58% 절감.' },
];

/* Step 0: comparison bars */
function ComparisonBars() {
  const barY = 50, barH = 28;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={40} y={barY - 8} fontSize={9} fontWeight={600} fill="#ef4444">SHA-256</text>
      <rect x={40} y={barY} width={260} height={barH} rx={5}
        fill="#ef444412" stroke="#ef4444" strokeWidth={1} />
      <text x={170} y={barY + barH / 2 + 4} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#ef4444">~25,000 R1CS 제약</text>

      <text x={40} y={barY + barH + 30} fontSize={9} fontWeight={600} fill={C2}>Poseidon</text>
      <rect x={40} y={barY + barH + 38} width={28} height={barH} rx={5}
        fill={`${C2}15`} stroke={C2} strokeWidth={1} />
      <text x={80} y={barY + barH + 38 + barH / 2 + 4}
        fontSize={9} fontWeight={600} fill={C2}>~250 제약</text>

      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}>
        <rect x={240} y={barY + barH + 34} width={66} height={24} rx={12}
          fill={`${C2}18`} stroke={C2} strokeWidth={1} />
        <text x={273} y={barY + barH + 50} textAnchor="middle"
          fontSize={10} fontWeight={700} fill={C2}>100× 효율</text>
      </motion.g>

      <text x={40} y={barY + barH * 2 + 68} fontSize={9}
        fill="var(--muted-foreground)">비트 연산 (XOR, 회전, 시프트)</text>
      <text x={220} y={barY + barH * 2 + 68} fontSize={9}
        fill="var(--muted-foreground)">vs</text>
      <text x={245} y={barY + barH * 2 + 68} fontSize={9} fill={C2}>
        체 산술 (add, mul, pow)</text>
    </motion.g>
  );
}

/* Step 2: HADES — Full vs Partial 병렬 비교 */
function HADESOverview() {
  const cw = 44, ch = 24, gap = 6;
  const labels = ['s₀', 's₁', 's₂'];

  function MiniRound({ x0, y0, title, color, sboxFlags }: {
    x0: number; y0: number; title: string; color: string; sboxFlags: boolean[];
  }) {
    return (
      <g>
        <text x={x0 + (3 * (cw + gap)) / 2 - gap / 2} y={y0 - 4} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={color}>{title}</text>
        {/* input row */}
        {labels.map((l, i) => (
          <g key={`in-${i}`}>
            <rect x={x0 + i * (cw + gap)} y={y0} width={cw} height={ch} rx={4}
              fill="transparent" stroke="var(--border)" strokeWidth={0.5} />
            <text x={x0 + i * (cw + gap) + cw / 2} y={y0 + ch / 2 + 4} textAnchor="middle"
              fontSize={9} fill="var(--foreground)">{l}</text>
          </g>
        ))}
        {/* arrows */}
        {labels.map((_, i) => (
          <line key={`a-${i}`}
            x1={x0 + i * (cw + gap) + cw / 2} y1={y0 + ch + 2}
            x2={x0 + i * (cw + gap) + cw / 2} y2={y0 + ch + 14}
            stroke="var(--muted-foreground)" strokeWidth={0.5} />
        ))}
        {/* S-box row */}
        {labels.map((_, i) => {
          const active = sboxFlags[i];
          return (
            <g key={`sb-${i}`}>
              <rect x={x0 + i * (cw + gap)} y={y0 + ch + 16} width={cw} height={ch} rx={4}
                fill={active ? `${color}15` : 'transparent'}
                stroke={active ? color : 'var(--border)'}
                strokeWidth={active ? 1 : 0.5}
                strokeDasharray={active ? 'none' : '3 2'} />
              <text x={x0 + i * (cw + gap) + cw / 2} y={y0 + ch + 16 + ch / 2 + 4}
                textAnchor="middle" fontSize={active ? 9 : 7}
                fontWeight={active ? 700 : 400}
                fill={active ? color : 'var(--muted-foreground)'}>
                {active ? 'x⁵' : '통과'}
              </text>
            </g>
          );
        })}
        {/* constraint count */}
        <rect x={x0} y={y0 + 2 * ch + 24} width={3 * cw + 2 * gap} height={18} rx={9}
          fill={`${color}10`} stroke={color} strokeWidth={0.6} />
        <text x={x0 + (3 * (cw + gap)) / 2 - gap / 2} y={y0 + 2 * ch + 37}
          textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>
          {sboxFlags.every(Boolean) ? 'S-box 3개 → 9 제약/라운드' : 'S-box 1개 → 3 제약/라운드'}
        </text>
      </g>
    );
  }

  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={230} y={20} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">HADES: Full vs Partial Round (T=3)</text>

      {/* Full Round */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}>
        <MiniRound x0={30} y0={42} title="Full Round (RF=8)"
          color={C1} sboxFlags={[true, true, true]} />
      </motion.g>

      {/* vs 구분선 */}
      <line x1={220} y1={36} x2={220} y2={130} stroke="var(--border)"
        strokeWidth={0.5} strokeDasharray="4 2" />
      <text x={220} y={85} textAnchor="middle" fontSize={9} fontWeight={600}
        fill="var(--muted-foreground)">vs</text>

      {/* Partial Round */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}>
        <MiniRound x0={250} y0={42} title="Partial Round (RP=57)"
          color={C3} sboxFlags={[true, false, false]} />
      </motion.g>

      {/* 전체 배치 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={230} y={148} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">배치: 4 full → 57 partial → 4 full = 65 라운드</text>
        <rect x={120} y={156} width={220} height={20} rx={10}
          fill={`${C2}12`} stroke={C2} strokeWidth={0.8} />
        <text x={230} y={170} textAnchor="middle" fontSize={9} fontWeight={600} fill={C2}>
          8×9 + 57×3 = 243 제약 (전부 Full이면 585 → 58% 절감)
        </text>
      </motion.g>
    </motion.g>
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={step === 1 ? '0 0 480 270' : step === 2 ? '0 0 460 190' : '0 0 420 190'}
          className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <ComparisonBars />}
          {step === 1 && <OverviewSPNViz />}
          {step === 2 && <HADESOverview />}
        </svg>
      )}
    </StepViz>
  );
}
