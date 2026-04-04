import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'tx', label: 'Cosmos TX', color: '#6366f1', x: 15 },
  { id: 'ante', label: 'AnteHandler', color: '#8b5cf6', x: 80 },
  { id: 'keeper', label: 'EVM Keeper', color: '#10b981', x: 145 },
  { id: 'statedb', label: 'StateDB', color: '#f59e0b', x: 210 },
  { id: 'evm', label: 'go-ethereum', color: '#ec4899', x: 275 },
  { id: 'commit', label: '상태 커밋', color: '#ef4444', x: 340 },
];

const EDGES = ['TX 제출', '검증 통과', '상태 매핑', 'EVM 컨텍스트', '실행 결과'];

const STEPS = [
  { label: 'Cosmos TX 수신', body: 'MsgCall(컨트랙트 호출) 또는 MsgCreate(배포) 메시지가 제출됩니다.' },
  { label: 'AnteHandler 검증', body: '가스 한도, 서명, nonce 등을 검증합니다. Cosmos SDK 표준 파이프라인입니다.' },
  { label: 'EVM Keeper 진입', body: 'x/evm 모듈의 Keeper가 EVM 실행 컨텍스트를 준비합니다.' },
  { label: 'StateDB 변환', body: 'Cosmos KV Store를 go-ethereum의 StateDB 인터페이스로 매핑합니다.' },
  { label: 'EVM 바이트코드 실행', body: 'go-ethereum의 EVM 인터프리터가 Solidity 바이트코드를 실행합니다.' },
  { label: '상태 커밋', body: 'EVM 실행 결과가 Cosmos의 IAVL Store에 영구 저장됩니다.' },
];

export default function MiniEVMExecFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 550 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Cosmos / EVM zone labels */}
          <rect x={10} y={70} width={125} height={18} rx={3} fill="#6366f108" stroke="#6366f130" strokeWidth={0.5} />
          <text x={72} y={82} textAnchor="middle" fontSize={9} fill="#6366f1" fontWeight={500}>Cosmos SDK</text>
          <rect x={270} y={70} width={130} height={18} rx={3} fill="#ec489908" stroke="#ec489930" strokeWidth={0.5} />
          <text x={335} y={82} textAnchor="middle" fontSize={9} fill="#ec4899" fontWeight={500}>go-ethereum EVM</text>

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
