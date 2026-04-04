import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './ExExFlowVizData';

const Box = ({ x, y, w, h, text, sub, color, show }: { x: number; y: number; w: number; h: number; text: string; sub?: string; color: string; show: boolean }) => (
  <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
    <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}15`} stroke={color} strokeWidth={1.2} />
    <text x={x + w / 2} y={y + h / 2 - (sub ? 3 : 0)} textAnchor="middle" fontSize={11} fontWeight="600" fill={color}>{text}</text>
    {sub && <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize={10} fill={color}>{sub}</text>}
  </motion.g>
);

export default function ExExFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Box x={20} y={80} w={100} h={44} text="Pipeline" sub="블록 실행" color={C.pipeline} show={s >= 1} />
          <Box x={170} y={80} w={100} h={44} text="ExExManager" sub="fan-out" color={C.manager} show={s >= 2} />

          {/* fan-out arrows */}
          {s >= 1 && (
            <motion.line x1={120} y1={102} x2={168} y2={102} stroke={C.pipeline} strokeWidth={1.5}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          )}

          {/* ExEx targets */}
          <Box x={330} y={20} w={120} h={36} text="Indexer ExEx" sub="TX/로그 인덱싱" color={C.indexer} show={s >= 3} />
          <Box x={330} y={82} w={120} h={36} text="Bridge ExEx" sub="크로스체인 릴레이" color={C.bridge} show={s >= 3} />
          <Box x={330} y={144} w={120} h={36} text="Analytics ExEx" sub="실시간 통계" color={C.analytics} show={s >= 3} />

          {/* fan-out lines */}
          {s >= 2 && [38, 100, 162].map((y, i) => (
            <motion.line key={i} x1={270} y1={102} x2={328} y2={y}
              stroke={C.manager} strokeWidth={1} strokeDasharray="4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} />
          ))}

          {/* FinishedHeight feedback */}
          {s === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[56, 118, 180].map((y, i) => (
                <motion.line key={i} x1={330} y1={y} x2={270} y2={130}
                  stroke={[C.indexer, C.bridge, C.analytics][i]} strokeWidth={0.8} strokeDasharray="3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }} />
              ))}
              <rect x={180} y={130} width={80} height={22} rx={4} fill={`${C.manager}20`} stroke={C.manager} strokeWidth={1} />
              <text x={220} y={144} textAnchor="middle" fontSize={10} fontWeight="600" fill={C.manager}>min(heights)</text>
            </motion.g>
          )}

          {/* Notification bubble */}
          {s >= 1 && (
            <motion.circle r={4} fill={C.pipeline}
              animate={{ cx: [125, 165], cy: [102, 102] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
