import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '인증서 구조 — X.509 + Quote extension', body: '표준 X.509 v3 + custom extension OID 1.2.840.113741.1337.6.\n자체 서명, RAK 가 서명자.' },
  { label: '서버: RA-TLS cert 제시', body: 'TLS handshake 첫 단계.\nSubjectPublicKey = RAK.public.\nExtension 안에 Quote 포함.' },
  { label: '클라이언트: Quote 추출 + 검증', body: 'extension OID 로 Quote 추출.\nIntel PCS 조회 → TCB 상태 확인.' },
  { label: 'Binding 검증 — Quote == cert.pubkey', body: 'Quote.report_data == hash(cert.pubkey) 확인.\nman-in-the-middle 차단.' },
  { label: 'TLS 세션 수립 → 보안 채널', body: '검증 통과 시 일반 TLS 처럼 세션 수립.\n이후 통신은 양쪽 enclave 간 직접 보호.' },
];

export default function RatlsCertViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Server / Client */}
          <ModuleBox x={20} y={30} w={120} h={50}
            label="Server" sub="(SGX enclave)" color="#ec4899" />
          <ModuleBox x={340} y={30} w={120} h={50}
            label="Client" sub="(verifier)" color="#3b82f6" />

          {/* Cert structure (step 0) */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={155} y={20} w={170} h={210} label="RA-TLS Cert" color="#a855f7" />
              <DataBox x={170} y={50}  w={140} h={20} label="Subject" color="#a855f7" outlined />
              <DataBox x={170} y={75}  w={140} h={20} label="SubjectPubKey=RAK" color="#10b981" outlined />
              <DataBox x={170} y={100} w={140} h={20} label="NotBefore/NotAfter" color="#a855f7" outlined />
              <DataBox x={170} y={125} w={140} h={26}
                label="Ext: SGX Quote" color="#f59e0b" outlined />
              <DataBox x={170} y={158} w={140} h={20} label="OID 1.2.840...1337.6" color="#f59e0b" outlined />
              <DataBox x={170} y={183} w={140} h={20} label="Sig: RAK self-sign" color="#ec4899" outlined />
            </motion.g>
          )}

          {/* Step 1: present */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.line x1={140} y1={55} x2={340} y2={55}
                stroke="#a855f7" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <DataBox x={170} y={80} w={140} h={28} label="cert + Quote" color="#a855f7" outlined />
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                ServerHello + Certificate
              </text>
            </motion.g>
          )}

          {/* Step 2: client extracts + verify */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={170} y={100} w={140} h={36}
                label="extract Quote" sub="from ext" color="#f59e0b" />
              <ActionBox x={320} y={150} w={130} h={36}
                label="PCS verify" sub="TCB up-to-date" color="#10b981" />
              <motion.line x1={310} y1={118} x2={350} y2={150}
                stroke="#10b981" strokeWidth={1.2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </motion.g>
          )}

          {/* Step 3: binding check */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50}  y={110} w={170} h={32}
                label="Quote.report_data" color="#f59e0b" outlined />
              <text x={240} y={130} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">==</text>
              <DataBox x={260} y={110} w={170} h={32}
                label="hash(cert.pubkey)" color="#10b981" outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                MITM 차단 — pubkey 가 enclave 와 묶임
              </text>
            </motion.g>
          )}

          {/* Step 4: established */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={150} y={100} w={180} h={50}
                label="TLS session" sub="enclave ↔ verifier" color="#10b981" />
              <motion.line x1={140} y1={125} x2={150} y2={125}
                stroke="#10b981" strokeWidth={1.5} />
              <motion.line x1={330} y1={125} x2={340} y2={125}
                stroke="#10b981" strokeWidth={1.5} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>
                양쪽 모두 RA-TLS → 상호 enclave attestation
              </text>
            </motion.g>
          )}

          <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            go/common/sgx/ias/attestation.go
          </text>
        </svg>
      )}
    </StepViz>
  );
}
