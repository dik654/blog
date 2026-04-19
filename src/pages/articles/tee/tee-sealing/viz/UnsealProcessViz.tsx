import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_REQ = '#6366f1';
const C_KEY = '#10b981';
const C_DEC = '#f59e0b';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: '1. sealed에서 key_request 추출',
    body: 'req = sealed_data->key_request.\nCPUSVN, ISV_SVN, KeyID 모두 봉인 시점 값 그대로.',
  },
  {
    label: '2. EGETKEY → seal_key 재파생',
    body: 'sgx_get_key(&req, &seal_key).\nMRENCLAVE/MRSIGNER 다르면 여기서 다른 key → 복호화 실패.',
  },
  {
    label: '3-4. IV 복원 + AES-GCM 복호화',
    body: 'iv = 0 고정 (sealing과 동일).\nsgx_rijndael128GCM_decrypt → MAC 검증 atomically.',
  },
  {
    label: 'MAC mismatch — 5가지 원인',
    body: 'ciphertext 변조 / AAD 변조 / IV 또는 Key 불일치 / 다른 CPU / downgrade.\n어떤 원인이든 SGX_ERROR_MAC_MISMATCH 반환.',
  },
];

const REASONS = [
  'Ciphertext 변조',
  'AAD 변조',
  'IV/Key 불일치 (잘못된 enclave)',
  '다른 CPU에서 복사 시도',
  'Downgrade 공격',
];

export default function UnsealProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={130} y={20} w={220} h={32} label="sealed_data" color={C_REQ} outlined />
              <ActionBox x={40} y={70} w={400} h={32} label="req = sealed_data->key_request" color={C_REQ} />
              <DataBox x={40} y={114} w={130} h={28} label="CPUSVN" color={C_REQ} outlined />
              <DataBox x={175} y={114} w={130} h={28} label="ISV_SVN" color={C_REQ} outlined />
              <DataBox x={310} y={114} w={130} h={28} label="KeyID" color={C_REQ} outlined />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                봉인 시점 값 그대로 — 동일 key 재파생을 위해
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={400} h={32} label="sgx_get_key(&req, &seal_key)" color={C_KEY} />
              <DataBox x={130} y={80} w={220} h={32} label="seal_key (16B)" color={C_KEY} outlined />
              <AlertBox x={40} y={130} w={400} h={36} label="MRENCLAVE/MRSIGNER 다르면 다른 key → 복호화 실패" color={C_BAD} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={400} h={28} label="iv = 0 (sealing과 동일)" color={C_KEY} outlined />
              <ActionBox x={40} y={60} w={400} h={32} label="sgx_rijndael128GCM_decrypt(...)" color={C_DEC} />
              <DataBox x={40} y={104} w={195} h={28} label="MAC 검증 (atomic)" color={C_DEC} outlined />
              <DataBox x={245} y={104} w={195} h={28} label="payload → plaintext" color={C_DEC} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_DEC}>
                MAC OK → 평문 반환, 실패 → SGX_ERROR_MAC_MISMATCH
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_BAD}>
                MAC mismatch 원인 5가지
              </text>
              {REASONS.map((r, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <AlertBox x={40} y={36 + i * 36} w={400} h={28} label={r} color={C_BAD} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
