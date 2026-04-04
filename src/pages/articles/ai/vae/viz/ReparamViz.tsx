import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '인코더 출력: μ=[0.35, -0.12], log σ²=[-0.8, -1.2]' },
  { label: 'σ = exp(0.5 × log σ²) → [0.670, 0.549]' },
  { label: 'ε ~ N(0,1) 에서 랜덤 샘플 → [0.5, -0.3]' },
  { label: 'z = μ + σ × ε → [0.685, -0.285]' },
];

const C = { mu: '#10b981', sigma: '#f59e0b', eps: '#8b5cf6', z: '#3b82f6' };

export default function ReparamViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* μ box */}
          <motion.rect x={10} y={15} width={70} height={36} rx={6}
            fill={C.mu + '14'} stroke={C.mu} strokeWidth={1} />
          <text x={45} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mu}>μ</text>
          <text x={45} y={42} textAnchor="middle" fontSize={9} fill={C.mu + 'cc'}>[0.35, -0.12]</text>

          {/* log σ² box */}
          <motion.rect x={10} y={65} width={70} height={36} rx={6}
            fill={C.sigma + '14'} stroke={C.sigma} strokeWidth={1} />
          <text x={45} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sigma}>log σ²</text>
          <text x={45} y={92} textAnchor="middle" fontSize={9} fill={C.sigma + 'cc'}>[-0.8, -1.2]</text>

          {/* Arrow log σ² → σ */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={82} y1={83} x2={118} y2={83} stroke={C.sigma} strokeWidth={1} />
              <polygon points="116,80 122,83 116,86" fill={C.sigma} />
              <text x={100} y={76} textAnchor="middle" fontSize={9} fill={C.sigma + '99'}>exp(0.5×)</text>
            </motion.g>
          )}

          {/* σ box */}
          <motion.rect x={124} y={65} width={70} height={36} rx={6}
            fill={step >= 1 ? C.sigma + '20' : C.sigma + '08'} stroke={C.sigma}
            animate={{ strokeWidth: step >= 1 ? 1.5 : 0.5 }} />
          <text x={159} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sigma}>σ</text>
          <text x={159} y={92} textAnchor="middle" fontSize={9} fill={C.sigma + 'cc'}>
            {step >= 1 ? '[0.670, 0.549]' : '?'}
          </text>

          {/* ε box */}
          <motion.rect x={124} y={15} width={70} height={36} rx={6}
            fill={step >= 2 ? C.eps + '20' : C.eps + '08'} stroke={C.eps}
            animate={{ strokeWidth: step >= 2 ? 1.5 : 0.5 }} />
          <text x={159} y={28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.eps}>ε ~ N(0,1)</text>
          <text x={159} y={42} textAnchor="middle" fontSize={9} fill={C.eps + 'cc'}>
            {step >= 2 ? '[0.5, -0.3]' : '샘플링 대기'}
          </text>

          {/* Merge arrows: μ + σ×ε → z */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* μ → merge */}
              <line x1={82} y1={33} x2={240} y2={55} stroke={C.mu} strokeWidth={0.8} />
              {/* σ×ε → merge */}
              <line x1={196} y1={83} x2={240} y2={60} stroke={C.sigma} strokeWidth={0.8} />
              <line x1={196} y1={33} x2={240} y2={56} stroke={C.eps} strokeWidth={0.8} />
              {/* multiply label */}
              <circle cx={212} cy={55} r={8} fill="none" stroke="var(--border)" strokeWidth={0.8} />
              <text x={212} y={58} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">+</text>
            </motion.g>
          )}

          {/* z result */}
          <motion.rect x={260} y={38} width={90} height={40} rx={6}
            fill={step >= 3 ? C.z + '20' : C.z + '06'} stroke={C.z}
            animate={{ strokeWidth: step >= 3 ? 1.5 : 0.5 }} />
          <text x={305} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.z}>z</text>
          <text x={305} y={66} textAnchor="middle" fontSize={9} fill={C.z + 'cc'}>
            {step >= 3 ? '[0.685, -0.285]' : '?'}
          </text>

          {/* Computation detail */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.3 }}>
              <text x={305} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                0.35 + 0.670×0.5 = 0.685
              </text>
              <text x={305} y={105} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                -0.12 + 0.549×(-0.3) = -0.285
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
