import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_USER = '#6366f1';
const C_TEE = '#10b981';
const C_HW = '#f59e0b';
const C_OK = '#10b981';

const STEPS = [
  {
    label: 'Step 1-2: TLS 연결 + nonce 전송',
    body: 'TLS만으로는 상대방이 진짜 TEE인지 모름.\n사용자가 random nonce(32B) 전송 → replay 공격 방어.',
  },
  {
    label: 'Step 3-4: TEE가 report 생성 + HW 서명',
    body: 'measurement + nonce + TEE 공개키 포함 (binding).\nECDSA(sk_hw, hash(report)) — CPU vendor root 체인으로 추적 가능.',
  },
  {
    label: 'Step 5-6: report 전송 + 검증',
    body: 'cert_chain → signature → measurement → nonce → TCB 5단계 검증.\n검증 성공 시 세션 키 교환, 실패 시 연결 거부.',
  },
];

export default function AttestationFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <ModuleBox x={20} y={20} w={120} h={36} label="User" color={C_USER} />
          <ModuleBox x={180} y={20} w={120} h={36} label="TEE App" color={C_TEE} />
          <ModuleBox x={340} y={20} w={120} h={36} label="HW (CPU)" color={C_HW} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="TLS handshake" color={C_USER} />
              <ActionBox x={40} y={118} w={400} h={28} label="nonce (32B random) →" color={C_USER} />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill={C_USER}>
                replay 방어 — 매 요청마다 fresh
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={40} y={80} w={400} h={28} label="report = {measurement, nonce, pubkey_TEE}" color={C_TEE} />
              <ActionBox x={40} y={118} w={400} h={28} label="HW sign: sigma = ECDSA(sk_hw, hash(report))" color={C_HW} />
              <DataBox x={130} y={156} w={220} h={28} label="report + sigma + cert_chain" color={C_TEE} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                'cert_chain → root CA',
                'ECDSA verify',
                'measurement check',
                'nonce match',
                'TCB up-to-date',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}>
                  <DataBox x={40} y={80 + i * 26} w={400} h={22} label={line} color={C_OK} outlined />
                </motion.g>
              ))}
              <text x={240} y={216} textAnchor="middle" fontSize={9} fill={C_OK}>
                전부 OK → 세션 키 교환 → 데이터 전송
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
