import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const COLS = [60, 130, 200, 270]; // rounds r1-r4
const ROWS = [25, 50, 75]; // 3 validators
const R = 8;
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const ROUND_LABELS = ['R1 투표', 'R2 앵커', 'R3 투표', 'R4 앵커'];

const STEPS = [
  { label: 'Wave 1: R1 투표 Vertex 생성', body: '각 검증자가 라운드 1에서 vertex를 생성합니다. 이전 라운드 인증서를 부모로 참조.' },
  { label: 'R2 앵커 선출', body: '짝수 라운드에서 결정론적으로 리더 vertex를 앵커로 선출. 2f+1 참조가 필요합니다.' },
  { label: 'Wave 2: R3 투표 진행', body: 'R3 vertex들이 R2 앵커를 참조하여 투표를 수행합니다. f+1 이상이면 커밋 가능.' },
  { label: 'R4 앵커 커밋 + 인과 정렬', body: '두 번째 앵커 선출 후 인과 히스토리(BFS)로 미커밋 vertex를 선형화합니다.' },
];

export default function BullsharkWaveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 105" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* round labels */}
          {COLS.map((cx, ri) => (
            <text key={ri} x={cx} y={12} textAnchor="middle" fontSize={10}
              fontWeight={600} fill={ri <= step ? COLORS[ri] : 'var(--muted-foreground)'} opacity={ri <= step ? 1 : 0.3}>
              {ROUND_LABELS[ri]}
            </text>
          ))}
          {/* wave boundary lines */}
          {[165, 235].map((lx, wi) => (
            <motion.line key={wi} x1={lx} y1={16} x2={lx} y2={90}
              stroke="#ef4444" strokeWidth={0.8} strokeDasharray="3 2"
              animate={{ opacity: step >= (wi === 0 ? 1 : 3) ? 0.5 : 0 }} transition={sp} />
          ))}
          {/* vertices (nodes) */}
          {COLS.map((cx, ri) =>
            ROWS.map((cy, vi) => {
              const visible = ri <= step;
              const isAnchor = (ri === 1 || ri === 3) && vi === 0;
              const committed = step === 3 && ri <= 1;
              return (
                <motion.g key={`${ri}-${vi}`} animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                  <motion.circle cx={cx} cy={cy} r={R}
                    animate={{
                      fill: committed ? '#10b98140' : isAnchor && visible ? `${COLORS[ri]}30` : `${COLORS[ri]}10`,
                      stroke: committed ? '#10b981' : COLORS[ri],
                      strokeWidth: isAnchor && visible ? 2.5 : 1,
                    }} transition={sp} />
                  {isAnchor && visible && (
                    <motion.text x={cx} y={cy + 3} textAnchor="middle" fontSize={10}
                      fill={COLORS[ri]} fontWeight={600} initial={{ scale: 0 }} animate={{ scale: 1 }}>A</motion.text>
                  )}
                  {/* edges to previous round */}
                  {ri > 0 && visible && ROWS.map((py, pi) => (
                    <motion.line key={pi} x1={cx - R} y1={cy} x2={COLS[ri - 1] + R} y2={py}
                      stroke="var(--border)" strokeWidth={0.5}
                      animate={{ opacity: ri <= step ? 0.3 : 0 }} transition={sp} />
                  ))}
                </motion.g>
              );
            })
          )}
          {/* commit flash */}
          {step === 3 && (
            <motion.text x={95} y={98} textAnchor="middle" fontSize={10} fill="#10b981" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>COMMITTED</motion.text>
          )}
          {/* validator labels */}
          {ROWS.map((cy, i) => (
            <text key={i} x={20} y={cy + 3} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">V{i + 1}</text>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
