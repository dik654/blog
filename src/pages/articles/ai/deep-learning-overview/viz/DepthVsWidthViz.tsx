import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '넓고 얕은 네트워크', body: '1개 은닉층에 많은 뉴런 — 파라미터 수 폭발. 2²⁵개 뉴런이 필요할 수 있음.' },
  { label: '좁고 깊은 네트워크', body: '5개 은닉층, 각 5개 뉴런 — 총 25개. 파라미터 수 약 100만 배 감소.' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const NODE_R = 5;

function drawLayer(x: number, count: number, color: string, step: number, active: boolean) {
  const gap = Math.min(14, 120 / count);
  const startY = 65 - (count * gap) / 2;
  return Array.from({ length: count }, (_, i) => (
    <motion.circle key={`${x}-${i}`} cx={x} cy={startY + i * gap} r={NODE_R}
      fill={active ? `${color}30` : '#80808010'}
      stroke={active ? color : '#aaa'} strokeWidth={active ? 1.2 : 0.5}
      animate={{ opacity: active ? 1 : 0.3 }} transition={sp} />
  ));
}

export default function DepthVsWidthViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Wide & Shallow (step 0) */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
            <text x={10} y={12} fontSize={9} fontWeight={600} fill="var(--foreground)">Wide & Shallow</text>
            {drawLayer(30, 3, '#6366f1', step, step === 0)}
            {drawLayer(90, 12, '#ef4444', step, step === 0)}
            {drawLayer(150, 3, '#6366f1', step, step === 0)}
            <text x={90} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              은닉층 1개 × 12 뉴런
            </text>
          </motion.g>

          {/* Deep & Narrow (step 1) */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }} transition={sp}>
            <text x={220} y={12} fontSize={9} fontWeight={600} fill="var(--foreground)">Deep & Narrow</text>
            {[240, 275, 310, 345, 380].map((x, li) =>
              drawLayer(x, 4, '#10b981', step, step === 1)
            )}
            {drawLayer(210, 3, '#6366f1', step, step === 1)}
            {drawLayer(410, 3, '#6366f1', step, step === 1)}
            <text x={310} y={135} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              은닉층 5개 × 4 뉴런 = 총 20
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
