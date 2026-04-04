import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './LinearVsNonlinearData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 선형 합성: y = 3x + 4 (1층: y=2x+1, 2층: y=1.5x+2.5 → 합성 = 3x+4) */
function LinearPath({ active }: { active: boolean }) {
  const c = active ? COLORS.linear : '#88888840';
  return (
    <g>
      <line x1={30} y1={150} x2={190} y2={30} stroke={c} strokeWidth={1.2} />
      <text x={110} y={80} textAnchor="middle" fontSize={9} fill={c}>
        y = 3x + 4
      </text>
    </g>
  );
}

/* 비선형: 곡선 경로 (sigmoid-like) */
function NonlinearPath({ active }: { active: boolean }) {
  const c = active ? COLORS.nonlinear : '#88888840';
  return (
    <g>
      <path
        d="M30,140 C60,138 80,130 100,100 S140,40 170,35 S195,33 200,32"
        fill="none" stroke={c} strokeWidth={1.2}
      />
      <text x={160} y={75} textAnchor="middle" fontSize={9} fill={c}>
        곡선 학습 가능
      </text>
    </g>
  );
}

export default function LinearVsNonlinearViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Left panel: linear only */}
          <text x={110} y={14} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">선형만 쌓기</text>
          <rect x={15} y={20} width={195} height={140} rx={6}
            fill="none" stroke="var(--border)" strokeWidth={0.8} />
          {/* axes */}
          <line x1={30} y1={150} x2={200} y2={150} stroke="#888" strokeWidth={0.5} />
          <line x1={30} y1={150} x2={30} y2={25} stroke="#888" strokeWidth={0.5} />
          <LinearPath active={step <= 1} />

          {/* 2-layer formula */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={110} y={130} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                층1: 2x+1 → 층2: 1.5z+2.5 = 3x+4
              </text>
            </motion.g>
          )}

          {/* Right panel: with activation */}
          <text x={335} y={14} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">활성화 함수 추가</text>
          <rect x={235} y={20} width={195} height={140} rx={6}
            fill="none" stroke="var(--border)" strokeWidth={0.8} />
          <line x1={250} y1={150} x2={420} y2={150} stroke="#888" strokeWidth={0.5} />
          <line x1={250} y1={150} x2={250} y2={25} stroke="#888" strokeWidth={0.5} />

          {step < 2 && (
            <text x={335} y={90} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)" opacity={0.5}>
              다음 단계 →
            </text>
          )}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <g transform="translate(220,0)">
                <NonlinearPath active />
              </g>
              {/* scatter-like data points */}
              {[
                [265, 135], [280, 125], [300, 105], [320, 70],
                [340, 50], [370, 38], [395, 34], [410, 33],
              ].map(([cx, cy], i) => (
                <motion.circle key={i} cx={cx} cy={cy} r={2}
                  fill={COLORS.nonlinear} opacity={0.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.04 }} />
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
