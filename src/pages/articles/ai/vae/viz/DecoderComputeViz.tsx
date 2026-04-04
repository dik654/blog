import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'z = [0.685, -0.285] 입력' },
  { label: '은닉층: h_dec = ReLU(W_dec·z + b_dec)' },
  { label: 'x̂ = sigmoid(W_out·h_dec + b_out)' },
  { label: '원본 x=[0.8, 0.4, 0.6] vs 복원 x̂' },
];

const C = { z: '#3b82f6', hidden: '#8b5cf6', out: '#ec4899' };

export default function DecoderComputeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* z inputs */}
          {['0.685', '-0.285'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
              <circle cx={40} cy={35 + i * 30} r={12} fill={C.z + '18'} stroke={C.z} strokeWidth={1} />
              <text x={40} y={38 + i * 30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.z}>{v}</text>
            </motion.g>
          ))}
          <text x={40} y={100} textAnchor="middle" fontSize={9} fill={C.z + '80'}>z (2D)</text>

          {/* Arrows z → hidden */}
          {step >= 1 && [0, 1].map(i => [0, 1, 2, 3].map(j => (
            <motion.line key={`${i}-${j}`} x1={52} y1={35 + i * 30} x2={118} y2={15 + j * 22}
              stroke={C.hidden} strokeWidth={0.5} opacity={0.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          )))}

          {/* Hidden neurons */}
          {['0.48', '0.31', '0.00', '0.62'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
              <circle cx={130} cy={15 + i * 22} r={10} fill={C.hidden + '18'} stroke={C.hidden}
                strokeWidth={step >= 1 ? 1 : 0.5} />
              <text x={130} y={18 + i * 22} textAnchor="middle" fontSize={9} fill={C.hidden}>
                {step >= 1 ? v : '?'}
              </text>
            </motion.g>
          ))}
          {step >= 1 && <text x={130} y={100} textAnchor="middle" fontSize={9} fill={C.hidden + '80'}>h_dec</text>}

          {/* Arrows hidden → output */}
          {step >= 2 && [0, 1, 2, 3].map(i => [0, 1, 2].map(j => (
            <motion.line key={`o${i}-${j}`} x1={140} y1={15 + i * 22} x2={218} y2={25 + j * 28}
              stroke={C.out} strokeWidth={0.5} opacity={0.2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          )))}

          {/* Output neurons x̂ */}
          {['0.73', '0.45', '0.52'].map((v, i) => (
            <motion.g key={i} animate={{ opacity: step >= 2 ? 1 : 0.2 }}>
              <circle cx={230} cy={25 + i * 28} r={12} fill={C.out + '18'} stroke={C.out}
                strokeWidth={step >= 2 ? 1.5 : 0.5} />
              <text x={230} y={28 + i * 28} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.out}>
                {step >= 2 ? v : '?'}
              </text>
            </motion.g>
          ))}
          {step >= 2 && <text x={230} y={100} textAnchor="middle" fontSize={9} fill={C.out + '80'}>x̂ = sigmoid</text>}

          {/* Comparison table */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={280} y={10} width={120} height={84} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
              <text x={340} y={24} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">원본 vs 복원</text>
              {[{ x: '0.80', xh: '0.73', d: '0.07' }, { x: '0.40', xh: '0.45', d: '0.05' }, { x: '0.60', xh: '0.52', d: '0.08' }].map((r, i) => (
                <g key={i}>
                  <text x={300} y={42 + i * 18} fontSize={9} fill={C.z}>{r.x}</text>
                  <text x={330} y={42 + i * 18} fontSize={9} fill="var(--muted-foreground)">→</text>
                  <text x={348} y={42 + i * 18} fontSize={9} fill={C.out}>{r.xh}</text>
                  <text x={385} y={42 + i * 18} fontSize={9} fill="#ef4444">Δ{r.d}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
