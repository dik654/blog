import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_V1 = '#6366f1';
const C_V2 = '#10b981';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: 'MRENCLAVE — enclave 바이너리의 SHA-256 해시',
    body: '코드 + 데이터 + relocation 전부 반영.\n빌드 도구가 deterministic 계산 → 한 byte 수정해도 다른 값.',
  },
  {
    label: '봉인 시 — KEYPOLICY_MRENCLAVE',
    body: 'req.key_policy = SGX_KEYPOLICY_MRENCLAVE.\n현재 enclave의 MRENCLAVE가 KDF 입력에 포함.',
  },
  {
    label: 'v1.0 sealed → v1.1 unseal — MRENCLAVE 다름 → 실패',
    body: 'v1.0: MRENCLAVE = 0xAAA. v1.1: 0xBBB (1 byte 수정만으로 변경).\n다른 key → decryption fail.',
  },
  {
    label: '장단점 — 가장 강한 격리, but 사소한 업데이트도 migration 필요',
    body: '✓ 백도어 주입 불가, ✓ 검증 가능성 최고.\n✗ 컴파일러 버전 변경 시도 MRENCLAVE 변경 → 데이터 영속성과 충돌.',
  },
];

export default function MrenclaveSealViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={130} h={32} label="enclave 코드" color={C_V1} outlined />
              <DataBox x={175} y={20} w={130} h={32} label="enclave 데이터" color={C_V1} outlined />
              <DataBox x={310} y={20} w={130} h={32} label="relocation" color={C_V1} outlined />
              <ActionBox x={130} y={66} w={220} h={32} label="SHA-256" color={C_V1} />
              <DataBox x={130} y={108} w={220} h={36} label="MRENCLAVE (32B hash)" color={C_V1} outlined />
              <text x={240} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                deterministic — 1 byte 수정해도 hash 완전 변경
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={30} w={400} h={32} label="req.key_policy = SGX_KEYPOLICY_MRENCLAVE" color={C_V1} />
              <ActionBox x={40} y={70} w={400} h={32} label="sgx_get_key(&req, &seal_key)" color={C_V1} />
              <DataBox x={130} y={114} w={220} h={32} label="seal_key (MRENCLAVE 바운드)" color={C_V1} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={195} h={36} label="v1.0 enclave" sub="MRENCLAVE = 0xAAA" color={C_V1} outlined />
              <DataBox x={245} y={20} w={195} h={36} label="v1.1 enclave" sub="MRENCLAVE = 0xBBB" color={C_V2} outlined />
              <ActionBox x={40} y={76} w={400} h={32} label="v1.0에서 sealed → v1.1에서 unseal 시도" color={C_BAD} />
              <AlertBox x={120} y={120} w={240} h={36} label="다른 key → decryption fail" color={C_BAD} />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill={C_BAD}>
                마이그레이션 코드 필수
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                ['✓', '가장 강한 코드 격리', C_V2],
                ['✓', '백도어 주입 불가 (byte-level)', C_V2],
                ['✓', '검증 가능성 최고', C_V2],
                ['✗', '사소한 업데이트도 migration 필요', C_BAD],
                ['✗', '컴파일러 버전 변경 시도 MRENCLAVE 변경', C_BAD],
              ].map(([sym, line, color], i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <text x={50} y={36 + i * 32} fontSize={11} fontWeight={700} fill={color as string}>{sym}</text>
                  <text x={70} y={36 + i * 32} fontSize={9.5} fill={color as string}>{line}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
