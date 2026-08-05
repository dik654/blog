import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_APP = '#6366f1';
const C_QE = '#10b981';
const C_OUT = '#f59e0b';

const STEPS = [
  {
    label: 'Step 1-2: 앱 enclave가 report 생성, QE에 전달',
    body: 'report = EREPORT(QE_target_info, user_data).\nIPC 또는 RPC로 QE에 전송.',
  },
  {
    label: 'Step 3-4: QE가 MAC 검증 (Local Attestation), Quote 서명',
    body: 'QE가 verify_mac(report) → 같은 CPU 확인.\nquote = ECDSA_sign(AK, report) → 외부 전송 가능한 서명.',
  },
  {
    label: 'Step 5: Quote가 네트워크로 전송 → 원격 검증',
    body: 'Quote는 PCK 인증서 체인 포함.\n원격 verifier가 PCS에서 PCK 확인 후 quote 서명 검증.',
  },
];

export default function QuotingEnclaveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={140} h={36} label="App Enclave" color={C_APP} />
          <ModuleBox x={170} y={20} w={140} h={36} label="QE (Intel signed)" color={C_QE} />
          <ModuleBox x={320} y={20} w={140} h={36} label="원격 verifier" color={C_OUT} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="report = EREPORT(QE_target_info, user_data)" color={C_APP} />
              <ActionBox x={40} y={114} w={400} h={28} label="App → QE: send report (IPC/RPC)" color={C_APP} />
              <DataBox x={130} y={158} w={220} h={32} label="QE 측에서 report 도착" color={C_QE} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="QE: verify_mac(report) — local attestation" color={C_QE} />
              <ActionBox x={40} y={114} w={400} h={28} label="quote = ECDSA_sign(AK, report)" color={C_QE} />
              <DataBox x={130} y={158} w={220} h={32} label="quote (ECDSA) + cert chain" color={C_OUT} outlined />
              <text x={240} y={208} textAnchor="middle" fontSize={9} fill={C_QE}>
                Local → Remote 변환 완료
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="QE → 원격 verifier: quote" color={C_OUT} />
              <ActionBox x={40} y={114} w={400} h={28} label="원격: PCS에서 PCK 확인" color={C_OUT} />
              <DataBox x={40} y={150} w={400} h={28} label="원격: verify(quote, PCK) → enclave 신뢰 수립" color={C_OUT} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
