import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  c: '#6366f1',
  s: '#10b981',
  k: '#f59e0b',
  z: '#ef4444',
  cert: '#a855f7',
  dh: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: ClientHello — 스위트 + key_share',
    body: 'cipher_suites 목록 + supported_groups + ECDHE 임시 공개키 (x25519).\n서버에 "이 중 하나로 진행하자" 제안.',
  },
  {
    label: '2: ServerHello + 인증',
    body: '서버는 cipher_suite 선택 + 자신의 key_share. 이후 EE/Certificate/CertificateVerify 는 hs_key 로 암호화.\n인증서로 서버 정체 + ECDSA/RSA 서명으로 핸드셰이크 무결성 증명.',
  },
  {
    label: '3: Finished — 무결성 검증',
    body: 'shared = x25519(eph_secret, srv_key_share). HKDF 로 hs_secret + finished_key.\nHMAC(fin_key, transcript_hash) 로 양측 transcript 일치 확인.',
  },
  {
    label: '4: 0-RTT PSK — 재연결',
    body: '이전 세션의 resumption_secret 으로 early_key 도출.\nClientHello + 즉시 데이터 (early_data) 전송. 재전송 위험 → 멱등 요청만 허용.',
  },
];

export default function TLSHandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tls-arr-c" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.c} />
            </marker>
            <marker id="tls-arr-s" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.s} />
            </marker>
          </defs>

          <ModuleBox x={10} y={20} w={90} h={42} label="Client" color={C.c} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Server" color={C.s} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={85} w={170} h={36} label="cipher_suites[]" sub="AES_GCM, ChaCha20" color={C.c} outlined />
              <DataBox x={20} y={130} w={170} h={36} label="supported_groups[]" sub="x25519, secp256r1" color={C.c} outlined />
              <DataBox x={20} y={175} w={170} h={36} label="key_share" sub="x25519(eph_secret)" color={C.dh} outlined />

              <motion.line x1={195} y1={150} x2={400} y2={42} stroke={C.c} strokeWidth={1.5}
                markerEnd="url(#tls-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={92} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.c}>
                ClientHello
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={310} y={85} w={170} h={32} label="cipher_suite 선택" color={C.s} outlined />
              <DataBox x={310} y={120} w={170} h={32} label="key_share (srv eph)" color={C.dh} outlined />
              <DataBox x={310} y={155} w={170} h={32} label="EE / Cert / CV" sub="hs_key 로 암호화" color={C.cert} outlined />

              <motion.line x1={400} y1={62} x2={195} y2={150} stroke={C.s} strokeWidth={1.5}
                markerEnd="url(#tls-arr-s)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.3 }} />
              <DataBox x={20} y={130} w={170} h={36} label="응답 + 인증서 검증" color={C.s} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={85} w={170} h={36} label="ECDH" sub="x25519(eph, srv_ks)" color={C.dh} />
              <ActionBox x={20} y={130} w={170} h={36} label="HKDF" sub="hs_secret + fin_key" color={C.k} />
              <ActionBox x={20} y={175} w={170} h={36} label="HMAC" sub="verify_data" color={C.k} />

              <motion.line x1={195} y1={193} x2={400} y2={42} stroke={C.c} strokeWidth={1.8}
                markerEnd="url(#tls-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={108} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.c}>
                Finished
              </text>

              <StatusBox x={250} y={150} w={230} h={42} label="세션 키 활성화" sub="이후 application data" color={C.k} progress={1} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={85} w={170} h={36} label="PSK" sub="prev resumption_secret" color={C.z} outlined />
              <ActionBox x={20} y={130} w={170} h={36} label="HKDF early_key" color={C.k} />
              <DataBox x={20} y={175} w={170} h={32} label="early_data 암호화" color={C.z} outlined />

              <motion.line x1={195} y1={193} x2={400} y2={42} stroke={C.z} strokeWidth={1.8}
                markerEnd="url(#tls-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={108} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.z}>
                CH + early_data
              </text>

              <AlertBox x={250} y={140} w={230} h={70} label="Replay 위험" sub="멱등 요청만 허용" color={C.z} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
