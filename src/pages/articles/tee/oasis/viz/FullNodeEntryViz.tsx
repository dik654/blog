import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. 설정 로드', body: 'config.GlobalConfig 에서 노드 모드·네트워크·런타임 설정 읽음.' },
  { label: '2. Common 인프라 초기화', body: 'Identity·P2P·IPC 등 공통 서비스를 commonSvc 로 묶음 — 모든 역할에 공유.' },
  { label: '3. Consensus 백엔드 시작', body: 'CometBFT (구 Tendermint) 인스턴스 기동 — ABCI 멀티플렉서 연결.' },
  { label: '4. Runtime Host (모드별)', body: 'cfg.Runtime.Mode == Compute 일 때만 Runtime Host 기동 — Validator-only 노드는 skip.' },
  { label: '5. 역할 조합으로 노드 구성', body: 'Validator-only / Compute+Consensus / Storage / Client — 역할 조합으로 결정.' },
];

const STAGES = [
  { x: 30, label: 'Config', sub: 'load yaml', color: '#6366f1' },
  { x: 130, label: 'Common', sub: 'Id·P2P·IPC', color: '#3b82f6' },
  { x: 230, label: 'Consensus', sub: 'CometBFT', color: '#10b981' },
  { x: 330, label: 'Runtime', sub: 'host (opt)', color: '#f59e0b' },
];

export default function FullNodeEntryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {STAGES.map((s, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <g key={s.label}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.65 : 0.3 }}>
                  <ActionBox x={s.x} y={50} w={90} h={42} label={s.label} sub={s.sub} color={s.color} />
                </motion.g>
                {i < STAGES.length - 1 && (
                  <motion.line x1={s.x + 90} y1={71} x2={s.x + 100} y2={71}
                    stroke={done ? s.color : 'var(--border)'} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }}
                    transition={{ duration: 0.3 }} />
                )}
              </g>
            );
          })}

          {/* Step-specific overlays */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={335} y={105} w={80} h={22} label="if Compute" color="#f59e0b" outlined />
              <text x={375} y={140} fontSize={9} textAnchor="middle" fill="var(--muted-foreground)">
                else: skip
              </text>
            </motion.g>
          )}

          {/* Final composition (step 4) */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <ModuleBox x={20} y={140} w={100} h={50}
                label="Validator" sub="cons only" color="#6366f1" />
              <ModuleBox x={130} y={140} w={110} h={50}
                label="Compute" sub="cons + runtime" color="#10b981" />
              <ModuleBox x={250} y={140} w={100} h={50}
                label="Storage" sub="cons + MKVS" color="#a855f7" />
              <ModuleBox x={360} y={140} w={100} h={50}
                label="Client" sub="rpc gateway" color="#3b82f6" />
            </motion.g>
          )}

          {/* Top label */}
          <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">node.Run() — 진입점</text>
          <text x={240} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            go/oasis-node/cmd/node/node.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
