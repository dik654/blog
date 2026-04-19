import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_OLD = '#f59e0b';
const C_NEW = '#10b981';
const C_DATA = '#6366f1';

const STEPS = [
  {
    label: '1. 새 마스터 키 생성',
    body: 'sgx_read_rand(new_master, 32).\nfresh 32B 랜덤 키 생성.',
  },
  {
    label: '2. 현재 마스터로 unseal → 데이터 복호화',
    body: 'sgx_unseal_data(current_master, ..., current_master_plaintext).\n기존 데이터를 평문으로 메모리에 둔다.',
  },
  {
    label: '3. 새 마스터로 모든 데이터 재암호화',
    body: 'for entry: aes_gcm_decrypt(old) → aes_gcm_encrypt(new).\n저장소의 모든 entry를 새 키로 갱신.',
  },
  {
    label: '4-6. 새 마스터 재봉인 + 이전 백업 + 유예 후 삭제',
    body: 'sgx_seal_data(new_master, MRSIGNER) → 새 sealed.\nprevious_master로 이전 세대 보관 후 30일 유예.',
  },
];

export default function KeyRotationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={40} w={220} h={36} label="sgx_read_rand(new_master, 32)" color={C_NEW} />
              <DataBox x={130} y={100} w={220} h={36} label="new_master (32B random)" color={C_NEW} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={32} label="current_master (sealed)" color={C_OLD} outlined />
              <ActionBox x={40} y={64} w={400} h={32} label="sgx_unseal_data(current_master, ...)" color={C_OLD} />
              <DataBox x={130} y={108} w={220} h={32} label="current_master_plaintext" color={C_DATA} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="for entry in key_store:" color={C_DATA} />
              <ActionBox x={40} y={56} w={400} h={28} label="  aes_gcm_decrypt(entry.data, current_master_plaintext)" color={C_OLD} />
              <ActionBox x={40} y={92} w={400} h={28} label="  aes_gcm_encrypt(plaintext, new_master)" color={C_NEW} />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill={C_NEW}>
                저장소의 모든 entry가 새 키로 재암호화
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="new_sealed = sgx_seal(new_master, MRSIGNER)" color={C_NEW} />
              <DataBox x={40} y={56} w={195} h={32} label="previous_master (백업)" color={C_OLD} outlined />
              <DataBox x={245} y={56} w={195} h={32} label="current_master = new_sealed" color={C_NEW} outlined />
              <ActionBox x={40} y={100} w={400} h={28} label="schedule_delete(previous_master, 30_days)" color={C_OLD} />
              <text x={240} y={156} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                유예 기간 동안 rollback 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
