import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#ef4444';

const STEPS = [
  { label: 'Schwartz-Zippel 보조정리', body: 'P(x) ≠ 0이고 deg(P)=d이면, 랜덤 r에서 P(r)=0일 확률 ≤ d/|F|.' },
  { label: 'degree 3 다항식, |F|=97', body: '영점(zero)은 최대 3개. 97개 원소 중 3개 — 확률 ≤ 3/97 ≈ 3%.' },
  { label: 'ZKP 적용: 다항식 동치', body: 'f(x)=g(x)인지 → 랜덤 r에서 f(r)=g(r) 확인. 다르면 높은 확률로 탐지.' },
];

// Visualize: polynomial with zeros marked on a number line
const FIELD_SIZE = 97;
const ZEROS = [12, 45, 78]; // 3 zeros of a degree-3 polynomial

export default function SchwartzZippelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 360 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Number line */}
          <line x1={30} y1={50} x2={330} y2={50} stroke="var(--border)" strokeWidth={0.5} />
          <text x={30} y={65} fontSize={9} fill="var(--muted-foreground)">0</text>
          <text x={327} y={65} fontSize={9} textAnchor="end" fill="var(--muted-foreground)">96</text>
          <text x={180} y={78} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            F₉₇ = {'{'} 0, 1, …, 96 {'}'}
          </text>

          {/* Field element ticks */}
          {step >= 1 && Array.from({ length: 20 }, (_, i) => {
            const val = Math.round(i * (FIELD_SIZE - 1) / 19);
            const x = 30 + (val / (FIELD_SIZE - 1)) * 300;
            return (
              <motion.line key={i} x1={x} y1={47} x2={x} y2={53}
                stroke="var(--border)" strokeWidth={0.3}
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} />
            );
          })}

          {/* Zeros */}
          {step >= 1 && ZEROS.map((z, i) => {
            const x = 30 + (z / (FIELD_SIZE - 1)) * 300;
            return (
              <motion.g key={z} initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <circle cx={x} cy={50} r={4} fill={C3} opacity={0.8} />
                <text x={x} y={42} textAnchor="middle" fontSize={9} fill={C3}>{z}</text>
              </motion.g>
            );
          })}

          {/* Random query point */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <circle cx={30 + (60 / 96) * 300} cy={50} r={4} fill={C2} />
              <text x={30 + (60 / 96) * 300} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C2}>
                r=60
              </text>
              <text x={30 + (60 / 96) * 300} y={30} textAnchor="middle" fontSize={9} fill={C2}>
                P(60) ≠ 0 ✓
              </text>
            </motion.g>
          )}

          {/* Probability label */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={230} y={8} width={110} height={28} rx={5} fill={`${C1}08`} stroke={C1} strokeWidth={0.5} />
              <text x={285} y={22} textAnchor="middle" fontSize={9} fontWeight={500} fill={C1}>
                Pr[P(r)=0] ≤ 3/97
              </text>
              <text x={285} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ≈ 3.1%
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
