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
        <svg viewBox="0 0 480 165" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>

          {/* axes */}
          <line x1={40} y1={15} x2={40} y2={100}
            stroke="var(--border)" strokeWidth={0.8} />
          <line x1={40} y1={100} x2={260} y2={100}
            stroke="var(--border)" strokeWidth={0.8} />
          <text x={150} y={114} textAnchor="middle" fontSize={8}
            fill="var(--muted-foreground)">정답 클래스 확률 ŷ →</text>
          <text x={14} y={58} fontSize={8}
            fill="var(--muted-foreground)"
            transform="rotate(-90 14 58)">Loss</text>

          {CURVES.map((c, ci) => {
            const active = ci === step || step === 2;
            const pts = c.data.map((v, i) => {
              const x = 40 + (i + 1) * 22;
              const y = 100 - v * (ci === 0 ? 24 : 75);
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
                    cx={40 + (i + 1) * 22}
                    cy={100 - v * (ci === 0 ? 24 : 75)}
                    r={2} fill={c.color} opacity={0.7} />
                ))}
              </motion.g>
            );
          })}

          {/* legend */}
          <line x1={44} y1={20} x2={56} y2={20} stroke="#0ea5e9" strokeWidth={1.5} />
          <text x={60} y={23} fontSize={7} fill="#0ea5e9">CE</text>
          <line x1={44} y1={30} x2={56} y2={30} stroke="#10b981" strokeWidth={1.5} />
          <text x={60} y={33} fontSize={7} fill="#10b981">MSE</text>

          {/* Our model marker at y=0.09 (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={sp}>
              <line x1={62} y1={100 - 1.9 * 24}
                x2={62} y2={100}
                stroke="#0ea5e9" strokeWidth={0.8}
                strokeDasharray="3 2" />
              <circle cx={62} cy={100 - 1.9 * 24}
                r={4} fill="#0ea5e920" stroke="#0ea5e9"
                strokeWidth={1.2} />
              <circle cx={62} cy={100 - 0.64 * 75}
                r={4} fill="#10b98120" stroke="#10b981"
                strokeWidth={1.2} />
              <text x={62} y={100 - 1.9 * 24 - 6} textAnchor="middle"
                fontSize={7} fill="#0ea5e9">ŷ=0.09</text>
            </motion.g>
          )}

          {/* Comparison panel (right side, clearly separated) */}
          <rect x={280} y={10} width={190} height={148} rx={6}
            fill="var(--card)"
            stroke="var(--border)" strokeWidth={0.6} />

          {step === 0 && <CEPanel />}
          {step === 1 && <MSEPanel />}
          {step === 2 && <ComparePanel />}
        </svg>
      )}
    </StepViz>
  );
}
