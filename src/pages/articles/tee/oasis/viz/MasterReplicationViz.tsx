import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. New KM 노드 enclave 시작', body: '신규 KM 노드: SGX enclave 부팅, 자체 RAK 생성.\n아직 master_secret 없음.' },
  { label: '2. Existing KM 와 RA-TLS handshake', body: '기존 KM 노드와 RA-TLS 보안 채널.\nQuote 교환으로 양방향 enclave 신뢰.' },
  { label: '3. Existing 노드가 New 의 Quote 검증', body: 'MRENCLAVE 가 governance approved 인지.\nPolicy 통과 시 master 전송 결정.' },
  { label: '4. Master Secret TLS 채널로 전송', body: 'master_secret 을 RA-TLS 채널로 전송.\nNew 노드가 SGX sealing 으로 디스크 저장.' },
  { label: '5. Epoch rotation — 새 master 파생', body: 'epoch 마다 new_master = HKDF(old_master, beacon).\n위원회에 전파, old_master 는 일정 기간 유지(이전 키로 암호화된 상태 복호화).' },
];

export default function MasterReplicationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Existing KM */}
          <ModuleBox x={20} y={30} w={140} h={50}
            label="Existing KM" sub="has master_secret" color="#a855f7" />

          {/* New KM */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.4 }}>
            <ModuleBox x={320} y={30} w={140} h={50}
              label="New KM"
              sub={step >= 3 ? 'master replicated' : 'no secret yet'}
              color={step >= 3 ? '#10b981' : '#f59e0b'} />
          </motion.g>

          {/* Step 0 — RAK */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={335} y={95} w={110} h={26} label="generate RAK" color="#f59e0b" outlined />
            </motion.g>
          )}

          {/* Step 1 — RA-TLS handshake */}
          {step >= 1 && (
            <motion.g animate={{ opacity: step >= 1 ? 1 : 0 }}>
              <motion.line x1={160} y1={50} x2={320} y2={50}
                stroke="#3b82f6" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <motion.line x1={320} y1={62} x2={160} y2={62}
                stroke="#10b981" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <text x={240} y={45} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>
                RA-TLS handshake
              </text>
            </motion.g>
          )}

          {/* Step 2 — verify quote */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={150} y={100} w={180} h={36}
                label="verifyQuote(new.quote)" sub="MRENCLAVE in policy?" color="#10b981" />
            </motion.g>
          )}

          {/* Step 3 — send secret */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.circle cx={160} cy={150} r={10} fill="#a855f7"
                animate={{ x: 0 }}
                transition={{ duration: 0 }} />
              <motion.circle initial={false} cx={160} cy={150} r={10} fill="#a855f7"
                animate={{ cx: [160, 320] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }} />
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                master_secret over RA-TLS
              </text>
              <DataBox x={310} y={170} w={160} h={26}
                label="SGX sealing → disk" color="#10b981" outlined />
            </motion.g>
          )}

          {/* Step 4 — epoch rotation */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={130} w={150} h={26}
                label="old_master" color="#94a3b8" outlined />
              <ActionBox x={185} y={128} w={140} h={32}
                label="HKDF(old, beacon)" color="#f59e0b" />
              <DataBox x={335} y={130} w={130} h={26}
                label="new_master" color="#a855f7" outlined />
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                old kept for back-compat decryption
              </text>
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="#a855f7" fontWeight={600}>
                rotated every epoch
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            TEE-to-TEE master secret replication
          </text>
        </svg>
      )}
    </StepViz>
  );
}
