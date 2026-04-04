import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'PrepareProposal: 블록 빌드 시작', body: 'ABCI 2.0 훅. Octane이 geth에 engine_forkchoiceUpdatedV3 + PayloadAttributes 전송.' },
  { label: 'GetPayload: ExecutionPayload 수신', body: 'engine_getPayloadV3로 완성된 ExecutionPayload를 geth에서 수신. 이더리움 EL과 동일.' },
  { label: 'ProcessProposal: 블록 검증', body: '다른 검증자가 제안한 블록을 engine_newPayloadV3로 geth가 실행 및 검증.' },
  { label: 'FinalizeBlock: 상태 확정', body: 'engine_forkchoiceUpdatedV3(headHash)로 geth 상태 확정. Cosmos 모듈도 동시 업데이트.' },
];
const C = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'];
const NODES = [
  { name: 'CometBFT', x: 30, c: '#6366f1' },
  { name: 'Octane', x: 155, c: '#10b981' },
  { name: 'geth (EL)', x: 280, c: '#f59e0b' },
];
const FLOWS: [number, number][] = [[0, 1], [1, 2], [0, 1], [0, 1]];

export default function EngineIntegrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const [from, to] = FLOWS[step];
        return (
          <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* nodes */}
            {NODES.map((n, i) => {
              const active = i === from || i === to;
              return (
                <motion.g key={n.name}
                  animate={{ y: active ? -3 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <rect x={n.x} y={25} width={110} height={40} rx={8}
                    fill={n.c + (active ? '20' : '08')} stroke={n.c}
                    strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.3} />
                  <text x={n.x + 55} y={49} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={n.c}>{n.name}</text>
                </motion.g>
              );
            })}
            {/* animated arrow */}
            <motion.line key={`arrow-${step}`}
              x1={NODES[from].x + 110} y1={45}
              x2={NODES[to].x} y2={45}
              stroke={C[step]} strokeWidth={2.5}
              markerEnd="url(#octarr)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            {/* step label */}
            <motion.g key={`lbl-${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}>
              <rect x={80} y={85} width={240} height={30} rx={6}
                fill={C[step] + '12'} stroke={C[step]} strokeWidth={1.5} />
              <text x={200} y={104} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[step]}>
                {STEPS[step].label.split(': ')[0]}
              </text>
            </motion.g>
            {/* API call */}
            <motion.text key={`api-${step}`} x={200} y={135} textAnchor="middle"
              fontSize={9} fill="currentColor" fillOpacity={0.35}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {['forkchoiceUpdatedV3', 'getPayloadV3', 'newPayloadV3', 'forkchoiceUpdatedV3'][step]}
            </motion.text>
            <defs>
              <marker id="octarr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={C[step]} />
              </marker>
            </defs>
        </svg>
        );
      }}
    </StepViz>
  );
}
