import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '재구성 손실: MSE(x, x̂)' },
  { label: 'KL Divergence: q(z|x)를 N(0,1)에 맞추기' },
  { label: '총 손실 = 재구성 + KL → 역전파' },
];

const C = { mse: '#3b82f6', kl: '#f59e0b', total: '#ef4444' };

const mseData = [
  { label: 'x₁', x: 0.80, xh: 0.73, diff: 0.0049 },
  { label: 'x₂', x: 0.40, xh: 0.45, diff: 0.0025 },
  { label: 'x₃', x: 0.60, xh: 0.52, diff: 0.0064 },
];

export default function VAELossViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* MSE section */}
          <motion.rect x={10} y={8} width={170} height={104} rx={6}
            fill={step === 0 ? C.mse + '0a' : C.mse + '04'} stroke={C.mse}
            animate={{ strokeWidth: step === 0 ? 1.5 : 0.5 }} />
          <text x={95} y={22} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mse}>재구성 손실 (MSE)</text>

          {mseData.map((d, i) => {
            const barW = d.diff * 1200;
            return (
              <g key={i}>
                <text x={20} y={42 + i * 22} fontSize={9} fill="var(--foreground)">{d.label}</text>
                <text x={40} y={42 + i * 22} fontSize={9} fill="var(--muted-foreground)">
                  ({d.x}-{d.xh})²
                </text>
                <motion.rect x={100} y={34 + i * 22} width={barW} height={10} rx={2}
                  fill={C.mse + '40'} animate={{ width: step >= 0 ? barW : 0 }}
                  transition={{ delay: i * 0.1 }} />
                <text x={100 + barW + 4} y={43 + i * 22} fontSize={9} fill={C.mse}>{d.diff.toFixed(4)}</text>
              </g>
            );
          })}
          <text x={95} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mse}>
            MSE = 0.0046
          </text>

          {/* KL section */}
          <motion.rect x={195} y={8} width={210} height={104} rx={6}
            fill={step === 1 ? C.kl + '0a' : C.kl + '04'} stroke={C.kl}
            animate={{ strokeWidth: step === 1 ? 1.5 : 0.5 }} />
          <text x={300} y={22} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.kl}>KL Divergence</text>

          {/* KL formula lines */}
          <text x={205} y={40} fontSize={9} fill="var(--muted-foreground)">
            KL = -0.5 × Σ(1 + log σ² - μ² - σ²)
          </text>
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={205} y={55} fontSize={6.5} fill={C.kl}>
                dim1: -(1 + (-0.8) - 0.1225 - 0.449) = 0.372
              </text>
              <text x={205} y={68} fontSize={6.5} fill={C.kl}>
                dim2: -(1 + (-1.2) - 0.0144 - 0.301) = 0.516
              </text>
              <text x={205} y={84} fontSize={9} fontWeight={600} fill={C.kl}>
                KL = 0.5 × (0.372 + 0.516) = 0.444
              </text>
            </motion.g>
          )}

          {/* Total loss */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={210} y={90} width={180} height={18} rx={4}
                fill={C.total + '14'} stroke={C.total} strokeWidth={1} />
              <text x={300} y={103} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.total}>
                Total = 0.0046 + 0.444 = 0.449
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
