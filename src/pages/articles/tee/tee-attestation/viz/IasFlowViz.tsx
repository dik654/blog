import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_APP = '#6366f1';
const C_IAS = '#10b981';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: 'Step 1: Enclave가 Quote 생성',
    body: 'sgx_get_quote(report, linkable=false).\nEPID 그룹 서명으로 quote 생성.',
  },
  {
    label: 'Step 2-3: HTTPS POST → IAS 응답',
    body: 'POST /sgx/attestation/v4/report.\nIAS가 status, body, signature, platformInfoBlob 반환.',
  },
  {
    label: 'Step 4: 앱이 IAS 응답 검증',
    body: 'IAS report signing cert로 서명 검증.\nisvEnclaveQuoteStatus + measurement 비교.',
  },
  {
    label: '문제점 — Intel 의존 + privacy + rate limit',
    body: 'Intel 서버 outage = 모든 attestation 실패.\nPrivacy: Intel이 모든 attestation 감사. 클라우드 확장성 한계.',
  },
];

export default function IasFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={140} h={36} label="Enclave + QE" color={C_APP} />
          <ModuleBox x={170} y={20} w={140} h={36} label="App backend" color={C_APP} />
          <ModuleBox x={320} y={20} w={140} h={36} label="IAS (Intel)" color={C_IAS} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="quote = sgx_get_quote(report, linkable=false)" color={C_APP} />
              <DataBox x={120} y={120} w={240} h={32} label="EPID 그룹 서명 quote" color={C_APP} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={26} label='POST /sgx/attestation/v4/report — body: { quote }' color={C_IAS} />
              <ActionBox x={40} y={114} w={400} h={26} label="response: { status, body, signature, platformInfoBlob }" color={C_IAS} />
              <DataBox x={120} y={150} w={240} h={32} label='status: "OK" | "SW_HARDENING_NEEDED" ...' color={C_IAS} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                'IAS report signing cert로 서명 검증',
                'isvEnclaveQuoteStatus 확인',
                'Enclave measurement 비교',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                  <DataBox x={40} y={80 + i * 38} w={400} h={32} label={line} color={C_IAS} outlined />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                'Intel 서버 outage = 모든 attestation 실패',
                'Privacy: Intel이 모든 quote 감사',
                'Rate limit (초당 요청)',
                '클라우드 확장성 한계',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <AlertBox x={40} y={70 + i * 36} w={400} h={26} label={line} color={C_BAD} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
