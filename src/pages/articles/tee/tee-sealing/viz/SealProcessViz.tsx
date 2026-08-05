import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_REQ = '#6366f1';
const C_KEY = '#10b981';
const C_ENC = '#f59e0b';
const C_OUT = '#a855f7';

const STEPS = [
  {
    label: '1. Key request 설정 — keyname=SEAL + policy + masks',
    body: 'sgx_key_request_t { key_name=SEAL, key_policy, attribute_mask, misc_mask }.\nkey 파생을 위한 입력 파라미터.',
  },
  {
    label: '2. KeyID 생성 — sgx_read_rand (각 seal마다 fresh)',
    body: 'sgx_read_rand(req.key_id, SGX_KEYID_SIZE).\n매번 fresh nonce → 같은 enclave도 매 sealing마다 다른 key.',
  },
  {
    label: '3. CPUSVN/ISV_SVN 설정 → EGETKEY → seal_key',
    body: 'sgx_self_report_data로 현재 SVN 가져옴.\nsgx_get_key(req, &seal_key) → 16B Seal Key.',
  },
  {
    label: '4-7. IV=0, AES-GCM 암호화 + metadata 저장',
    body: 'KeyID가 unique → IV는 0으로 고정 가능.\nsgx_rijndael128GCM_encrypt → ciphertext + MAC. metadata에 key_request 저장.',
  },
];

export default function SealProcessViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="sgx_key_request_t req" color={C_REQ} />
              {[
                ['key_name', 'SGX_KEYSELECT_SEAL'],
                ['key_policy', 'MRENCLAVE / MRSIGNER'],
                ['attribute_mask', 'enclave 속성 mask'],
                ['misc_mask', 'MISCSELECT mask'],
              ].map(([k, v], i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <DataBox x={40} y={62 + i * 32} w={150} h={24} label={k} color={C_REQ} outlined />
                  <text x={205} y={78 + i * 32} fontSize={9} fill="var(--foreground)">{v}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={400} h={32} label="sgx_read_rand(req.key_id, SGX_KEYID_SIZE)" color={C_KEY} />
              <DataBox x={130} y={80} w={220} h={32} label="key_id (32B random)" color={C_KEY} outlined />
              <text x={240} y={144} textAnchor="middle" fontSize={9} fill={C_KEY}>
                매 seal마다 fresh nonce
              </text>
              <text x={240} y={162} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 enclave도 다른 key 파생 → IV 고정 가능
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="sgx_self_report_data(&report)" color={C_REQ} />
              <DataBox x={40} y={56} w={195} h={28} label="req.cpu_svn = report.cpu_svn" color={C_REQ} outlined />
              <DataBox x={245} y={56} w={195} h={28} label="req.isv_svn = report.isv_svn" color={C_REQ} outlined />
              <ActionBox x={40} y={96} w={400} h={32} label="sgx_get_key(&req, &seal_key)" color={C_KEY} />
              <DataBox x={130} y={140} w={220} h={32} label="seal_key (16B)" color={C_KEY} outlined />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={28} label="iv = 0 (12B)" color={C_KEY} outlined />
              <DataBox x={250} y={20} w={170} h={28} label="seal_key (16B)" color={C_KEY} outlined />
              <ActionBox x={40} y={60} w={400} h={32} label="sgx_rijndael128GCM_encrypt(...)" color={C_ENC} />
              <DataBox x={40} y={104} w={195} h={28} label="payload (ciphertext)" color={C_OUT} outlined />
              <DataBox x={245} y={104} w={195} h={28} label="payload_tag (MAC, 16B)" color={C_OUT} outlined />
              <ActionBox x={40} y={144} w={400} h={28} label="metadata: key_request, payload_size, AAD offset" color={C_OUT} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
