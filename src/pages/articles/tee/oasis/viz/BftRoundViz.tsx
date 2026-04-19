import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. PROPOSE — 제안자가 블록 제안', body: 'VRF 로 선출된 proposer 가 헤더+tx 전파.\n타임아웃 3초 — 안 오면 round++.' },
  { label: '2. PREVOTE — 검증인 투표', body: '유효한 블록이면 PREVOTE for hash, 아니면 PREVOTE for nil.\n2/3 도달 시 polka 형성.' },
  { label: '3. PRECOMMIT — polka 확인 후', body: 'polka 보면 PRECOMMIT for hash.\n2/3 precommit → commit 준비, 실패 시 round++.' },
  { label: '4. COMMIT — 최종 확정', body: '2/3 precommit 수집 → 블록 애플리케이션에 deliver.\nVoting power 기준 (head-count 아님), 즉시 확정.' },
];

const PHASES = [
  { name: 'PROPOSE',   color: '#6366f1', x: 30  },
  { name: 'PREVOTE',   color: '#10b981', x: 140 },
  { name: 'PRECOMMIT', color: '#f59e0b', x: 250 },
  { name: 'COMMIT',    color: '#a855f7', x: 360 },
];

export default function BftRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PHASES.map((p, i) => {
            const active = step === i;
            const done = step > i;
            return (
              <g key={p.name}>
                <motion.g animate={{ opacity: active ? 1 : done ? 0.7 : 0.3 }}>
                  <ActionBox x={p.x} y={30} w={90} h={42}
                    label={p.name} color={p.color}
                    sub={i === 0 ? '3s timeout' : i === 1 ? 'polka' : i === 2 ? '2/3 vote' : 'finalize'} />
                </motion.g>
                {i < PHASES.length - 1 && (
                  <motion.line x1={p.x + 90} y1={51} x2={p.x + 100} y2={51}
                    stroke={done ? p.color : 'var(--border)'} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: done || active ? 1 : 0 }}
                    transition={{ duration: 0.3 }} />
                )}
              </g>
            );
          })}

          {/* Validators */}
          {[0, 1, 2, 3].map((vi) => {
            const x = 80 + vi * 90;
            const isProposer = vi === 0;
            return (
              <g key={`v-${vi}`}>
                <motion.circle cx={x} cy={120} r={11}
                  fill={isProposer && step === 0 ? '#6366f1' : 'var(--card)'}
                  stroke={isProposer ? '#6366f1' : 'var(--border)'} strokeWidth={1} />
                <text x={x} y={124} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={isProposer && step === 0 ? 'white' : 'var(--foreground)'}>
                  V{vi}
                </text>
              </g>
            );
          })}

          {/* Vote arrows in step 1 (prevote) and 2 (precommit) */}
          {(step === 1 || step === 2) && (
            <>
              {[1, 2, 3].map((vi) => {
                const x = 80 + vi * 90;
                return (
                  <motion.g key={`vote-${vi}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: vi * 0.1 }}>
                    <line x1={x} y1={132} x2={x} y2={155}
                      stroke={step === 1 ? '#10b981' : '#f59e0b'} strokeWidth={1.2} />
                    <DataBox x={x - 30} y={158} w={60} h={20}
                      label={step === 1 ? 'prevote' : 'precommit'}
                      color={step === 1 ? '#10b981' : '#f59e0b'} outlined />
                  </motion.g>
                );
              })}
            </>
          )}

          {/* commit step result */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <DataBox x={150} y={150} w={180} h={32}
                label="Block #N finalized" color="#a855f7" outlined />
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                voting_power ≥ 2/3 → no reorg possible
              </text>
            </motion.g>
          )}

          {/* failure case overlay (step 2) */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.6 }}>
              <AlertBox x={350} y={195} w={120} h={20} label="< 2/3 → round++" color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
