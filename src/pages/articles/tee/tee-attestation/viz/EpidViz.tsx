import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_GROUP = '#6366f1';
const C_IAS = '#10b981';
const C_BAD = '#ef4444';

const STEPS = [
  {
    label: 'EPID — 그룹 서명 기반 (Brickell-Li 2007)',
    body: '그룹 공개키 PK_G 하나, 각 chip은 그룹 멤버 PK_i를 보유.\n서명 σ = Sign(PK_i, msg). 검증자는 i를 모른 채 PK_G로 검증 가능.',
  },
  {
    label: 'IAS — Intel 운영 중앙 verifier',
    body: 'Quote 생성 → IAS에 HTTPS POST.\nIAS가 EPID 그룹 서명 검증 후 결과를 서명해서 반환.',
  },
  {
    label: '제약 — 중앙집중 + privacy 침해 + scale 한계',
    body: 'Intel 서버 outage = 모든 attestation 실패.\nIntel이 모든 attestation 감사 가능. Rate limit 존재 → 2020년 deprecated.',
  },
];

export default function EpidViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={150} y={20} w={180} h={36} label="Group public key PK_G" color={C_GROUP} />
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const x = 40 + i * 70;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <DataBox x={x} y={80} w={60} h={28} label={`chip ${i}`} sub={`PK_${i}`} color={C_GROUP} outlined />
                    <line x1={x + 30} y1={80} x2={240} y2={56} stroke={C_GROUP} strokeWidth={0.4} />
                  </motion.g>
                );
              })}
              <ActionBox x={120} y={130} w={240} h={32} label="σ = Sign(PK_i, msg)" color={C_GROUP} />
              <text x={240} y={184} textAnchor="middle" fontSize={9} fill={C_GROUP}>
                Verifier: Verify(PK_G, σ) without learning i
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={20} w={140} h={36} label="App Enclave" color={C_GROUP} />
              <ModuleBox x={170} y={20} w={140} h={36} label="QE" color={C_GROUP} />
              <ModuleBox x={320} y={20} w={140} h={36} label="IAS (Intel)" color={C_IAS} />
              <ActionBox x={40} y={80} w={400} h={28} label="quote = sgx_get_quote(report)" color={C_GROUP} />
              <ActionBox x={40} y={114} w={400} h={28} label="HTTPS POST → IAS" color={C_IAS} />
              <DataBox x={40} y={150} w={400} h={28} label="IAS 응답: { status, body, signed }" color={C_IAS} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                'Intel 서버 필수 (온라인만)',
                'Intel이 모든 attestation 감사',
                'Scalability 한계 (single PoF)',
                '2020년 deprecated',
              ].map((line, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <AlertBox x={40} y={30 + i * 44} w={400} h={32} label={line} color={C_BAD} />
                </motion.g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
