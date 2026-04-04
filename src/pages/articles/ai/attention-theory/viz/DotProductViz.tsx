import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, S_VEC, H_VEC, DOT_RESULT } from './DotProductVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(', ')}]`; }

function VB({ x, y, l, v, c }: { x: number; y: number; l: string; v: number[]; c: string }) {
  return (<g>
    <rect x={x} y={y} width={66} height={30} rx={6} fill={c + '15'} stroke={c} strokeWidth={1.5} />
    <text x={x + 33} y={y + 12} textAnchor="middle" fontSize={10} fill={c} fontWeight={600}>{l}</text>
    <text x={x + 33} y={y + 24} textAnchor="middle" fontSize={9} fill={c}>{fmtV(v)}</text>
  </g>);
}

export default function DotProductViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <VB x={20} y={26} l="s (decoder)" v={S_VEC} c={C.dot} />
              <text x={100} y={45} fontSize={14} fill={C.dot}>·</text>
              <VB x={118} y={26} l="h (encoder)" v={H_VEC} c={C.dot} />
              <text x={198} y={45} fontSize={14} fill={C.dot}>=</text>
              <rect x={212} y={22} width={200} height={44} rx={6}
                fill={C.dot + '10'} stroke={C.dot} strokeWidth={1.5} />
              <text x={312} y={40} textAnchor="middle" fontSize={10} fill={C.dot}>
                0.7×0.8 + 0.3×0.2
              </text>
              <text x={312} y={56} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.dot}>
                = {DOT_RESULT}
              </text>
              <text x={230} y={88} fontSize={10} fill={C.dot} fillOpacity={0.6}>
                내적이 클수록 두 벡터가 유사 → 높은 어텐션
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={15} y={28} width={45} height={32} rx={5}
                fill={C.general + '15'} stroke={C.general} strokeWidth={1.5} />
              <text x={37} y={48} textAnchor="middle" fontSize={10} fill={C.general}>s^T</text>
              <text x={72} y={48} fontSize={10} fill={C.general}>×</text>
              <motion.rect x={85} y={22} width={44} height={44} rx={6}
                fill={C.general + '25'} stroke={C.general} strokeWidth={2}
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                style={{ transformOrigin: '107px 44px' }} />
              <text x={107} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.general}>W</text>
              <text x={107} y={54} textAnchor="middle" fontSize={8} fill={C.general}>학습</text>
              <text x={142} y={48} fontSize={10} fill={C.general}>×</text>
              <rect x={155} y={28} width={45} height={32} rx={5}
                fill={C.general + '15'} stroke={C.general} strokeWidth={1.5} />
              <text x={177} y={48} textAnchor="middle" fontSize={10} fill={C.general}>h</text>
              <text x={215} y={48} fontSize={10} fill={C.general}>=</text>
              <rect x={228} y={32} width={60} height={26} rx={6}
                fill={C.general + '25'} stroke={C.general} strokeWidth={1.5} />
              <text x={258} y={49} textAnchor="middle" fontSize={11} fontWeight={600}
                fill={C.general}>score</text>
              <text x={150} y={90} textAnchor="middle" fontSize={10} fill={C.general} fillOpacity={0.6}>
                W가 유사도 함수를 학습 — dot-product보다 표현력 높음
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={22} width={50} height={30} rx={5}
                fill={C.scaled + '15'} stroke={C.scaled} strokeWidth={1.5} />
              <text x={45} y={40} textAnchor="middle" fontSize={10} fill={C.scaled}>Q · K</text>
              <text x={80} y={40} fontSize={10} fill={C.scaled}>=</text>
              <text x={110} y={40} fontSize={11} fontWeight={600} fill={C.scaled}>4.96</text>
              <motion.line x1={85} y1={52} x2={145} y2={52}
                stroke={C.scaled} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <text x={115} y={68} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.scaled}>
                sqrt(64) = 8
              </text>
              <text x={160} y={60} fontSize={10} fill={C.scaled}>=</text>
              <motion.rect x={175} y={42} width={70} height={26} rx={6}
                fill={C.scaled + '25'} stroke={C.scaled} strokeWidth={1.5}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ transformOrigin: '210px 55px' }} transition={{ delay: 0.5 }} />
              <text x={210} y={59} textAnchor="middle" fontSize={11} fontWeight={700}
                fill={C.scaled}>0.62</text>
              <rect x={280} y={25} width={160} height={50} rx={6}
                fill={C.scaled + '08'} stroke={C.scaled} strokeWidth={0.5} />
              <text x={360} y={42} textAnchor="middle" fontSize={9} fill={C.scaled}>
                d_k=64 → 내적이 커짐
              </text>
              <text x={360} y={56} textAnchor="middle" fontSize={9} fill={C.scaled}>
                → softmax 기울기 소실 방지
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
