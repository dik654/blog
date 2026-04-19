import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '에포크 경계 도달 — height % 600 == 0', body: 'EndBlock 에서 600배수 height 감지 → 다음 5단계 일괄 실행.' },
  { label: '1) 새 Beacon 생성', body: 'beacon = VRF(prevBeacon, height) — 다음 epoch 무작위성 확정.' },
  { label: '2) Scheduler — 위원회 선출', body: 'compute / storage 위원회를 새 beacon 으로 선출.\n각 ParaTime 별 분리 선출.' },
  { label: '3) Registry · 4) Staking · 5) Governance', body: 'Registry: 활성 노드 갱신.\nStaking: 보상 분배 + slashing.\nGovernance: 만료 proposal 처리 → emit NewEpoch.' },
];

const TASKS = [
  { name: 'Beacon',     sub: 'VRF gen',     color: '#6366f1', y: 90  },
  { name: 'Scheduler',  sub: 'committees',  color: '#10b981', y: 122 },
  { name: 'Registry',   sub: 'epoch upd',   color: '#f59e0b', y: 154 },
  { name: 'Staking',    sub: 'rewards',     color: '#a855f7', y: 186 },
  { name: 'Governance', sub: 'proposals',   color: '#ec4899', y: 218 },
];

export default function EpochTransitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block height timeline */}
          <line x1={30} y1={40} x2={450} y2={40} stroke="var(--border)" strokeWidth={1} />
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 30 + i * 105;
            const isEpoch = i === 2;
            return (
              <g key={i}>
                <circle cx={x} cy={40} r={isEpoch ? 6 : 3}
                  fill={isEpoch ? '#6366f1' : 'var(--border)'}
                  stroke={isEpoch ? '#6366f1' : 'transparent'} />
                <text x={x} y={28} textAnchor="middle" fontSize={9}
                  fill={isEpoch ? '#6366f1' : 'var(--muted-foreground)'}
                  fontWeight={isEpoch ? 700 : 400}>
                  {i === 2 ? 'h=600' : `h=${i * 300}`}
                </text>
              </g>
            );
          })}

          {/* Epoch boundary callout */}
          {step >= 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={240} y1={46} x2={240} y2={75} stroke="#6366f1" strokeWidth={1.2}
                strokeDasharray="3,2" />
              <text x={240} y={62} textAnchor="middle" fontSize={9}
                fill="#6366f1" fontWeight={600}>height % 600 == 0</text>
            </motion.g>
          )}

          {/* Tasks list */}
          {TASKS.map((t, i) => {
            const stepActive = step === 1 ? i === 0
              : step === 2 ? i === 1
              : step === 3 ? i >= 2
              : false;
            return (
              <motion.g key={t.name} animate={{ opacity: stepActive || step === 0 ? 1 : 0.35 }}>
                <ActionBox x={30} y={t.y} w={120} h={26}
                  label={t.name} sub={t.sub} color={t.color} />
                {/* arrow flow */}
                {(stepActive) && (
                  <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>
                    <line x1={150} y1={t.y + 13} x2={250} y2={t.y + 13}
                      stroke={t.color} strokeWidth={1.2} strokeDasharray="3,2" />
                    <DataBox x={250} y={t.y + 1} w={200} h={24}
                      label={
                        i === 0 ? 'beacon = VRF(prev, h)'
                        : i === 1 ? 'compute + storage committees'
                        : i === 2 ? 'registry.UpdateEpoch(epoch)'
                        : i === 3 ? 'distribute rewards · slash'
                        : 'expired proposals → tally'
                      }
                      color={t.color} outlined />
                  </motion.g>
                )}
              </motion.g>
            );
          })}

          {/* Final emit event */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <ModuleBox x={170} y={5} w={140} h={20} label="emit NewEpoch(epoch)" color="#ec4899" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
