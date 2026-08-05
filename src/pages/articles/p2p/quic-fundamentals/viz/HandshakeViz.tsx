import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  c: '#6366f1',
  s: '#10b981',
  p: '#0ea5e9',
  z: '#f59e0b',
  key: '#a855f7',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '1: ClientHello (Initial)',
    body: 'Long Header + 8B dcid/scid + TLS_ClientHello (cipher_suites + key_share x25519).\n첫 패킷에 TLS 핸드셰이크가 내장 — TCP 와 달리 OS layer 별도 RTT 없음.',
  },
  {
    label: '2: ServerHello (Initial + Handshake)',
    body: 'Initial: ServerHello + key_share. Handshake: EE + Cert + CV + Finished.\nshared = x25519(cli_eph, srv_ks) → hs_keys = HKDF(shared).',
  },
  {
    label: '3: 1-RTT 완료 (Client Finished)',
    body: 'verify_data = HMAC(hs_key, transcript). master/1rtt 키 도출.\nTCP+TLS 3-RTT → QUIC 1-RTT — 한 왕복 내 핸드셰이크 + 첫 데이터.',
  },
  {
    label: '4: 0-RTT (PSK Resumption)',
    body: '이전 세션의 resumption_secret 으로 early_key 도출.\nClientHello 와 함께 early_data 전송 — 즉시 데이터.\n주의: 재전송 위험 → 멱등 요청만 + retry_token anti-amplification.',
  },
];

export default function HandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="qh-arr-c" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.c} />
            </marker>
            <marker id="qh-arr-s" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.s} />
            </marker>
          </defs>

          <ModuleBox x={10} y={20} w={90} h={42} label="Client" color={C.c} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Server" color={C.s} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={85} w={170} h={36} label="dcid/scid 8B" color={C.c} outlined />
              <DataBox x={20} y={130} w={170} h={36} label="TLS ClientHello" sub="key_share x25519" color={C.c} outlined />
              <DataBox x={20} y={175} w={170} h={32} label="token = []" sub="첫 연결" color={C.c} outlined />

              <motion.line x1={195} y1={150} x2={400} y2={42} stroke={C.c} strokeWidth={1.5}
                markerEnd="url(#qh-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={92} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.c}>
                Initial packet
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={310} y={85} w={170} h={32} label="ServerHello" sub="key_share x25519_srv" color={C.s} outlined />
              <DataBox x={310} y={120} w={170} h={32} label="EE + Cert + CV + Finished" color={C.s} outlined />
              <ActionBox x={310} y={155} w={170} h={42} label="HKDF(shared)" sub="→ hs_keys" color={C.key} />

              <motion.line x1={400} y1={62} x2={195} y2={150} stroke={C.s} strokeWidth={1.5}
                markerEnd="url(#qh-arr-s)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.3 }} />
              <DataBox x={20} y={130} w={170} h={36} label="응답 수신" sub="ECDH + 인증서 검증" color={C.s} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={85} w={170} h={42} label="Finished" sub="HMAC(hs_key, hash)" color={C.c} />
              <ActionBox x={20} y={135} w={170} h={42} label="HKDF derive" sub="master / 1rtt_key" color={C.key} />

              <motion.line x1={195} y1={106} x2={400} y2={42} stroke={C.c} strokeWidth={1.8}
                markerEnd="url(#qh-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={86} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.c}>
                Handshake Finished
              </text>

              <StatusBox x={250} y={150} w={230} h={42} label="1-RTT 도달" sub="앱 데이터 가능" color={C.p} progress={1} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={85} w={170} h={36} label="PSK" sub="prev resumption_secret" color={C.z} outlined />
              <ActionBox x={20} y={130} w={170} h={42} label="HKDF early_key" sub='"early traffic"' color={C.key} />
              <DataBox x={20} y={180} w={170} h={32} label="enc(early_key, app)" color={C.z} outlined />

              <motion.line x1={195} y1={195} x2={400} y2={42} stroke={C.z} strokeWidth={1.8}
                markerEnd="url(#qh-arr-c)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={295} y={108} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.z}>
                CH + early_data → 0-RTT
              </text>

              <AlertBox x={250} y={140} w={230} h={70} label="Replay 위험" sub="멱등 요청만 · retry_token" color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
