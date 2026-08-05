import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Policy 구조 — Enclaves + signatures', body: 'Enclaves: MRENCLAVE → EnclavePolicy 매핑.\nMRENCLAVE: KM 자기 자신.\nSignatures: governance 서명들.' },
  { label: 'EnclavePolicy — MayQuery / MayReplicate', body: 'MayQuery[RuntimeID] = bool — 어떤 런타임 키를 받을 수 있는가.\nMayReplicate[] — 이 enclave 로부터 master 복제 허용.' },
  { label: 'Governance proposal — PolicyUpdate', body: '거버넌스 proposal: PolicyUpdate.\n검증인 voting (2/3 threshold) → 승인 시 KM 노드들이 새 policy 로드.' },
  { label: '예시 — 새 Sapphire 버전 배포', body: '새 MRENCLAVE_NEW 계산 → proposal: Enclaves[NEW] = MayQuery: Sapphire.\n통과 시 새 컴퓨트 노드가 키 받기 시작.' },
];

export default function KmPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0 — policy fields */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={20} w={200} h={50} label="Policy" color="#a855f7" />
              <DataBox x={50}  y={100} w={120} h={28} label="Enclaves[]" color="#a855f7" outlined />
              <DataBox x={185} y={100} w={120} h={28} label="MRENCLAVE"  color="#a855f7" outlined />
              <DataBox x={320} y={100} w={120} h={28} label="Signatures" color="#a855f7" outlined />
              <line x1={210} y1={70} x2={110} y2={100} stroke="#a855f7" strokeWidth={0.6} strokeDasharray="3,2" />
              <line x1={240} y1={70} x2={245} y2={100} stroke="#a855f7" strokeWidth={0.6} strokeDasharray="3,2" />
              <line x1={270} y1={70} x2={380} y2={100} stroke="#a855f7" strokeWidth={0.6} strokeDasharray="3,2" />
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                signed by governance committee
              </text>
            </motion.g>
          )}

          {/* Step 1 — EnclavePolicy detail */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={140} y={20} w={200} h={50} label="EnclavePolicy" color="#10b981" />
              <DataBox x={20}  y={100} w={210} h={32}
                label="MayQuery: {Sapphire: true}" color="#10b981" outlined />
              <DataBox x={250} y={100} w={210} h={32}
                label="MayReplicate: [...MRENCLAVE]" color="#3b82f6" outlined />
              <text x={125} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                컴퓨트 노드가 어떤 런타임 키를 받을 수 있나
              </text>
              <text x={355} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                어떤 enclave 가 master 복제 허용
              </text>
            </motion.g>
          )}

          {/* Step 2 — governance flow */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { name: 'submit',   x: 25,  color: '#6366f1' },
                { name: 'vote 2/3', x: 135, color: '#10b981' },
                { name: 'pass',     x: 245, color: '#f59e0b' },
                { name: 'KM load',  x: 355, color: '#a855f7' },
              ].map((p, i) => (
                <motion.g key={p.name}
                  initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <ActionBox x={p.x} y={50} w={100} h={42} label={p.name} color={p.color} />
                  {i < 3 && (
                    <line x1={p.x + 100} y1={71} x2={p.x + 110} y2={71}
                      stroke={p.color} strokeWidth={1.2} />
                  )}
                </motion.g>
              ))}
              <DataBox x={120} y={140} w={240} h={32}
                label="proposal: PolicyUpdate{ Enclaves: ... }" color="#a855f7" outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                검증인 2/3 동의 시 효과
              </text>
            </motion.g>
          )}

          {/* Step 3 — example */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={50} w={150} h={28}
                label="MRENCLAVE_OLD" color="#94a3b8" outlined />
              <DataBox x={20}  y={90} w={150} h={28}
                label="MRENCLAVE_NEW" color="#10b981" outlined />
              <ActionBox x={195} y={68} w={120} h={32}
                label="proposal" color="#a855f7" />
              <DataBox x={335} y={68} w={130} h={32}
                label="MayQuery: Sapphire" color="#10b981" outlined />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                새 Sapphire 버전 → governance 추가 → 새 컴퓨트 노드 키 발급
              </text>
              <ModuleBox x={140} y={160} w={200} h={50}
                label="새 컴퓨트 노드들이 키 수신" color="#10b981" />
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            keymanager/api/policy.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
