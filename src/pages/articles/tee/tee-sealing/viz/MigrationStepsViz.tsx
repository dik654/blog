import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_V1 = '#6366f1';
const C_V2 = '#10b981';
const C_TEMP = '#f59e0b';

const STEPS = [
  {
    label: 'Step 1: v1.0이 자기 데이터 unseal',
    body: 'sgx_unseal(sealed_v10_data, MRENCLAVE).\n메모리에 평문 데이터 보유.',
  },
  {
    label: 'Step 2-3: 임시 키로 재암호화 → v1.1로 transfer',
    body: 'temp_key = random_32B.\nlocal attestation으로 v1.1 확인 후 secure channel(DH)로 temp_key 전달.',
  },
  {
    label: 'Step 4-5: v1.1이 복호화 → 자기 MRENCLAVE로 re-seal',
    body: 'v11_data = aes_gcm_decrypt(encrypted, temp_key).\nsealed_v11_data = sgx_seal(v11_data, MRENCLAVE).',
  },
  {
    label: 'Step 6: v1.0 sealed 삭제 — 마이그레이션 완료',
    body: '이제 v1.1이 독자 데이터 소유.\n복잡도 높음 → 실전에선 MRSIGNER 선호.',
  },
];

export default function MigrationStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={140} h={32} label="v1.0 enclave" color={C_V1} />
          <ModuleBox x={320} y={20} w={140} h={32} label="v1.1 enclave" color={C_V2} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={400} h={32} label="v1.0: sgx_unseal(sealed_v10, MRENCLAVE)" color={C_V1} />
              <DataBox x={130} y={120} w={220} h={32} label="v10_data (메모리 평문)" color={C_V1} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={400} h={26} label="temp_key = random_32B" color={C_TEMP} />
              <ActionBox x={40} y={102} w={400} h={26} label="local_attestation(v11) → DH(temp_key)" color={C_TEMP} />
              <DataBox x={130} y={138} w={220} h={32} label="(temp_encrypted, temp_key) → v1.1" color={C_TEMP} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={400} h={26} label="v1.1: aes_gcm_decrypt(encrypted, temp_key)" color={C_V2} />
              <ActionBox x={40} y={102} w={400} h={26} label="v1.1: sgx_seal(data, MRENCLAVE_v11)" color={C_V2} />
              <DataBox x={130} y={138} w={220} h={32} label="sealed_v11_data" color={C_V2} outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={70} w={400} h={32} label="delete sealed_v10_data" color={C_V1} />
              <DataBox x={130} y={120} w={220} h={32} label="v1.1이 독자 데이터 소유 ✓" color={C_V2} outlined />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                복잡도 높음 → 실전에선 MRSIGNER 선호
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
