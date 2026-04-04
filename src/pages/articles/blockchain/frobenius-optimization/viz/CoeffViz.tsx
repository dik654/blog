import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { SlotsOriginal, GammaDrops, SlotsResult } from './CoeffVizSlots';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: '12개 슬롯: Fp12 원소의 계수 (c0, c1, ..., c11)' },
  { label: '각 슬롯 위에 상수 gamma_i가 결합된다' },
  { label: '결과: 각 계수가 상수배된 것뿐 -- 교차항 없음' },
  { label: 'gamma_i는 커브 파라미터로부터 한 번만 계산하는 고정 상수' },
];

const C = { note: '#6366f1', green: '#10b981', amber: '#f59e0b' };

export default function CoeffViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Title */}
          <text x={260} y={24} textAnchor="middle" fontSize={12}
            fill="var(--foreground)" fontWeight={600}>
            Frobenius: 계수별 상수 스케일링
          </text>

          {/* Original slots */}
          <SlotsOriginal step={step} />

          {/* Gamma drops */}
          <GammaDrops step={step} />

          {/* Arrow between rows */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp}>
              <line x1={260} y1={95} x2={260} y2={115}
                stroke="var(--muted-foreground)" strokeWidth={0.8} />
              <polygon points="256,115 264,115 260,120"
                fill="var(--muted-foreground)" />
            </motion.g>
          )}

          {/* Result slots */}
          <SlotsResult step={step} />

          {/* Step 3: precomputation note */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={sp}>
              <rect x={60} y={170} width={400} height={50} rx={6}
                fill={`${C.amber}10`} stroke={C.amber} strokeWidth={0.8} />
              <text x={260} y={190} textAnchor="middle" fontSize={11}
                fill={C.amber} fontWeight={600}>
                precomputed constants
              </text>
              <text x={260} y={208} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">
                p와 기약다항식에서 결정 -- setup 시 한 번만 계산 후 테이블 저장
              </text>
            </motion.g>
          )}

          {/* Legend */}
          <motion.g animate={{ opacity: step >= 2 ? 0.7 : 0 }} transition={sp}>
            <rect x={60} y={240} width={10} height={10} rx={2}
              fill={`${C.note}30`} stroke={C.note} strokeWidth={0.5} />
            <text x={76} y={249} fontSize={10} fill="var(--muted-foreground)">
              원본 계수
            </text>
            <rect x={160} y={240} width={10} height={10} rx={2}
              fill={`${C.green}30`} stroke={C.green} strokeWidth={0.5} />
            <text x={176} y={249} fontSize={10} fill="var(--muted-foreground)">
              스케일링 결과
            </text>
            <rect x={280} y={240} width={10} height={10} rx={2}
              fill={`${C.amber}30`} stroke={C.amber} strokeWidth={0.5} />
            <text x={296} y={249} fontSize={10} fill="var(--muted-foreground)">
              고정 상수 (precomputed)
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
