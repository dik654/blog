import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, H_VECS, S_VEC, SCORES, PROBS, CTX } from './AdditiveAttnVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(',')}]`; }

export default function AdditiveAttnViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Encoder hidden states */}
          {H_VECS.map((hv, i) => (
            <g key={i}>
              <rect x={15 + i * 62} y={14} width={52} height={36} rx={5}
                fill={C.enc + '18'} stroke={C.enc} strokeWidth={1.5} />
              <text x={41 + i * 62} y={28} textAnchor="middle" fontSize={10}
                fill={C.enc} fontWeight={600}>h{i + 1}</text>
              <text x={41 + i * 62} y={42} textAnchor="middle" fontSize={8}
                fill={C.enc}>{fmtV(hv)}</text>
            </g>
          ))}
          {/* Decoder state */}
          <rect x={290} y={84} width={62} height={36} rx={5}
            fill={C.dec + '18'} stroke={C.dec} strokeWidth={1.5} />
          <text x={321} y={98} textAnchor="middle" fontSize={10}
            fill={C.dec} fontWeight={600}>s_i</text>
          <text x={321} y={112} textAnchor="middle" fontSize={8}
            fill={C.dec}>{fmtV(S_VEC)}</text>
          {/* Score boxes */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {SCORES.map((sc, i) => (
                <motion.g key={`s${i}`}>
                  <motion.line x1={41 + i * 62} y1={50} x2={41 + i * 62} y2={68}
                    stroke={C.score} strokeWidth={1} strokeOpacity={0.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.08 }} />
                  <rect x={17 + i * 62} y={70} width={48} height={22} rx={3}
                    fill={C.score + (step >= 1 ? '20' : '10')}
                    stroke={C.score} strokeWidth={step >= 1 ? 1.5 : 1} />
                  <text x={41 + i * 62} y={84} textAnchor="middle" fontSize={9}
                    fill={C.score} fontWeight={step >= 1 ? 600 : 400}>
                    {step >= 1 ? `a=${PROBS[i].toFixed(2)}` : `e=${sc.toFixed(1)}`}
                  </text>
                </motion.g>
              ))}
              <motion.line x1={290} y1={102} x2={265} y2={81}
                stroke={C.dec} strokeWidth={1} strokeOpacity={0.3}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 }} />
            </motion.g>
          )}
          {/* MLP box */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
              <rect x={370} y={14} width={100} height={36} rx={6}
                fill={C.score + '10'} stroke={C.score} strokeWidth={1} />
              <text x={420} y={30} textAnchor="middle" fontSize={9} fill={C.score}>
                v^T tanh(Ws + Uh)
              </text>
              <text x={420} y={42} textAnchor="middle" fontSize={9}
                fill={C.score} fillOpacity={0.5}>Additive Score</text>
            </motion.g>
          )}
          {/* Context vector */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {PROBS.map((p, i) => (
                <motion.line key={`cl-${i}`}
                  x1={41 + i * 62} y1={92} x2={160} y2={138}
                  stroke={C.score} strokeWidth={0.5 + p * 3} opacity={0.2 + p * 0.8}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }} />
              ))}
              <text x={15} y={114} fontSize={8} fill={C.score}>
                0.30×{fmtV(H_VECS[0])} + 0.50×{fmtV(H_VECS[1])} + 0.12×{fmtV(H_VECS[2])} + 0.08×{fmtV(H_VECS[3])}
              </text>
              <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ transformOrigin: '160px 148px' }} transition={{ delay: 0.3 }}>
                <rect x={80} y={128} width={160} height={32} rx={8}
                  fill={C.score + '20'} stroke={C.score} strokeWidth={1.5} />
                <text x={160} y={143} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={C.score}>c = [{CTX.map(v => v.toFixed(2)).join(', ')}]</text>
                <text x={160} y={155} textAnchor="middle" fontSize={8}
                  fill={C.score}>동적 컨텍스트 벡터</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
