import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_OK = '#10b981';
const C_BAD = '#ef4444';
const C_SVN = '#f59e0b';
const C_NEUTRAL = '#6366f1';

const STEPS = [
  {
    label: 'MRSIGNER — 서명자 공개키 해시 (256 bits)',
    body: 'SIGSTRUCT에 포함, 빌드 시점에 RSA-3072 서명.\n같은 서명자가 만든 모든 enclave가 같은 MRSIGNER.',
  },
  {
    label: '봉인 시 — KEYPOLICY_MRSIGNER + isv_svn',
    body: 'req.key_policy = SGX_KEYPOLICY_MRSIGNER.\nisv_svn = 최소 SVN 요구 (downgrade 방어).',
  },
  {
    label: 'v1.0 sealed → v1.1 unseal — 같은 서명자, 같은 key → 성공',
    body: 'v1.0: MRSIGNER=0xSSS, ISV_SVN=1.\nv1.1: 같은 MRSIGNER, ISV_SVN=2 ≥ 1 → 같은 key → 성공.',
  },
  {
    label: 'SVN downgrade 방어 — isv_svn_mask',
    body: '오래된 SVN enclave는 새 데이터 unseal 못 함.\n보안 취약점 수정 시 SVN 증가 → 패치 강제.',
  },
];

export default function MrsignerSealViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={170} h={32} label="서명자 RSA pubkey" color={C_NEUTRAL} outlined />
              <ActionBox x={250} y={20} w={170} h={32} label="SHA-256" color={C_OK} />
              <DataBox x={130} y={70} w={220} h={36} label="MRSIGNER (256 bits)" color={C_OK} outlined />
              <text x={240} y={142} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 서명자가 만든 모든 enclave 공유
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={20} w={400} h={28} label="req.key_policy = SGX_KEYPOLICY_MRSIGNER" color={C_OK} />
              <ActionBox x={40} y={56} w={400} h={28} label="req.isv_svn = 2 (최소 요구)" color={C_SVN} />
              <ActionBox x={40} y={92} w={400} h={28} label="sgx_get_key(&req, &seal_key)" color={C_OK} />
              <DataBox x={130} y={134} w={220} h={32} label="seal_key (MRSIGNER 바운드)" color={C_OK} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={195} h={36} label="v1.0" sub="MRSIGNER=0xSSS, SVN=1" color={C_NEUTRAL} outlined />
              <DataBox x={245} y={20} w={195} h={36} label="v1.1" sub="같은 MRSIGNER, SVN=2" color={C_OK} outlined />
              <ActionBox x={40} y={76} w={400} h={32} label="v1.0 sealed → v1.1 unseal" color={C_OK} />
              <DataBox x={120} y={120} w={240} h={36} label="MRSIGNER 동일 + SVN OK → 성공 ✓" color={C_OK} outlined />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill={C_OK}>
                자연스러운 업데이트 마이그레이션
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={20} w={195} h={36} label="v0.9" sub="ISV_SVN = 0 (취약)" color={C_BAD} outlined />
              <DataBox x={245} y={20} w={195} h={36} label="v1.0" sub="ISV_SVN = 1 (패치)" color={C_OK} outlined />
              <ActionBox x={40} y={76} w={400} h={32} label="v1.0이 sealed → v0.9가 unseal 시도" color={C_BAD} />
              <DataBox x={120} y={120} w={240} h={36} label="SVN < 요구 → 다른 key → 실패 ✓" color={C_OK} outlined />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill={C_OK}>
                구버전 enclave가 새 데이터 못 읽음 — 패치 강제
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
