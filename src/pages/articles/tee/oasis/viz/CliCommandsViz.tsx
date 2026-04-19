import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'network — testnet/mainnet 등록·전환', body: 'oasis network add / list / set-default.\nWebSocket gRPC URL 기준.' },
  { label: 'wallet — 키 생성·관리', body: 'create / list / import-bip39 / export.\n알고리즘: ed25519 default, secp256k1 옵션.' },
  { label: 'account — 잔액·논스·조회', body: 'show / balance / nonce.\n다양한 네트워크 지원, --network 플래그.' },
  { label: 'transaction — 전송·위임', body: 'transfer / delegate / undelegate.\n스테이킹·언본딩 지원.' },
  { label: 'paratime — Sapphire 등 ParaTime 상호작용', body: 'list / show / deposit / withdraw.\nCompatibility: contracts deploy / call.' },
];

const GROUPS = [
  { name: 'network',     color: '#6366f1', cmds: ['add', 'list', 'set-default']                  },
  { name: 'wallet',      color: '#10b981', cmds: ['create', 'list', 'import-bip39', 'export']     },
  { name: 'account',     color: '#f59e0b', cmds: ['show', 'balance', 'nonce']                     },
  { name: 'transaction', color: '#a855f7', cmds: ['transfer', 'delegate', 'undelegate']           },
  { name: 'paratime',    color: '#ec4899', cmds: ['list', 'show', 'deposit', 'withdraw', 'call']  },
];

export default function CliCommandsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* CLI root */}
          <ModuleBox x={180} y={15} w={120} h={36} label="oasis CLI" sub="cobra root" color="#3b82f6" />

          {GROUPS.map((g, i) => {
            const x = 20 + i * 90;
            const active = step === i;
            return (
              <g key={g.name}>
                <motion.g animate={{ opacity: active ? 1 : 0.4 }}>
                  <ModuleBox x={x} y={75} w={80} h={36}
                    label={g.name} color={g.color} />
                </motion.g>
                {/* connector */}
                <motion.line x1={240} y1={51} x2={x + 40} y2={75}
                  stroke={active ? g.color : 'var(--border)'} strokeWidth={0.7}
                  strokeDasharray="3,2"
                  animate={{ opacity: active ? 1 : 0.3 }} />
                {/* sub-commands */}
                {active && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {g.cmds.map((c, ci) => (
                      <DataBox key={c} x={x - 5} y={120 + ci * 26} w={90} h={22}
                        label={c} color={g.color} outlined />
                    ))}
                  </motion.g>
                )}
              </g>
            );
          })}

          <text x={240} y={232} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            계층적 명령어 — Go + Cobra
          </text>
        </svg>
      )}
    </StepViz>
  );
}
