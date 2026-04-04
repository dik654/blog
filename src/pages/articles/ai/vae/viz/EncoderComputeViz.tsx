import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 x = [0.8, 0.4, 0.6]' },
  { label: '은닉층: h = ReLU(W·x + b)' },
  { label: 'μ = W_μ·h + b_μ → [0.35, -0.12]' },
  { label: 'log σ² = W_logvar·h + b_logvar → [-0.8, -1.2]' },
];

const C = { input: '#6366f1', hidden: '#3b82f6', mu: '#10b981', logvar: '#f59e0b' };

export default function EncoderComputeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 125" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Input neurons */}
          {[0.8, 0.4, 0.6].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
              <circle cx={40} cy={25 + i * 30} r={12} fill={C.input + '18'} stroke={C.input} strokeWidth={1} />
              <text x={40} y={28 + i * 30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.input}>{v}</text>
            </motion.g>
          ))}
          <text x={40} y={105} textAnchor="middle" fontSize={9} fill={C.input + '80'}>x (3D)</text>

          {/* Arrows input → hidden */}
          {step >= 1 && [0, 1, 2].map(i => [0, 1, 2, 3].map(j => (
            <motion.line key={`${i}-${j}`} x1={52} y1={25 + i * 30} x2={128} y2={15 + j * 24}
              stroke={C.hidden} strokeWidth={0.5} opacity={0.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.05 * (i + j) }} />
          )))}

          {/* Hidden neurons */}
          {['0.72', '0.00', '0.54', '0.38'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
              <circle cx={140} cy={15 + i * 24} r={12} fill={C.hidden + '18'} stroke={C.hidden} strokeWidth={step >= 1 ? 1 : 0.5} />
              <text x={140} y={18 + i * 24} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.hidden}>
                {step >= 1 ? v : '?'}
              </text>
            </motion.g>
          ))}
          {step >= 1 && <text x={140} y={105} textAnchor="middle" fontSize={9} fill={C.hidden + '80'}>h = ReLU(W·x+b)</text>}

          {/* Arrows hidden → mu */}
          {step >= 2 && [0, 1, 2, 3].map(i => [0, 1].map(j => (
            <motion.line key={`m${i}-${j}`} x1={152} y1={15 + i * 24} x2={238} y2={28 + j * 30}
              stroke={C.mu} strokeWidth={0.5} opacity={0.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          )))}

          {/* μ outputs */}
          {['0.35', '-0.12'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 2 ? 1 : 0.2 }}>
              <rect x={228} y={18 + i * 30} width={36} height={20} rx={4}
                fill={C.mu + (step >= 2 ? '20' : '08')} stroke={C.mu} strokeWidth={step >= 2 ? 1.5 : 0.5} />
              <text x={246} y={31 + i * 30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mu}>
                {step >= 2 ? v : '?'}
              </text>
            </motion.g>
          ))}
          {step >= 2 && <text x={246} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mu}>μ</text>}

          {/* Arrows hidden → log var */}
          {step >= 3 && [0, 1, 2, 3].map(i => [0, 1].map(j => (
            <motion.line key={`v${i}-${j}`} x1={152} y1={15 + i * 24} x2={318} y2={28 + j * 30}
              stroke={C.logvar} strokeWidth={0.5} opacity={0.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          )))}

          {/* log σ² outputs */}
          {['-0.8', '-1.2'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 3 ? 1 : 0.2 }}>
              <rect x={308} y={18 + i * 30} width={36} height={20} rx={4}
                fill={C.logvar + (step >= 3 ? '20' : '08')} stroke={C.logvar} strokeWidth={step >= 3 ? 1.5 : 0.5} />
              <text x={326} y={31 + i * 30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.logvar}>
                {step >= 3 ? v : '?'}
              </text>
            </motion.g>
          ))}
          {step >= 3 && <text x={326} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.logvar}>log σ²</text>}
        </svg>
      )}
    </StepViz>
  );
}
