import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. State root 가져오기', body: 'storage.GetStateRoot(round-1) — 이전 라운드 상태 루트.\nMKVS 의 versioned root.' },
  { label: '2. Runtime 에 ExecuteTxBatch IPC 요청', body: 'BlockInfo + IORoot + StateRoot + Inputs 전달.\nTEE 안에서 결정적 실행.' },
  { label: '3. Commitment 생성·서명', body: '결과로 IORoot/StateRoot/Messages 받음.\nRAK 로 서명, P2P 위원회에 전파.' },
  { label: '4. 2/3 commit 수집 → Roothash 제출', body: 'P2P gossip 으로 commit 수집.\n2/3 도달 → Roothash module 에 commit, Consensus 가 finalize.' },
];

const PHASES = [
  { name: 'GetStateRoot',    color: '#6366f1' },
  { name: 'ExecuteTxBatch',  color: '#10b981' },
  { name: 'sign+gossip',     color: '#f59e0b' },
  { name: 'submit Roothash', color: '#a855f7' },
];

export default function ExecutorBatchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const x = 25 + i * 110;
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.65 : 0.3 }}>
                  <ActionBox x={x} y={30} w={100} h={40} label={p.name} color={p.color} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={x + 100} y1={50} x2={x + 110} y2={50}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }} />
                )}
              </g>
            );
          })}

          {/* Step 0 — fetch state root */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={70} y={100} w={120} h={42} label="MKVS storage" color="#6366f1" />
              <DataBox x={210} y={108} w={150} h={26}
                label="root[round-1]" color="#6366f1" outlined />
            </motion.g>
          )}

          {/* Step 1 — execute */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={50}  y={100} w={130} h={42}
                label="Executor (Host)" color="#3b82f6" />
              <ModuleBox x={310} y={100} w={130} h={42}
                label="Runtime (TEE)" color="#ec4899" />
              <motion.line x1={180} y1={121} x2={310} y2={121}
                stroke="#10b981" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x={245} y={114} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                ExecuteTxBatch
              </text>
              <text x={245} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                IORoot · StateRoot · Inputs
              </text>
            </motion.g>
          )}

          {/* Step 2 — commit + gossip */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={30} y={105} w={170} h={32}
                label="Commitment{IORoot, State, Msg}" color="#f59e0b" outlined />
              <text x={115} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                signed by RAK
              </text>
              <ModuleBox x={250} y={100} w={180} h={42} label="P2P gossip" sub="committee peers" color="#f59e0b" />
              <motion.line x1={200} y1={121} x2={250} y2={121}
                stroke="#f59e0b" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.g>
          )}

          {/* Step 3 — collection + roothash */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3].map((vi) => {
                const x = 50 + vi * 70;
                const has = vi < 3; // 3/4 = ≥ 2/3
                return (
                  <g key={vi}>
                    <DataBox x={x} y={100} w={50} h={26}
                      label={has ? '✓' : '...'} color={has ? '#10b981' : '#94a3b8'}
                      outlined={has} />
                  </g>
                );
              })}
              <text x={170} y={150} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                3 / 4 ≥ 2/3 → submit
              </text>
              <ModuleBox x={310} y={100} w={140} h={42}
                label="Roothash module" color="#a855f7" />
              <motion.line x1={250} y1={113} x2={310} y2={113}
                stroke="#a855f7" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.g>
          )}

          <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            Executor.processBatch — go/worker/compute/executor/committee/node.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
