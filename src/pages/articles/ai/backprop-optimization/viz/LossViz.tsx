import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CEPanel, MSEPanel, ComparePanel } from './LossComparePanel';

const STEPS = [
  { label: 'Cross-Entropy: −log(ŷ), 정답 확률이 낮으면 급격히 증가' },
  { label: 'MSE: (y−ŷ)², 오차에 비례하여 부드럽게 증가' },
  { label: '우리 모델: CE → −log(0.09)=2.41, MSE → (1−0.09)²=0.83' },
];

const CE = [3.0, 2.3, 1.9, 1.6, 1.2, 0.9, 0.7, 0.5, 0.3, 0.1];
const MSE_V = [0.9, 0.81, 0.64, 0.49, 0.36, 0.25, 0.16, 0.09, 0.04, 0.01];

const CURVES = [
  { data: CE, color: '#0ea5e9', label: 'Cross-Entropy', scale: 28 },
  { data: MSE_V, color: '#10b981', label: 'MSE', scale: 85 },
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export default function LossViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 150" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>

          {/* axes */}
          <line x1={50} y1={15} x2={50} y2={115}
            stroke="var(--border)" strokeWidth={0.8} />
          <line x1={50} y1={115} x2={340} y2={115}
            stroke="var(--border)" strokeWidth={0.8} />
          <text x={195} y={130} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">정답 클래스 확률 ŷ →</text>
          <text x={18} y={65} fontSize={9}
            fill="var(--muted-foreground)"
            transform="rotate(-90 18 65)">Loss</text>

          {CURVES.map((c, ci) => {
            const active = ci === step || step === 2;
            const pts = c.data.map((v, i) => {
              const x = 50 + (i + 1) * 28;
              const y = 115 - v * c.scale;
              return `${x},${y}`;
            }).join(' ');
            return (
              <motion.g key={ci}
                animate={{ opacity: active ? 1 : 0.12 }}
                transition={sp}>
                <polyline points={pts} fill="none"
                  stroke={c.color}
                  strokeWidth={active ? 1.5 : 0.8} />
                {active && c.data.map((v, i) => (
                  <circle key={i}
                    cx={50 + (i + 1) * 28}
                    cy={115 - v * c.scale}
                    r={2.5} fill={c.color} opacity={0.7} />
                ))}
                {active && (
                  <text
                    x={50 + 10 * 28 + 5}
                    y={115 - c.data[9] * c.scale + 3}
                    fontSize={8} fontWeight={600} fill={c.color}>
                    {c.label}
                  </text>
                )}
              </motion.g>
            );
          })}

          {/* Our model marker at y=0.09 (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>
              <line x1={78} y1={115 - 1.9 * 28}
                x2={78} y2={115}
                stroke="#0ea5e9" strokeWidth={0.8}
                strokeDasharray="3 2" />
              <circle cx={78} cy={115 - 1.9 * 28}
                r={4} fill="#0ea5e920" stroke="#0ea5e9"
                strokeWidth={1.2} />
              <circle cx={78} cy={115 - 0.64 * 85}
                r={4} fill="#10b98120" stroke="#10b981"
                strokeWidth={1.2} />
            </motion.g>
          )}

          {/* Comparison panel (right side) */}
          <rect x={355} y={15} width={125} height={120} rx={6}
            fill="color-mix(in oklch, var(--muted) 6%, transparent)"
            stroke="var(--border)" strokeWidth={0.6} />

          {step === 0 && <CEPanel />}
          {step === 1 && <MSEPanel />}
          {step === 2 && <ComparePanel />}
        </svg>
      )}
    </StepViz>
  );
}
