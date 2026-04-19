import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '정상 — 3 executor 가 동일 결과', body: 'IORoot=X, StateRoot=Y 모두 일치.\n2/3 agreement → Roothash finalize.' },
  { label: '비정상 — 한 executor 가 다른 결과', body: 'executor2 가 StateRoot=Z 제출.\n결정적 실행이라 차이가 나면 buggy 또는 attacker.' },
  { label: 'Discrepancy resolution mode', body: 'Backup committee 가 재실행.\nBackup 의 결과로 정상 그룹 결정.' },
  { label: 'Slashing — 잘못된 executor 처벌', body: 'stake 일부 소각 + 다음 epoch 선출 제외.\nTEE fault = economic penalty.' },
];

const EXEC = [
  { name: 'executor1', x: 30,  good: true },
  { name: 'executor2', x: 170, good: 'bad' },
  { name: 'executor3', x: 310, good: true },
];

export default function DiscrepancyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Executors */}
          {EXEC.map((e, i) => {
            const isMismatch = e.good === 'bad' && step >= 1;
            const color = isMismatch ? '#ef4444' : '#10b981';
            return (
              <g key={e.name}>
                <ModuleBox x={e.x} y={20} w={140} h={50}
                  label={e.name} sub="executor" color={color} />
                <DataBox x={e.x + 5} y={85} w={130} h={26}
                  label={isMismatch ? 'IORoot=X State=Z' : 'IORoot=X State=Y'}
                  color={color} outlined={step <= 1} />
                {isMismatch && step === 1 && (
                  <motion.text x={e.x + 70} y={130} textAnchor="middle"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    fontSize={11} fill="#ef4444" fontWeight={700}>
                    ✗ mismatch
                  </motion.text>
                )}
              </g>
            );
          })}

          {/* Step 0: agreement */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={140} w={180} h={50}
                label="2/3 agreement" sub="finalize" color="#10b981" />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                Roothash → Consensus commit
              </text>
            </motion.g>
          )}

          {/* Step 1: detect */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertBox x={140} y={140} w={200} h={50}
                label="Discrepancy detected" sub="결과 불일치" color="#ef4444" />
            </motion.g>
          )}

          {/* Step 2: backup committee */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={130} w={140} h={36}
                label="enter resolution" color="#f59e0b" />
              <ModuleBox x={180} y={120} w={120} h={50}
                label="Backup committee" color="#a855f7" />
              <ActionBox x={320} y={130} w={140} h={36}
                label="re-execute" sub="determine truth" color="#a855f7" />
              <line x1={160} y1={148} x2={180} y2={148} stroke="#a855f7" strokeWidth={1.2} />
              <line x1={300} y1={148} x2={320} y2={148} stroke="#a855f7" strokeWidth={1.2} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Backup 결과로 어느 그룹이 옳은지 결정
              </text>
            </motion.g>
          )}

          {/* Step 3: slashing */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={170} y={130} w={140} h={50}
                label="executor2" sub="culprit" color="#ef4444" />
              <DataBox x={20}  y={195} w={140} h={28}
                label="stake burned" color="#ef4444" outlined />
              <DataBox x={170} y={195} w={140} h={28}
                label="excluded next epoch" color="#ef4444" outlined />
              <DataBox x={320} y={195} w={140} h={28}
                label="reputation drop" color="#ef4444" outlined />
              <text x={240} y={230} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={700}>
                결정적 TEE 실행 → 차이 = 명백한 fault
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
