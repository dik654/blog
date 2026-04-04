import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '깨끗한 이미지 x₀' }, { label: 'Forward: 노이즈 주입' },
  { label: '순수 노이즈 x_T' }, { label: 'Reverse: UNet 디노이징' },
  { label: '이미지 복원 완료' },
];
const BODY = [
  '원본, 노이즈 0%', 'β₁=0.0001→β_T=0.02 누적',
  'α̅_T≈0, 순수 N(0,I)', 'ε_θ 예측 → x₀ 복원',
  'Forward(학습)→Reverse(추론)',
];
const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
const DOTS = [3, 12, 30, 60, 100]; // noise density per step

function NoisyRect({ x, y, density, color, lit }: { x: number; y: number; density: number; color: string; lit: boolean }) {
  const seed = x * 7 + y * 13;
  return (
    <g>
      <motion.rect x={x} y={y} width={48} height={40} rx={4}
        animate={{ stroke: color, strokeWidth: lit ? 2 : 1, fill: `${color}12` }} />
      {Array.from({ length: density }, (_, i) => (
        <motion.circle key={i} r={0.8}
          cx={x + 4 + ((seed + i * 37) % 40)} cy={y + 4 + ((seed + i * 23) % 32)}
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          transition={{ delay: i * 0.008 }} fill={color} />
      ))}
    </g>
  );
}

export default function DiffusionProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={190} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Forward Process (q)</text>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 10 + i * 72;
            const fwdLit = step === 0 ? i === 0 : step === 1 ? i <= 3 : step === 2 ? i === 4 : false;
            const alphaBar = ['1.000', '0.999', '0.500', '0.050', '0.001'];
            return (
              <g key={`f${i}`}>
                <NoisyRect x={x} y={18} density={DOTS[i]} color={COLORS[i]} lit={fwdLit} />
                <text x={x + 24} y={68} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {['x₀', 'x₁', 'x_T/2', 'x_(T-1)', 'x_T'][i]}
                </text>
                {step >= 1 && (
                  <text x={x + 24} y={77} textAnchor="middle" fontSize={7} fill={COLORS[i]} fillOpacity={0.7}>
                    α̅={alphaBar[i]}
                  </text>
                )}
                {i < 4 && <text x={x + 60} y={42} fontSize={10} fill="var(--muted-foreground)">→</text>}
              </g>
            );
          })}
          <text x={190} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">Reverse Process (p_θ)</text>
          {[0, 1, 2, 3, 4].map((i) => {
            const ri = 4 - i;
            const x = 10 + i * 72;
            const revLit = step === 3 ? ri <= 3 : step === 4 ? ri === 0 : false;
            return (
              <g key={`r${i}`}>
                <NoisyRect x={x} y={94} density={DOTS[ri]} color={COLORS[ri]} lit={revLit} />
                <text x={x + 24} y={144} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {['x_T', 'x_(T-1)', 'x_T/2', 'x₁', 'x₀'][i]}
                </text>
                {i < 4 && (
                  <text x={x + 60} y={118} fontSize={10} fill="var(--muted-foreground)">→</text>
                )}
                {step >= 3 && i < 4 && (
                  <motion.text x={x + 60} y={106} textAnchor="middle" fontSize={9}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} fill="#ef4444">UNet</motion.text>
                )}
              </g>
            );
          })}
          {/* inline body */}
          <motion.text x={390} y={75} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
