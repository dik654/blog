import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, COLORS } from './StepFunctionData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* 좌표계: viewBox 0 0 440 160, 원점 = (110, 80) for left, (330, 80) for right */
const OL = { x: 110, y: 80 };
const OR = { x: 330, y: 80 };

export default function StepFunctionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Left: step function f(x) */}
          <text x={OL.x} y={14} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">f(x) — 계단 함수</text>
          {/* axes */}
          <line x1={20} y1={OL.y} x2={200} y2={OL.y} stroke="#888" strokeWidth={0.5} />
          <line x1={OL.x} y1={20} x2={OL.x} y2={145} stroke="#888" strokeWidth={0.5} />
          <text x={195} y={OL.y + 12} fontSize={9} fill="#888">x</text>
          <text x={OL.x - 10} y={28} fontSize={9} fill="#888">y</text>
          {/* y=0 line (x<0) */}
          <motion.line x1={20} y1={OL.y} x2={OL.x} y2={OL.y}
            stroke={COLORS.fn} strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={sp} />
          {/* y=1 line (x>=0) */}
          <motion.line x1={OL.x} y1={35} x2={200} y2={35}
            stroke={COLORS.fn} strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: 0.15 }} />
          {/* vertical jump */}
          <line x1={OL.x} y1={OL.y} x2={OL.x} y2={35}
            stroke={COLORS.fn} strokeWidth={0.8} strokeDasharray="3,2" />
          {/* labels */}
          <text x={50} y={OL.y - 6} fontSize={9} fill={COLORS.fn}>0</text>
          <text x={160} y={30} fontSize={9} fill={COLORS.fn}>1</text>
          {/* discontinuity dot */}
          <circle cx={OL.x} cy={OL.y} r={3} fill="white"
            stroke={COLORS.fn} strokeWidth={1} />
          <circle cx={OL.x} cy={35} r={3} fill={COLORS.fn} />

          {/* Right: derivative f'(x) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={OR.x} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill="var(--foreground)">f'(x) — 미분</text>
              <line x1={240} y1={OR.y} x2={420} y2={OR.y}
                stroke="#888" strokeWidth={0.5} />
              <line x1={OR.x} y1={20} x2={OR.x} y2={145}
                stroke="#888" strokeWidth={0.5} />
              <text x={415} y={OR.y + 12} fontSize={9} fill="#888">x</text>
              {/* f'(x)=0 everywhere */}
              <line x1={240} y1={OR.y} x2={OR.x - 2} y2={OR.y}
                stroke={COLORS.deriv} strokeWidth={1.5} />
              <line x1={OR.x + 2} y1={OR.y} x2={420} y2={OR.y}
                stroke={COLORS.deriv} strokeWidth={1.5} />
              {/* undefined at x=0 */}
              <circle cx={OR.x} cy={OR.y} r={3} fill="none"
                stroke={COLORS.warn} strokeWidth={1.2} />
              <text x={OR.x} y={OR.y - 10} textAnchor="middle" fontSize={9}
                fill={COLORS.warn} fontWeight={500}>정의 안 됨</text>
              <text x={280} y={OR.y - 6} fontSize={9} fill={COLORS.deriv}>0</text>
              <text x={380} y={OR.y - 6} fontSize={9} fill={COLORS.deriv}>0</text>
            </motion.g>
          )}

          {/* bottom annotation */}
          <text x={220} y={152} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">
            미분 = 0 → 기울기 신호 없음 → 가중치 업데이트 불가
          </text>
        </svg>
      )}
    </StepViz>
  );
}
