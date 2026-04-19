import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_HIGH = '#6366f1';
const C_LOW = '#10b981';
const C_USE = '#f59e0b';

const STEPS = [
  {
    label: '간편 API — sgx_seal_data / sgx_unseal_data',
    body: '내부에서 EGETKEY + AES-GCM 자동 처리.\n일반 앱은 이 두 함수만 사용하면 충분.',
  },
  {
    label: '저수준 API — sgx_get_key',
    body: 'sgx_get_key(req, &key)로 직접 key 파생.\n자체 암호화 알고리즘 사용 시 활용.',
  },
  {
    label: '실제 사용 패턴 — req 설정 + get_key',
    body: 'req.key_name = SEAL, key_policy = MRSIGNER 등.\nseal_key를 AES-GCM 키로 사용해 암호화.',
  },
];

export default function SgxSdkUsageViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={32} label="sgx_seal_data(...) — 내부에서 EGETKEY + AES-GCM" color={C_HIGH} />
              <ActionBox x={40} y={62} w={400} h={32} label="sgx_unseal_data(...) — 내부에서 EGETKEY + AES-GCM verify" color={C_HIGH} />
              <DataBox x={120} y={114} w={240} h={36} label="일반 앱은 이 둘만 사용" color={C_HIGH} outlined />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                높은 수준의 추상화 — 안전한 기본값 보장
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={400} h={36} label="sgx_get_key(p_key_request, &p_key)" color={C_LOW} />
              <DataBox x={130} y={86} w={220} h={32} label="sgx_key_128bit_t key" color={C_LOW} outlined />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill={C_LOW}>
                자체 암호화 알고리즘 사용 시 활용
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                책임은 호출자에게 — IV/AAD 직접 관리
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="req.key_name = SGX_KEYSELECT_SEAL" color={C_USE} />
              <ActionBox x={40} y={56} w={400} h={28} label="req.key_policy = SGX_KEYPOLICY_MRSIGNER" color={C_USE} />
              <ActionBox x={40} y={92} w={400} h={28} label="req.isv_svn = 1; req.cpu_svn = current" color={C_USE} />
              <ActionBox x={40} y={128} w={400} h={28} label="sgx_get_key(&req, &seal_key)" color={C_LOW} />
              <DataBox x={130} y={166} w={220} h={32} label="seal_key → AES-GCM 키로 사용" color={C_LOW} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
