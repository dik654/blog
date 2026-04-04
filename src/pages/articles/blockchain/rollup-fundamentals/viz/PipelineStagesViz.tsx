import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Pull 체인: 뒤에서 앞으로 함수 호출' },
  { label: '① L1Traversal → L1Retrieval' },
  { label: '② FrameQueue → ChannelBank' },
  { label: '③ ChannelReader → BatchQueue → AttributesQueue' },
];

/* colors */
const Cs = ['#6366f1','#3b82f6','#0ea5e9','#10b981','#14b8a6','#f59e0b','#ec4899'];

/* Each stage: name, method called, input type, output type */
const CHAIN = [
  { name: 'L1Traversal',    method: 'AdvanceL1Block()', input: 'L1 RPC',        output: 'L1BlockRef' },
  { name: 'L1Retrieval',    method: 'NextData()',        input: 'L1BlockRef',    output: 'calldata/blob bytes' },
  { name: 'FrameQueue',     method: 'NextFrame()',       input: 'raw bytes',     output: 'Frame{id,data}' },
  { name: 'ChannelBank',    method: 'NextData()',        input: 'Frame[]',       output: 'Channel (완성)' },
  { name: 'ChannelReader',  method: 'NextBatch()',       input: 'Channel',       output: 'Batch (압축해제)' },
  { name: 'BatchQueue',     method: 'NextBatch()',       input: 'Batch',         output: 'SingularBatch' },
  { name: 'AttributesQueue',method: 'NextAttributes()',  input: 'SingularBatch', output: 'PayloadAttributes' },
];

export default function PipelineStagesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <PullChainOverview />}
          {step === 1 && <StageDetail from={0} to={1} />}
          {step === 2 && <StageDetail from={2} to={3} />}
          {step === 3 && <StageDetail from={4} to={6} />}
        </svg>
      )}
    </StepViz>
  );
}

function PullChainOverview() {
  return (
    <g>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={600}
        fill="var(--foreground)">Pull 체인: 뒤에서 앞으로 함수를 호출한다</text>
      {CHAIN.map((s, i) => {
        const y = 28 + i * 26;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <rect x={20} y={y} width={110} height={20} rx={4}
              fill={`${Cs[i]}15`} stroke={Cs[i]} strokeWidth={1} />
            <text x={75} y={y + 14} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={Cs[i]}>{s.name}</text>
            <text x={140} y={y + 14} fontSize={9} fill="var(--muted-foreground)">
              .{s.method}
            </text>
            <text x={290} y={y + 14} fontSize={9} fill={Cs[i]}>
              → {s.output}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={216} textAnchor="middle" fontSize={10} fill="#ec4899"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        ← Pull: AttributesQueue.NextAttributes()가 체인의 시작점
      </motion.text>
    </g>
  );
}

function StageDetail({ from, to }: { from: number; to: number }) {
  const stages = CHAIN.slice(from, to + 1);
  return (
    <g>
      {stages.map((s, i) => {
        const idx = from + i;
        const y = 20 + i * 65;
        return (
          <motion.g key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}>
            <rect x={20} y={y} width={440} height={52} rx={6}
              fill={`${Cs[idx]}08`} stroke={Cs[idx]} strokeWidth={1.2} />
            <text x={30} y={y + 18} fontSize={12} fontWeight={700} fill={Cs[idx]}>{s.name}</text>
            <text x={30} y={y + 35} fontSize={10} fill="var(--foreground)">
              {s.method}  입력: {s.input}
            </text>
            <text x={30} y={y + 48} fontSize={10} fill={Cs[idx]}>
              출력: {s.output}
            </text>
            {i < stages.length - 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 + 0.1 }}>
                <line x1={240} y1={y + 52} x2={240} y2={y + 65}
                  stroke={Cs[idx]} strokeWidth={1} />
                <polygon points={`236,${y + 63} 244,${y + 63} 240,${y + 68}`}
                  fill={Cs[idx]} />
              </motion.g>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}
