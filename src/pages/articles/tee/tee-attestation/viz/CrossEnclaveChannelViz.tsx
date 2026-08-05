import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_A = '#6366f1';
const C_B = '#10b981';
const C_DH = '#f59e0b';
const C_AEK = '#a855f7';

const STEPS = [
  {
    label: 'Step 1: Local attestation으로 상호 인증',
    body: '두 enclave가 EREPORT 2회 수행 → 서로 MRENCLAVE 확인.\n같은 머신·다른 enclave 신원 확립.',
  },
  {
    label: 'Step 2: ECDH 키 교환',
    body: 'sgx_dh_init_session으로 initiator/responder 역할 설정.\nmsg1 → msg2 → msg3 3-way 교환.',
  },
  {
    label: 'Step 3: AEK 도출 → AES-GCM 채널 구축',
    body: '양쪽이 aek (Authenticated Encryption Key) 보유.\n이후 통신은 AES-GCM 암호화 — 같은 머신 내 secure 채널.',
  },
];

export default function CrossEnclaveChannelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={150} h={42} label="Enclave A" sub="Initiator" color={C_A} />
          <ModuleBox x={310} y={20} w={150} h={42} label="Enclave B" sub="Responder" color={C_B} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={84} w={400} h={28} label="A: EREPORT(target=B); B: verify" color={C_A} />
              <ActionBox x={40} y={118} w={400} h={28} label="B: EREPORT(target=A); A: verify" color={C_B} />
              <DataBox x={130} y={158} w={220} h={32} label="상호 신원 확인 ✓" color={C_DH} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={26} label="A: gen_msg1 → B" color={C_A} />
              <ActionBox x={40} y={112} w={400} h={26} label="B: proc_msg2 → A" color={C_B} />
              <ActionBox x={40} y={144} w={400} h={26} label="A: proc_msg3 → AEK 도출" color={C_DH} />
              <text x={240} y={196} textAnchor="middle" fontSize={9} fill={C_DH}>
                ECDH 3-way handshake 완료
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={40} y={80} w={170} h={32} label="A: aek (16B)" color={C_AEK} outlined />
              <DataBox x={270} y={80} w={170} h={32} label="B: aek (16B)" color={C_AEK} outlined />
              <ActionBox x={40} y={124} w={400} h={36} label="이후 통신 = AES-GCM(aek, ...)" color={C_AEK} />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fill={C_AEK}>
                Multi-enclave 앱 / Key manager → worker 키 전달
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
