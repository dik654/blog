import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import {
  STEPS, S_VEC, H_VECS, SCORES, PROBS,
  WEIGHTED, CTX, BAR_MAX_W, H_C, S_C, ATT_C,
} from './AttentionCompVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const W = 460, H = 210;

function VL({ x, y, l, v, c }: { x: number; y: number; l: string; v: number[]; c: string }) {
  return (<g>
    <text x={x} y={y} fontSize={11} fill={c} fontWeight={500}>{l}</text>
    <text x={x} y={y + 12} fontSize={11} fill={c}>[{v.map(n => n.toFixed(1)).join(', ')}]</text>
  </g>);
}

export default function AttentionCompViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <VL x={20} y={20} l="s (디코더)" v={S_VEC} c={S_C} />
          {H_VECS.map((hv, i) => (
            <VL key={i} x={20} y={50 + i * 30} l={`h${i + 1}`} v={hv} c={H_C} />
          ))}
          {/* Dot product scores */}
          {step >= 0 && SCORES.map((sc, i) => (
            <motion.g key={`sc-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: i * 0.08 }}>
              <text x={130} y={55 + i * 30} fontSize={11} fill={ATT_C} fontWeight={500}>
                score{i + 1} = {sc.toFixed(2)}
              </text>
              <line x1={100} y1={50 + i * 30} x2={126} y2={50 + i * 30}
                stroke={ATT_C} strokeWidth={0.5} strokeDasharray="2 2" />
            </motion.g>
          ))}
          {/* Softmax bars */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={40} fontSize={11} fill={ATT_C} fontWeight={500}>softmax 확률</text>
              {PROBS.map((p, i) => (
                <g key={`b-${i}`}>
                  <motion.rect x={230} y={48 + i * 24} rx={2} height={14}
                    fill={ATT_C + '30'} stroke={ATT_C} strokeWidth={0.5}
                    initial={{ width: 0 }} animate={{ width: p * BAR_MAX_W / 0.4 }}
                    transition={{ ...sp, delay: i * 0.1 }} />
                  <text x={232 + p * BAR_MAX_W / 0.4 + 4} y={59 + i * 24}
                    fontSize={11} fill={ATT_C} fontWeight={500}>{p.toFixed(2)}</text>
                  <text x={224} y={59 + i * 24} textAnchor="end" fontSize={11} fill={H_C}>
                    h{i + 1}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
          {/* Weighted sum → context */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={230} y={128} fontSize={11} fill={ATT_C} fontWeight={500}>가중합</text>
              {WEIGHTED.map((wv, i) => (
                <text key={`w-${i}`} x={230} y={142 + i * 12} fontSize={11} fill={H_C}>
                  {PROBS[i]}×h{i + 1} = [{wv.map(v => v.toFixed(2)).join(', ')}]
                </text>
              ))}
              <rect x={355} y={130} width={100} height={28} rx={6}
                fill={ATT_C + '18'} stroke={ATT_C} strokeWidth={1} />
              <text x={405} y={142} textAnchor="middle" fontSize={11}
                fill={ATT_C} fontWeight={500}>컨텍스트</text>
              <text x={405} y={154} textAnchor="middle" fontSize={10}
                fill={ATT_C}>[{CTX.map(v => v.toFixed(2)).join(', ')}]</text>
            </motion.g>
          )}
          {/* Output word */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={355} y={H - 36} width={100} height={26} rx={6}
                fill={S_C + '18'} stroke={S_C} strokeWidth={1} />
              <text x={405} y={H - 19} textAnchor="middle" fontSize={11}
                fill={S_C} fontWeight={500}>"고마워"</text>
              <line x1={405} y1={158} x2={405} y2={H - 36}
                stroke={S_C} strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
