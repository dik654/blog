import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '~/.config/oasis/cli.toml — 단일 설정 파일', body: '모든 네트워크/wallet 정보를 TOML 한 파일에 기록.\nCLI 가 자동 로드, --config 로 override.' },
  { label: '[networks.mainnet] — chain 정보', body: 'chain_context: 네트워크 식별 hash.\nrpc: gRPC 엔드포인트.' },
  { label: '[networks.mainnet.paratimes.sapphire]', body: 'id: ParaTime ID (32B hex).\ndenomination_info: base_units + symbol.' },
  { label: '[wallets.alice] — 키 저장 위치', body: 'kind: file (또는 ledger / fs).\npath: 키파일 경로.' },
];

const SECTIONS = [
  { name: '[networks.mainnet]',                     y: 30,  color: '#6366f1' },
  { name: '  chain_context = "b11b369e..."',        y: 56,  color: '#6366f1', indent: true },
  { name: '  rpc = "grpc.oasis.io:443"',            y: 78,  color: '#6366f1', indent: true },
  { name: '[networks.mainnet.paratimes.sapphire]',  y: 110, color: '#10b981' },
  { name: '  id = "0000...e7279"',                  y: 136, color: '#10b981', indent: true },
  { name: '  denomination_info = ...',              y: 158, color: '#10b981', indent: true },
  { name: '[wallets.alice]',                        y: 188, color: '#a855f7' },
  { name: '  kind = "file"',                        y: 214, color: '#a855f7', indent: true },
];

const HIGHLIGHT = [
  [0, 1, 2, 3, 4, 5, 6, 7], // step 0 = all
  [0, 1, 2],
  [3, 4, 5],
  [6, 7],
];

export default function CliConfigTomlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={5} w={300} h={20}
            label="~/.config/oasis/cli.toml" color="#3b82f6" />

          {SECTIONS.map((s, i) => {
            const lit = HIGHLIGHT[step].includes(i);
            return (
              <motion.g key={s.name} animate={{ opacity: lit ? 1 : 0.3 }}>
                <DataBox x={20} y={s.y} w={300} h={20}
                  label={s.name} color={s.color} outlined={lit && step !== 0} />
              </motion.g>
            );
          })}

          {/* per step right side */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={400} y={50} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                단일 TOML
              </text>
              <text x={400} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                CLI 자동 로드
              </text>
              <text x={400} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                --config override
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={340} y={50} w={130} h={28}
                label="chain_context" color="#6366f1" outlined />
              <DataBox x={340} y={85} w={130} h={28}
                label="rpc endpoint" color="#6366f1" outlined />
              <text x={405} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                네트워크 식별
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={340} y={130} w={130} h={28}
                label="ParaTime ID" color="#10b981" outlined />
              <DataBox x={340} y={165} w={130} h={28}
                label="denom info" color="#10b981" outlined />
              <text x={405} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ParaTime 단위·심볼
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={340} y={195} w={130} h={28}
                label="kind: file/ledger" color="#a855f7" outlined />
              <text x={405} y={234} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                키 저장 방식
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
