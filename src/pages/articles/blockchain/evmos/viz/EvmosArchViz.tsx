import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Application Layer', body: 'Solidity 스마트 컨트랙트와 dApp이 실행되는 최상위 레이어.' },
  { label: 'EVM Layer', body: 'go-ethereum 포크 기반 EVM. Cosmos StateDB와 연동됩니다.' },
  { label: 'Cosmos SDK Layer', body: 'Keeper, Module, State 관리. ERC20/FeeMarket 모듈 포함.' },
  { label: 'Consensus Layer', body: 'CometBFT v0.38. Tendermint BFT 합의로 블록을 확정합니다.' },
];

const LAYERS = [
  { y: 14, label: 'Smart Contracts / dApps', c: '#8b5cf6' },
  { y: 48, label: 'EVM (go-ethereum fork)', c: '#0ea5e9' },
  { y: 82, label: 'Cosmos SDK (Modules, Keepers)', c: '#10b981' },
  { y: 116, label: 'CometBFT Consensus', c: '#f59e0b' },
];

export default function EvmosArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 152" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const active = i === step;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}>
                <rect x={50} y={l.y} width={300} height={28} rx={6}
                  fill={l.c + (active ? '18' : '08')} stroke={l.c}
                  strokeWidth={active ? 1.5 : 0.7}
                  strokeOpacity={active ? 0.8 : 0.2} />
                <text x={200} y={l.y + 17} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={l.c}>{l.label}</text>
                {i < 3 && (
                  <line x1={200} y1={l.y + 28} x2={200} y2={l.y + 34}
                    stroke="currentColor" strokeWidth={0.5} strokeOpacity={0.12} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
