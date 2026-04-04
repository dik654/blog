import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: '문제: f^p를 계산하고 싶다 (p ~ 256-bit)' },
  { label: 'Frobenius의 마법: 12개 계수를 재배열하면 끝' },
  { label: '비용 비교: Fp12 곱셈 1회 = 54 Fp곱 vs Frobenius ~ 6 Fp곱' },
];

const C = { red: '#ef4444', green: '#10b981', blue: '#6366f1' };

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: The Problem */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
            <rect x={30} y={30} width={200} height={40} rx={6}
              fill={`${C.red}15`} stroke={C.red} strokeWidth={1.2} />
            <text x={130} y={45} textAnchor="middle" fontSize={11} fill={C.red} fontWeight={600}>
              f^p 를 계산
            </text>
            <text x={130} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              p ~ 2의256승. naive = 256번 Fp12곱
            </text>
            <text x={130} y={100} textAnchor="middle" fontSize={14} fill={C.red} fontWeight={700}>
              256 x 54 = 13,824 Fp곱
            </text>
            <text x={130} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              사실상 불가능
            </text>
          </motion.g>

          {/* Step 1: Frobenius magic */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={280} y={30} width={210} height={40} rx={6}
              fill={`${C.green}15`} stroke={C.green} strokeWidth={1.2} />
            <text x={385} y={45} textAnchor="middle" fontSize={11} fill={C.green} fontWeight={600}>
              Frobenius: 계수 재배열
            </text>
            <text x={385} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              곱셈이 아닌 상수 스케일링
            </text>
            {/* Coefficient slots */}
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: step >= 1 ? 1 : 0 }}
                transition={{ ...sp, delay: i * 0.04 }}>
                <rect x={272 + i * 18} y={85} width={15} height={22} rx={2}
                  fill={`${C.green}20`} stroke={C.green} strokeWidth={0.6} />
                <text x={279.5 + i * 18} y={100} textAnchor="middle"
                  fontSize={10} fill={C.green} fontWeight={500}>
                  {`c${i}`}
                </text>
              </motion.g>
            ))}
            <motion.text x={385} y={128} textAnchor="middle" fontSize={10}
              fill={C.green} animate={{ opacity: step >= 1 ? 0.8 : 0 }} transition={sp}>
              각 슬롯에 상수 곱 = ~6 Fp곱
            </motion.text>
          </motion.g>

          {/* Step 2: Cost comparison bars */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.15 }} transition={sp}>
            <text x={60} y={175} fontSize={11} fill="var(--foreground)" fontWeight={600}>
              비용 비교
            </text>
            {/* Naive bar */}
            <rect x={60} y={190} width={400} height={24} rx={4}
              fill={`${C.red}08`} stroke={C.red} strokeWidth={0.5} />
            <motion.rect x={61} y={191} height={22} rx={3} fill={`${C.red}30`}
              animate={{ width: step === 2 ? 398 : 0 }} transition={sp} />
            <text x={260} y={206} textAnchor="middle" fontSize={11} fill={C.red} fontWeight={600}>
              Naive: 13,824 Fp곱
            </text>
            {/* Frobenius bar */}
            <rect x={60} y={228} width={400} height={24} rx={4}
              fill={`${C.green}08`} stroke={C.green} strokeWidth={0.5} />
            <motion.rect x={61} y={229} height={22} rx={3} fill={`${C.green}30`}
              animate={{ width: step === 2 ? 18 : 0 }} transition={sp} />
            <text x={110} y={244} textAnchor="middle" fontSize={11} fill={C.green} fontWeight={600}>
              Frobenius: ~6
            </text>
            <motion.text x={380} y={268} textAnchor="middle" fontSize={12}
              fill={C.blue} fontWeight={700}
              animate={{ opacity: step === 2 ? 1 : 0 }} transition={sp}>
              2,000배 이상 빠름
            </motion.text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
