import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS } from './FewShotData';
import { BarChart, GoodBadCompare, RecencyBias } from './FewShotParts';

const W = 460, H = 220;
const PRINCIPLES = [
  { label: '다양성', desc: '2+ 카테고리', color: '#6366f1' },
  { label: '엣지케이스', desc: '비정상 1개+', color: '#10b981' },
  { label: '순서', desc: '대표→마지막', color: '#f59e0b' },
  { label: '최소 충분', desc: '3개면 충분', color: '#6366f1' },
];

export default function FewShotViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <BarChart />}
          {step === 1 && <GoodBadCompare />}
          {step === 2 && <RecencyBias cx={W / 2} />}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {PRINCIPLES.map((p, i) => {
                const y = 25 + i * 45;
                return (
                  <motion.g key={p.label}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}>
                    <rect x={80} y={y} width={300} height={34} rx={5}
                      fill={`${p.color}12`} stroke={p.color} strokeWidth={1} />
                    <rect x={80} y={y} width={4} height={34} rx={2} fill={p.color} />
                    <text x={100} y={y + 21} fontSize={10}
                      fontWeight={700} fill={p.color}>{p.label}</text>
                    <text x={370} y={y + 21} textAnchor="end" fontSize={9}
                      fill="var(--muted-foreground)">{p.desc}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
