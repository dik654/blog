import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './MEVFlowVizData';

const Box = ({ x, y, w, text, sub, color, show }: { x: number; y: number; w: number; text: string; sub?: string; color: string; show: boolean }) => (
  <motion.g animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
    <rect x={x} y={y} width={w} height={40} rx={6} fill={`${color}15`} stroke={color} strokeWidth={1.2} />
    <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={11} fontWeight="600" fill={color}>{text}</text>
    {sub && <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize={10} fill={color}>{sub}</text>}
  </motion.g>
);

const Arr = ({ x1, y1, x2, y2, color, show, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number }) => (
  show ? <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5}
    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay }} /> : null
);

export default function MEVFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Main flow */}
          <Box x={10} y={70} w={80} text="Searcher" sub="MEV 번들" color={C.searcher} show={s >= 1} />
          <Box x={120} y={70} w={80} text="Builder" sub="블록 빌드" color={C.builder} show={s >= 2} />
          <Box x={230} y={70} w={80} text="Relay" sub="입찰 검증" color={C.relay} show={s >= 3} />
          <Box x={340} y={70} w={100} text="Proposer" sub="블록 선택" color={C.proposer} show={s >= 4} />

          {/* ETH values on arrows */}
          {s >= 2 && <text x={105} y={65} textAnchor="middle" fontSize={9} fill={C.searcher}>~0.01 ETH</text>}
          {s >= 3 && <text x={215} y={65} textAnchor="middle" fontSize={9} fill={C.builder}>bid 0.05 ETH</text>}
          {s >= 4 && <text x={325} y={65} textAnchor="middle" fontSize={9} fill={C.relay}>최고가 전달</text>}

          <Arr x1={90} y1={90} x2={118} y2={90} color={C.searcher} show={s >= 1} />
          <Arr x1={200} y1={90} x2={228} y2={90} color={C.builder} show={s >= 2} delay={0.15} />
          <Arr x1={310} y1={90} x2={338} y2={90} color={C.relay} show={s >= 3} delay={0.3} />

          {/* Local build fallback */}
          {s >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={340} y={140} width={100} height={36} rx={5} fill={`${C.local}12`} stroke={C.local} strokeWidth={1} strokeDasharray="4" />
              <text x={390} y={156} textAnchor="middle" fontSize={11} fontWeight="600" fill={C.local}>Local Build</text>
              <text x={390} y={168} textAnchor="middle" fontSize={10} fill={C.local}>fallback</text>
              <line x1={390} y1={110} x2={390} y2={138} stroke={C.proposer} strokeWidth={0.8} strokeDasharray="3" />
              <text x={420} y={130} fontSize={10} fill={C.proposer}>vs</text>
            </motion.g>
          )}

          {/* Step 5: Reth vs Geth comparison */}
          {s === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={150} width={180} height={40} rx={6} fill="#10b98112" stroke="#10b981" strokeWidth={1} />
              <text x={120} y={166} textAnchor="middle" fontSize={11} fontWeight="600" fill="#10b981">Reth: trait impl 교체</text>
              <text x={120} y={180} textAnchor="middle" fontSize={10} fill="#10b981">PayloadBuilder → MevPayloadBuilder</text>

              <rect x={240} y={150} width={120} height={40} rx={6} fill="#94a3b812" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4" />
              <text x={300} y={166} textAnchor="middle" fontSize={11} fontWeight="600" fill="#94a3b8">Geth: mev-boost</text>
              <text x={300} y={180} textAnchor="middle" fontSize={10} fill="#94a3b8">별도 sidecar 프로세스</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
