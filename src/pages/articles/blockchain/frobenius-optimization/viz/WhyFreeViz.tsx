import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'Full 곱셈: A x B (둘 다 미지수) -- 교차항 처리 필수' },
  { label: 'Frobenius: A x gamma (상수) -- 교차항 없음, 독립 처리' },
  { label: '비용 비교: 54 Fp곱 vs ~6 Fp곱. Full 곱셈의 약 1/9' },
];

const C = { red: '#ef4444', green: '#10b981', blue: '#6366f1', muted: '#6b7280' };

export default function WhyFreeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Full multiplication diagram */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
            <rect x={40} y={30} width={90} height={34} rx={5}
              fill={`${C.red}15`} stroke={C.red} strokeWidth={1} />
            <text x={85} y={51} textAnchor="middle" fontSize={12} fill={C.red} fontWeight={600}>
              A (미지수)
            </text>
            <text x={155} y={51} textAnchor="middle" fontSize={14} fill={C.muted}> x </text>
            <rect x={170} y={30} width={90} height={34} rx={5}
              fill={`${C.red}15`} stroke={C.red} strokeWidth={1} />
            <text x={215} y={51} textAnchor="middle" fontSize={12} fill={C.red} fontWeight={600}>
              B (미지수)
            </text>
            <motion.line x1={150} y1={70} x2={150} y2={90}
              stroke={C.red} strokeWidth={0.8} strokeDasharray="3 2"
              animate={{ opacity: step === 0 ? 0.6 : 0 }} transition={sp} />
            <rect x={60} y={92} width={180} height={28} rx={4}
              fill={`${C.red}08`} stroke={C.red} strokeWidth={0.6} />
            <text x={150} y={110} textAnchor="middle" fontSize={10} fill={C.red}>
              교차항 처리 (Karatsuba 3단) = 54 Fp곱
            </text>
          </motion.g>

          {/* Step 1: Frobenius multiplication */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={310} y={30} width={90} height={34} rx={5}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1} />
            <text x={355} y={51} textAnchor="middle" fontSize={12} fill={C.green} fontWeight={600}>
              A (미지수)
            </text>
            <text x={423} y={51} textAnchor="middle" fontSize={14} fill={C.muted}> x </text>
            <rect x={438} y={30} width={60} height={34} rx={5}
              fill={`${C.green}08`} stroke={C.green} strokeWidth={1} strokeDasharray="4 2" />
            <text x={468} y={51} textAnchor="middle" fontSize={12} fill={C.green} fontWeight={600}>
              gamma
            </text>
            <text x={468} y={42} textAnchor="middle" fontSize={10} fill={C.muted}>(상수)</text>
            <rect x={320} y={92} width={170} height={28} rx={4}
              fill={`${C.green}08`} stroke={C.green} strokeWidth={0.6} />
            <text x={405} y={110} textAnchor="middle" fontSize={10} fill={C.green}>
              각 계수 독립 처리 = ~6 Fp곱
            </text>
          </motion.g>

          {/* Step 2: Cost comparison bars */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }} transition={sp}>
            <text x={40} y={160} fontSize={11} fill="var(--foreground)" fontWeight={600}>
              Fp 곱셈 횟수 비교
            </text>
            {/* Full bar */}
            <rect x={40} y={172} width={440} height={28} rx={4}
              fill={`${C.red}06`} stroke={C.red} strokeWidth={0.4} />
            <motion.rect x={41} y={173} height={26} rx={3} fill={`${C.red}25`}
              animate={{ width: step === 2 ? 438 : 0 }} transition={sp} />
            <text x={260} y={190} textAnchor="middle" fontSize={12} fill={C.red} fontWeight={600}>
              Full Fp12 x Fp12: 54 Fp곱
            </text>
            {/* Frobenius bar */}
            <rect x={40} y={214} width={440} height={28} rx={4}
              fill={`${C.green}06`} stroke={C.green} strokeWidth={0.4} />
            <motion.rect x={41} y={215} height={26} rx={3} fill={`${C.green}25`}
              animate={{ width: step === 2 ? 49 : 0 }} transition={sp} />
            <text x={95} y={232} textAnchor="middle" fontSize={12} fill={C.green} fontWeight={600}>
              Frob: ~6
            </text>
            {/* Ratio */}
            <motion.text x={380} y={260} textAnchor="middle" fontSize={12}
              fill={C.blue} fontWeight={700}
              animate={{ opacity: step === 2 ? 1 : 0 }} transition={sp}>
              Full 곱셈의 1/9 비용
            </motion.text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
