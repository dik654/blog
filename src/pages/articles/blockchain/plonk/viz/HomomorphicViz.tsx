import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { f: '#6366f1', g: '#10b981', add: '#f59e0b', sc: '#8b5cf6', no: '#ef4444' };

const STEPS = [
  { label: 'C(f) -- 다항식 커밋', body: 'f(x)=3+2x+x^2 의 계수를 SRS에 MSM하여 G1 점 하나로 압축. tau를 모르지만 계산 가능.' },
  { label: 'C(g) -- 독립 커밋', body: 'g(x)=1+4x를 같은 SRS로 커밋. 다른 다항식이므로 다른 G1 점이 나옴.' },
  { label: '가법 동형: C(f)+C(g)=C(f+g)', body: 'G1 점 덧셈이 곧 다항식 덧셈의 커밋. PLONK에서 여러 커밋을 합칠 때 활용.' },
  { label: '스칼라 곱: alpha*C(f)=C(alpha*f)', body: '스칼라 곱 동형성으로 nu*C(a)+nu^2*C(b)+... 배치 결합이 가능.' },
  { label: '곱셈 동형은 불가', body: 'G1은 덧셈군이라 곱셈 연산 불가. 유일한 예외는 Pairing으로 GT에서 곱을 확인.' },
];

/* Box positions */
const BW = 100, BH = 34;

export default function HomomorphicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* C(f) box */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.15 }} transition={sp}>
            <motion.rect x={20} y={20} width={BW} height={BH} rx={5}
              initial={{ strokeWidth: 0.5 }}
              animate={{
                fill: step === 0 ? `${C.f}20` : `${C.f}08`,
                stroke: C.f,
                strokeWidth: step === 0 ? 2 : 0.5,
              }}
              transition={sp} />
            <text x={70} y={34} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.f}>C(f)</text>
            <text x={70} y={47} textAnchor="middle" fontSize={7.5} fill={C.f} opacity={0.6}>3+2x+x^2</text>
          </motion.g>

          {/* C(g) box */}
          <motion.g initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: step >= 1 ? 1 : 0.15, x: 0 }} transition={sp}>
            <motion.rect x={20} y={70} width={BW} height={BH} rx={5}
              initial={{ strokeWidth: 0.5 }}
              animate={{
                fill: step === 1 ? `${C.g}20` : `${C.g}08`,
                stroke: C.g,
                strokeWidth: step === 1 ? 2 : 0.5,
              }}
              transition={sp} />
            <text x={70} y={84} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.g}>C(g)</text>
            <text x={70} y={97} textAnchor="middle" fontSize={7.5} fill={C.g} opacity={0.6}>1+4x</text>
          </motion.g>

          {/* Addition: C(f)+C(g) = C(f+g) */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 2 ? 1 : 0.05 }} transition={sp}>
            {/* Plus sign */}
            <motion.text x={148} y={63} textAnchor="middle"
              fontSize={14} fontWeight={700} fill={C.add}
              initial={{ scale: 0 }} animate={{ scale: step === 2 ? 1.2 : 1 }}
              transition={sp}>+</motion.text>
            {/* Arrow to result */}
            <line x1={165} y1={60} x2={200} y2={60} stroke={C.add} strokeWidth={1} />
            <polygon points="198,56 198,64 204,60" fill={C.add} />
            {/* Result box */}
            <motion.rect x={210} y={43} width={120} height={BH} rx={5}
              animate={{
                fill: step === 2 ? `${C.add}18` : `${C.add}08`,
                stroke: C.add,
                strokeWidth: step === 2 ? 2 : 0.5,
              }}
              transition={sp} />
            <text x={270} y={57} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.add}>C(f+g)</text>
            <text x={270} y={70} textAnchor="middle" fontSize={7.5} fill={C.add} opacity={0.6}>4+6x+x^2</text>
            {/* Equals */}
            <motion.rect x={340} y={50} width={28} height={18} rx={9}
              animate={{ fill: step === 2 ? `${C.add}25` : `${C.add}08`, stroke: C.add, strokeWidth: 0.6 }}
              transition={sp} />
            <text x={354} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.add}>=</text>
          </motion.g>

          {/* Scalar multiplication */}
          <motion.g initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: step >= 3 ? 1 : 0.05, y: step >= 3 ? 0 : 6 }} transition={sp}>
            <motion.rect x={210} y={90} width={120} height={BH} rx={5}
              animate={{
                fill: step === 3 ? `${C.sc}18` : `${C.sc}08`,
                stroke: C.sc,
                strokeWidth: step === 3 ? 2 : 0.5,
              }}
              transition={sp} />
            <text x={270} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sc}>5*C(f) = C(5f)</text>
            <text x={270} y={117} textAnchor="middle" fontSize={7.5} fill={C.sc} opacity={0.6}>batch combine</text>
            {/* Arrow from C(f) */}
            <line x1={120} y1={42} x2={220} y2={92} stroke={C.sc} strokeWidth={0.6} strokeDasharray="3 2" />
          </motion.g>

          {/* Multiplication NOT possible */}
          <motion.g initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: step >= 4 ? 1 : 0.05, y: step >= 4 ? 0 : 6 }} transition={sp}>
            <motion.rect x={210} y={135} width={130} height={28} rx={5}
              animate={{
                fill: `${C.no}08`,
                stroke: C.no,
                strokeWidth: step === 4 ? 1.5 : 0.5,
                strokeDasharray: '4 3',
              }}
              transition={sp} />
            <text x={275} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.no}>
              C(f)*C(g) = ???
            </text>
            <text x={275} y={159} textAnchor="middle" fontSize={7.5} fill={C.no} opacity={0.6}>
              G1 additive group only
            </text>
            {/* Pairing exception */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 4 ? 0.8 : 0 }}
              transition={{ ...sp, delay: 0.3 }}>
              <rect x={360} y={135} width={100} height={28} rx={5}
                fill={`${C.no}10`} stroke={C.no} strokeWidth={0.6} />
              <text x={410} y={147} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.no}>
                Pairing e(.,.)
              </text>
              <text x={410} y={158} textAnchor="middle" fontSize={7.5} fill={C.no} opacity={0.5}>
                GT product check
              </text>
              <line x1={340} y1={149} x2={360} y2={149} stroke={C.no} strokeWidth={0.6} />
              <polygon points="358,146 358,152 362,149" fill={C.no} />
            </motion.g>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
