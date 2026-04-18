import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { init: '#6366f1', r1: '#10b981', r2: '#f59e0b', fin: '#ec4899' };

const STEPS = [
  { label: 'Initial: length-n vectors', body: 'a와 G 벡터의 내적 P=<a,G>가 커밋. Trusted Setup 불필요(DLog 가정).' },
  { label: 'Round 1: n -> n/2', body: '벡터를 절반으로 나누고 교차 커밋 L, R을 계산. FS 챌린지 x로 접어서 n/2 벡터 생성.' },
  { label: 'Round 2: n/2 -> n/4', body: '동일한 접기를 반복. 매 라운드마다 L, R 커밋 2개 + 벡터 절반.' },
  { label: 'Final: scalar verification', body: 'log2(n) 라운드 후 스칼라 1개로 축소. 증명 크기: 2*log(n) G1 + 1 Fr. Setup 불필요.' },
];

/* Visual constants */
const VEC_Y = 28;
const CELL_W = 28;
const CELL_H = 20;

export default function IPAViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 175" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Full vectors a and G */}
          <text x={15} y={18} fontSize={9} fontWeight={600} fill={C.init}>
            a = [a0, ..., a7]
          </text>
          {[...Array(8)].map((_, i) => (
            <motion.g key={`a-${i}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: step === 0 ? 1 : step === 1 && i < 4 ? 0.8 : step === 1 ? 0.4 : 0.2,
              }}
              transition={{ ...sp, delay: step === 0 ? i * 0.04 : 0 }}>
              <rect x={15 + i * (CELL_W + 4)} y={VEC_Y} width={CELL_W} height={CELL_H} rx={3}
                fill={`${C.init}12`} stroke={C.init}
                strokeWidth={step === 0 ? 1 : 0.4} />
              <text x={15 + i * (CELL_W + 4) + CELL_W / 2} y={VEC_Y + 13} textAnchor="middle"
                fontSize={8} fontWeight={500} fill={C.init}>a{i}</text>
            </motion.g>
          ))}

          {/* G vector label */}
          <text x={290} y={18} fontSize={9} fontWeight={600} fill={C.init} opacity={step === 0 ? 0.8 : 0.3}>
            G = [G0, ..., G7]
          </text>
          {[...Array(8)].map((_, i) => (
            <motion.g key={`g-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 0 ? 0.7 : 0.15 }}
              transition={{ ...sp, delay: step === 0 ? i * 0.04 : 0 }}>
              <rect x={290 + i * 23} y={VEC_Y} width={19} height={CELL_H} rx={3}
                fill={`${C.init}08`} stroke={C.init} strokeWidth={0.4} />
              <text x={290 + i * 23 + 9.5} y={VEC_Y + 13} textAnchor="middle"
                fontSize={7} fill={C.init}>G{i}</text>
            </motion.g>
          ))}

          {/* P = <a,G> commitment */}
          <motion.g initial={{ opacity: 0 }}
            animate={{ opacity: step >= 0 ? 0.8 : 0.1 }} transition={sp}>
            <rect x={370} y={56} width={90} height={22} rx={11}
              fill={`${C.init}10`} stroke={C.init} strokeWidth={0.6} />
            <text x={415} y={70} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C.init}>P = {'<a,G>'}</text>
          </motion.g>

          {/* Step 1: Split and fold n -> n/2 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Left half */}
              <rect x={15} y={62} width={120} height={24} rx={4}
                fill={`${C.r1}10`} stroke={C.r1} strokeWidth={step === 1 ? 1.2 : 0.5} />
              <text x={75} y={77} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.r1}>aL (n/2)</text>

              {/* Right half */}
              <rect x={145} y={62} width={120} height={24} rx={4}
                fill={`${C.r1}10`} stroke={C.r1} strokeWidth={step === 1 ? 1.2 : 0.5} />
              <text x={205} y={77} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.r1}>aR (n/2)</text>

              {/* Cross commits L and R */}
              <motion.g initial={{ opacity: 0 }}
                animate={{ opacity: step === 1 ? 1 : 0.5 }}
                transition={{ ...sp, delay: 0.15 }}>
                {/* L box */}
                <rect x={30} y={96} width={60} height={22} rx={4}
                  fill={`${C.r1}15`} stroke={C.r1} strokeWidth={0.8} />
                <text x={60} y={110} textAnchor="middle"
                  fontSize={8} fontWeight={600} fill={C.r1}>L = {'<aL,GR>'}</text>

                {/* R box */}
                <rect x={110} y={96} width={60} height={22} rx={4}
                  fill={`${C.r1}15`} stroke={C.r1} strokeWidth={0.8} />
                <text x={140} y={110} textAnchor="middle"
                  fontSize={8} fontWeight={600} fill={C.r1}>R = {'<aR,GL>'}</text>

                {/* Cross arrows */}
                <line x1={75} y1={86} x2={60} y2={95} stroke={C.r1} strokeWidth={0.6} strokeDasharray="2 2" />
                <line x1={205} y1={86} x2={140} y2={95} stroke={C.r1} strokeWidth={0.6} strokeDasharray="2 2" />

                {/* FS challenge */}
                <rect x={185} y={96} width={80} height={22} rx={11}
                  fill={`${C.r1}08`} stroke={C.r1} strokeWidth={0.5} />
                <text x={225} y={110} textAnchor="middle"
                  fontSize={8} fill={C.r1}>x = FS(L,R)</text>
              </motion.g>

              {/* Folded result */}
              <motion.g initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: step >= 1 ? 0.9 : 0.2, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <line x1={140} y1={118} x2={140} y2={128} stroke={C.r1} strokeWidth={0.5} />
                <polygon points="137,126 143,126 140,130" fill={C.r1} />
                <rect x={80} y={130} width={120} height={22} rx={4}
                  fill={`${C.r1}18`} stroke={C.r1} strokeWidth={1} />
                <text x={140} y={144} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={C.r1}>a' = aL*x + aR*x^-1</text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: Further folding n/2 -> n/4 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={200} y1={141} x2={280} y2={141} stroke={C.r2} strokeWidth={0.8} />
              <polygon points="278,138 278,144 282,141" fill={C.r2} />
              <motion.rect x={285} y={130} width={100} height={22} rx={4}
                animate={{
                  fill: step === 2 ? `${C.r2}18` : `${C.r2}08`,
                  stroke: C.r2,
                  strokeWidth: step === 2 ? 1.5 : 0.5,
                }}
                transition={sp} />
              <text x={335} y={144} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.r2}>a'' (n/4)</text>
              <text x={335} y={162} textAnchor="middle"
                fontSize={7.5} fill={C.r2} opacity={0.6}>+L', R' commits</text>
            </motion.g>
          )}

          {/* Step 3: Final scalar */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={385} y1={141} x2={405} y2={141} stroke={C.fin} strokeWidth={0.6}
                strokeDasharray="2 2" />
              {/* Final scalar circle */}
              <motion.circle cx={435} cy={141} r={18}
                initial={{ r: 0 }}
                animate={{ r: 18 }}
                fill={`${C.fin}15`} stroke={C.fin} strokeWidth={1.5}
                transition={sp} />
              <text x={435} y={138} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={C.fin}>a_final</text>
              <text x={435} y={150} textAnchor="middle"
                fontSize={7} fill={C.fin} opacity={0.6}>1 Fr</text>
              {/* Proof size label */}
              <text x={435} y={172} textAnchor="middle"
                fontSize={7.5} fill={C.fin} opacity={0.7}>2*log(n) G1 + 1 Fr</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
