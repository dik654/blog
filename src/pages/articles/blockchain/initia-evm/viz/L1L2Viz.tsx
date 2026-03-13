import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

const C = { l1: '#6366f1', evm: '#0ea5e9', move: '#10b981', wasm: '#f59e0b', bridge: '#ec4899' };

const STEPS = [
  { label: 'Initia L1: Cosmos SDK + MoveVM 기반 메인 체인', body: 'Initia L1은 합의, 결산, IBC 허브 역할을 수행합니다. MoveVM 기반으로 스마트 컨트랙트를 실행하며, 모든 Minitia L2의 보안을 파생합니다.' },
  { label: 'Minitia L2: EVM/MoveVM/WasmVM 선택 가능한 롤업', body: '각 Minitia는 용도에 맞는 VM을 선택할 수 있습니다. MiniEVM, MiniMove, MiniWasm 중 하나를 사용하여 L2 롤업을 구성합니다.' },
  { label: 'OPinit: 옵티미스틱 브릿지로 L1↔L2 통신', body: 'OPinit Stack은 Optimistic Rollup 보안 레이어로, L1과 L2 간 상태 검증과 메시지 전달을 담당합니다. 이의 제기(dispute) 메커니즘으로 안전성을 보장합니다.' },
  { label: 'Enshrined Liquidity: L1에서 직접 유동성 공급', body: 'L1에 내장된 유동성 프로토콜로, L2 간 유동성 파편화를 해결합니다. 모든 Minitia가 L1의 공유 유동성 풀에 접근할 수 있습니다.' },
];

function L1Box({ highlight }: { highlight: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <rect x={100} y={10} width={200} height={55} rx={8}
        fill={highlight ? `${C.l1}22` : `${C.l1}11`}
        stroke={C.l1} strokeWidth={highlight ? 2.5 : 1.5} />
      <text x={200} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.l1}>
        Initia L1
      </text>
      <text x={200} y={50} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">
        Cosmos SDK + MoveVM + IBC Hub
      </text>
    </motion.g>
  );
}

function BridgeLabel({ show }: { show: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0.2 }}
      transition={{ duration: 0.3 }}
    >
      <rect x={155} y={75} width={90} height={22} rx={4}
        fill={show ? `${C.bridge}22` : `${C.bridge}08`}
        stroke={C.bridge} strokeWidth={show ? 1.5 : 0.5} />
      <text x={200} y={90} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.bridge}>
        OPinit Bridge
      </text>
    </motion.g>
  );
}

function L2Box({ x, label, vm, color, highlight, delay }: {
  x: number; label: string; vm: string; color: string; highlight: boolean; delay: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {/* Connection line */}
      <motion.line
        x1={200} y1={65} x2={x + 55} y2={110}
        stroke={highlight ? color : 'hsl(var(--border))'}
        strokeWidth={highlight ? 1.5 : 1}
        strokeDasharray={highlight ? 'none' : '3 2'}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      />
      <rect x={x} y={110} width={110} height={50} rx={8}
        fill={highlight ? `${color}22` : `${color}11`}
        stroke={color} strokeWidth={highlight ? 2.5 : 1.5} />
      <text x={x + 55} y={132} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>
        {label}
      </text>
      <text x={x + 55} y={148} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
        {vm}
      </text>
    </motion.g>
  );
}

function LiquidityLayer({ show }: { show: boolean }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0.15 }}
      transition={{ duration: 0.4 }}
    >
      <rect x={30} y={175} width={340} height={24} rx={6}
        fill={show ? `${C.l1}15` : `${C.l1}05`}
        stroke={C.l1} strokeWidth={show ? 1.5 : 0.5} strokeDasharray="4 2" />
      <text x={200} y={191} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={show ? C.l1 : 'hsl(var(--muted-foreground))'}>
        Enshrined Liquidity Pool
      </text>
    </motion.g>
  );
}

export default function L1L2Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step: number) => (
        <svg viewBox="0 0 400 210" className="w-full max-w-[520px]" role="img">
          <L1Box highlight={step === 0} />
          <BridgeLabel show={step === 2} />
          <L2Box x={30} label="Minitia EVM" vm="MiniEVM" color={C.evm}
            highlight={step === 1} delay={0} />
          <L2Box x={145} label="Minitia Move" vm="MiniMove" color={C.move}
            highlight={step === 1} delay={0.1} />
          <L2Box x={260} label="Minitia Wasm" vm="MiniWasm" color={C.wasm}
            highlight={step === 1} delay={0.2} />
          <LiquidityLayer show={step === 3} />
        </svg>
      )}
    </StepViz>
  );
}
