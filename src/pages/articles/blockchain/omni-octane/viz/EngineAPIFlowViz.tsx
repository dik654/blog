import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'comet', label: 'CometBFT', color: '#6366f1', x: 15 },
  { id: 'abci', label: 'ABCI 브릿지', color: '#8b5cf6', x: 80 },
  { id: 'engine', label: 'Engine API', color: '#10b981', x: 145 },
  { id: 'geth', label: 'geth (EVM)', color: '#f59e0b', x: 210 },
  { id: 'xmsg', label: 'XMsg 릴레이', color: '#ec4899', x: 275 },
  { id: 'rollup', label: '대상 롤업', color: '#ef4444', x: 340 },
];

const EDGES = ['블록 제안', 'forkchoiceUpdated', 'newPayload', 'XMsg 이벤트', '메시지 전달'];

const STEPS = [
  { label: 'CometBFT 합의', body: 'Tendermint BFT 합의로 블록 높이를 결정합니다.' },
  { label: 'ABCI 브릿지', body: 'PrepareProposal에서 EVM 페이로드를 구성합니다. Cosmos와 EVM 사이의 번역 계층입니다.' },
  { label: 'Engine API 호출', body: '이더리움 표준 Engine API(forkchoiceUpdated)로 geth에 실행을 위임합니다.' },
  { label: 'geth EVM 실행', body: 'go-ethereum이 트랜잭션을 실행하고 상태를 업데이트합니다.' },
  { label: 'XMsg 크로스체인', body: 'EVM 실행 중 발생한 XMsg 이벤트를 Omni 합의로 검증합니다.' },
  { label: '대상 롤업 전달', body: '검증된 메시지가 Arbitrum, Optimism 등 대상 롤업에 전달됩니다.' },
];

export default function EngineAPIFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 550 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* zone labels */}
          <rect x={10} y={70} width={125} height={18} rx={3} fill="#6366f108" stroke="#6366f130" strokeWidth={0.5} />
          <text x={72} y={82} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight={500}>Cosmos 합의</text>
          <rect x={140} y={70} width={130} height={18} rx={3} fill="#10b98108" stroke="#10b98130" strokeWidth={0.5} />
          <text x={205} y={82} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={500}>EVM 실행</text>
          <rect x={270} y={70} width={130} height={18} rx={3} fill="#ec489908" stroke="#ec489930" strokeWidth={0.5} />
          <text x={335} y={82} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={500}>Cross-Rollup</text>

          {NODES.map((n, i) => {
            const show = i <= step;
            const active = i === step;
            return (
              <g key={n.id}>
                {i > 0 && i <= step && (
                  <motion.line x1={NODES[i - 1].x + 55} y1={42} x2={n.x} y2={42}
                    stroke={n.color} strokeWidth={i === step ? 1.8 : 1}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4 }} />
                )}
                {i > 0 && i <= step && (
                  <text x={(NODES[i - 1].x + 55 + n.x) / 2} y={34} textAnchor="middle"
                    fontSize={9} fill="var(--muted-foreground)">{EDGES[i - 1]}</text>
                )}
                <motion.rect x={n.x} y={28} width={55} height={28} rx={5}
                  animate={{ fill: `${n.color}${active ? '25' : show ? '12' : '06'}`,
                    stroke: n.color, strokeWidth: active ? 2 : show ? 1 : 0.5,
                    opacity: show ? 1 : 0.15 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + 27} y={46} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={n.color} opacity={show ? 1 : 0.2}>{n.label}</text>
                {active && (
                  <motion.rect x={n.x - 2} y={26} width={59} height={32} rx={7}
                    fill="none" stroke={n.color} strokeWidth={1.5}
                    animate={{ opacity: [0.6, 0.15, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1.5 }} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
