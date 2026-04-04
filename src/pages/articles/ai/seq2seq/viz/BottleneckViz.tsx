import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, POINTS, ATTN_POINTS, LINE_C, ATTN_C, AXIS_C } from './BottleneckVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const W = 420, H = 140, PAD = 45;

function toXY(len: number, acc: number) {
  const x = PAD + ((len - 5) / 35) * (W - PAD - 20);
  const y = H - 20 - (acc / 40) * (H - 40);
  return { x, y };
}

function polyline(pts: { len: number; acc: number }[]) {
  return pts.map(p => { const { x, y } = toXY(p.len, p.acc); return `${x},${y}`; }).join(' ');
}

export default function BottleneckViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H + 10}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Y axis */}
          <line x1={PAD} y1={10} x2={PAD} y2={H - 18}
            stroke={AXIS_C} strokeWidth={1} />
          <text x={8} y={10} fontSize={11} fill={AXIS_C}>BLEU</text>
          {[0, 10, 20, 30].map(v => {
            const y = H - 20 - (v / 40) * (H - 40);
            return (
              <g key={v}>
                <line x1={PAD - 3} y1={y} x2={PAD} y2={y}
                  stroke={AXIS_C} strokeWidth={0.5} />
                <text x={PAD - 6} y={y + 3} textAnchor="end"
                  fontSize={11} fill={AXIS_C}>{v}</text>
              </g>
            );
          })}
          {/* X axis */}
          <line x1={PAD} y1={H - 18} x2={W - 10} y2={H - 18}
            stroke={AXIS_C} strokeWidth={1} />
          <text x={W / 2} y={H + 6} textAnchor="middle" fontSize={11}
            fill={AXIS_C}>문장 길이 (단어 수)</text>
          {[5, 10, 15, 20, 25, 30, 35, 40].map(v => {
            const { x } = toXY(v, 0);
            return (
              <g key={v}>
                <line x1={x} y1={H - 18} x2={x} y2={H - 15}
                  stroke={AXIS_C} strokeWidth={0.5} />
                <text x={x} y={H - 6} textAnchor="middle"
                  fontSize={11} fill={AXIS_C}>{v}</text>
              </g>
            );
          })}
          {/* Seq2Seq line */}
          <motion.polyline points={polyline(POINTS)}
            fill="none" stroke={LINE_C} strokeWidth={1.5}
            animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp} />
          {/* Highlight drop zone */}
          {step >= 1 && (
            <motion.rect x={toXY(20, 0).x - 5} y={10} width={W - toXY(20, 0).x - 5}
              height={H - 30} rx={4} fill={LINE_C} fillOpacity={0.06}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
          )}
          {/* Dots */}
          {POINTS.map((p, i) => {
            const { x, y } = toXY(p.len, p.acc);
            return (
              <motion.circle key={i} cx={x} cy={y} r={3}
                fill={LINE_C} animate={{ opacity: step >= 0 ? 1 : 0.3 }} />
            );
          })}
          {/* Attention line */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <polyline points={polyline(ATTN_POINTS)}
                fill="none" stroke={ATTN_C} strokeWidth={1.5} strokeDasharray="6 3" />
              {ATTN_POINTS.map((p, i) => {
                const { x, y } = toXY(p.len, p.acc);
                return <circle key={i} cx={x} cy={y} r={3} fill={ATTN_C} />;
              })}
            </motion.g>
          )}
          {/* Legend */}
          <line x1={W - 120} y1={14} x2={W - 100} y2={14}
            stroke={LINE_C} strokeWidth={1.5} />
          <text x={W - 96} y={17} fontSize={11} fill={LINE_C}>Seq2Seq</text>
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={W - 120} y1={26} x2={W - 100} y2={26}
                stroke={ATTN_C} strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={W - 96} y={29} fontSize={11} fill={ATTN_C}>+ Attention</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
