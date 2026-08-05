import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_OK = '#10b981';
const C_BAD = '#ef4444';
const C_KEY = '#f59e0b';

const STEPS = [
  {
    label: '봉인 없음 — 어디에 저장? 모든 옵션이 막힘',
    body: 'enclave에서 키 생성 후 메모리: 재부팅 시 손실.\n디스크(평문): 공격자 read 가능. 디스크(암호화): 암호화 키는 또 어디에? 순환 논리.',
  },
  {
    label: '봉인 있음 — CPU 하드웨어 root에서 Seal Key 파생',
    body: 'EGETKEY(MRENCLAVE_POLICY) → Seal Key.\nAES-GCM 암호화 → 디스크에 안전 저장.',
  },
  {
    label: '재부팅 후 — 같은 CPU + 같은 코드만 unseal',
    body: 'EGETKEY 다시 호출 → 같은 Seal Key 재파생.\nAES-GCM 복호화 + MAC 검증 통과 → 평문 복구.',
  },
];

export default function NoSealingProblemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={14} w={220} h={28} label="generate_random_key()" color={C_KEY} />
              <DataBox x={130} y={50} w={220} h={28} label="PrivateKey pk" color={C_KEY} outlined />
              <text x={240} y={96} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_BAD}>
                저장 옵션 — 모두 실패
              </text>
              {[
                ['메모리', '재부팅 시 손실'],
                ['디스크 (평문)', '공격자 read 가능'],
                ['디스크 (암호화)', '암호화 키는 또 어디에?'],
              ].map(([opt, why], i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <AlertBox x={40} y={106 + i * 30} w={150} h={22} label={opt} color={C_BAD} />
                  <text x={205} y={120 + i * 30} fontSize={9} fill={C_BAD}>✗ {why}</text>
                </motion.g>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill={C_BAD}>
                재부팅마다 새 키 → 이전 지갑 접근 불가
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={130} y={14} w={220} h={28} label="PrivateKey pk = generate()" color={C_KEY} />
              <ModuleBox x={40} y={56} w={170} h={36} label="CPU Hardware" sub="Root Seal Key" color={C_OK} />
              <ActionBox x={250} y={56} w={170} h={36} label="EGETKEY(MRENCLAVE)" color={C_OK} />
              <DataBox x={130} y={104} w={220} h={32} label="SealKey sk (16B)" color={C_OK} outlined />
              <ActionBox x={40} y={150} w={400} h={28} label="sealed = aes_gcm_seal(pk, sk) → fs_write" color={C_OK} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={14} w={400} h={28} label="sealed = fs_read('wallet.sealed')" color={C_OK} />
              <ActionBox x={40} y={50} w={400} h={28} label="sk = EGETKEY(MRENCLAVE) — 같은 CPU/코드" color={C_OK} />
              <ActionBox x={40} y={86} w={400} h={28} label="pk = aes_gcm_unseal(sealed, sk)" color={C_OK} />
              <DataBox x={120} y={130} w={240} h={32} label="MAC OK → 평문 복구 ✓" color={C_OK} outlined />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill={C_OK}>
                다른 CPU 또는 다른 enclave → 다른 sk → 복호화 실패
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
