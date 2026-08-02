import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.16, duration: 0.5 };
const C = {
  hdr: '#94a3b8',
  pn: '#a855f7',
  body: '#0ea5e9',
  tag: '#10b981',
  hp: '#ec4899',
  aead: '#6366f1',
  warn: '#f59e0b',
  ok: '#10b981',
};

const STEPS = [
  {
    label: 'QUIC 패킷 구조 — 헤더 / PN / 페이로드 / Tag',
    body: '평문 영역이 거의 없음. Initial 조차 version-specific salt 로 유도된 키로 보호.',
  },
  {
    label: 'AEAD — 페이로드 암호화 + 무결성 태그',
    body: 'AES-128-GCM 또는 ChaCha20-Poly1305. 키는 TLS 1.3, nonce = packet_number ⊕ iv, AAD = header bytes.',
  },
  {
    label: 'Header Protection — 패킷 번호 노출 방지',
    body: 'PN 평문 노출은 트래픽 분석에 취약. AES-ECB 샘플로 PN/flags 만 별도 암호화.',
  },
  {
    label: '4단계 키 도메인 — Initial / Handshake / 0-RTT / 1-RTT',
    body: '단계마다 별도 키. 단계 전이는 HKDF-derive. 키 노출 영향이 단계 안에 갇힘.',
  },
  {
    label: 'Key Update — 주기적 키 회전으로 forward secrecy',
    body: '헤더 플래그가 키 업데이트 신호. 새 키로 derive 후 기존 키 폐기.',
  },
];

interface SegProps { x: number; w: number; label: string; sub: string; color: string; }

function Seg({ x, w, label, sub, color }: SegProps) {
  return (
    <g>
      <rect x={x} y={36} width={w} height={36} rx={4}
        fill={`${color}15`} stroke={color} strokeWidth={0.8} />
      <text x={x + w / 2} y={52} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>
        {label}
      </text>
      <text x={x + w / 2} y={64} textAnchor="middle" fontSize={7.5} fill={color} opacity={0.8}>
        {sub}
      </text>
    </g>
  );
}

export default function PacketProtectionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1 || step === 2) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                QUIC Packet Layout
              </text>
              <Seg x={20} w={70} label="Header" sub="flags + CIDs" color={C.hdr} />
              <Seg x={92} w={50} label="PN" sub="packet num" color={C.pn} />
              <Seg x={144} w={220} label="Payload (Frames)" sub="STREAM, ACK, CRYPTO ..." color={C.body} />
              <Seg x={366} w={94} label="Auth Tag" sub="16 bytes" color={C.tag} />

              {step === 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <rect x={144} y={32} width={316} height={44} rx={5}
                    fill="none" stroke={C.aead} strokeWidth={1.4} strokeDasharray="4 3" />
                  <text x={302} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.aead}>
                    AEAD encrypt(payload, tag)
                  </text>
                  <text x={302} y={106} textAnchor="middle" fontSize={8.5} fill={C.aead} opacity={0.85}>
                    nonce = pn ⊕ iv,  AAD = header
                  </text>
                  <text x={302} y={120} textAnchor="middle" fontSize={8.5} fill={C.aead} opacity={0.7}>
                    AES-128-GCM / ChaCha20-Poly1305
                  </text>
                </motion.g>
              )}

              {step === 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <rect x={20} y={32} width={122} height={44} rx={5}
                    fill="none" stroke={C.hp} strokeWidth={1.4} strokeDasharray="4 3" />
                  <text x={81} y={92} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hp}>
                    Header Protection
                  </text>
                  <text x={81} y={106} textAnchor="middle" fontSize={8} fill={C.hp} opacity={0.85}>
                    AES-ECB sample
                  </text>
                  <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#9ca3af">
                    PN 평문 노출 → 트래픽 분석 가능 → 별도 암호화로 마스킹
                  </text>
                </motion.g>
              )}

              {step === 0 && (
                <text x={240} y={140} textAnchor="middle" fontSize={9} fill="#9ca3af">
                  평문 영역은 CIDs 정도. payload 와 PN 은 모두 보호 대상.
                </text>
              )}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {[
                { x: 20, label: 'Initial', sub: 'HKDF(salt)', color: '#0ea5e9' },
                { x: 130, label: 'Handshake', sub: 'TLS HS keys', color: '#a855f7' },
                { x: 240, label: '0-RTT', sub: 'PSK derived', color: '#10b981' },
                { x: 350, label: '1-RTT', sub: 'app traffic', color: '#f59e0b' },
              ].map((k, i) => (
                <g key={k.label}>
                  <ModuleBox x={k.x} y={45} w={100} h={48} label={k.label} sub={k.sub} color={k.color} />
                  {i < 3 && (
                    <motion.path d={`M ${k.x + 100} 69 L ${k.x + 130} 69`}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.2 }}
                      stroke="#94a3b8" strokeWidth={1.2} fill="none" markerEnd="url(#kma)" />
                  )}
                </g>
              ))}
              <defs>
                <marker id="kma" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
                  <polygon points="0 0, 5 2.5, 0 5" fill="#94a3b8" />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="#9ca3af">
                각 단계는 별도 키 도메인. 단계 키 유출이 다른 단계로 번지지 않음.
              </text>
              <text x={240} y={138} textAnchor="middle" fontSize={9} fill="#9ca3af">
                전이는 HKDF derive — 일방향, 거꾸로 추적 불가
              </text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
                Key Update — periodic rotation
              </text>
              <DataBox x={50} y={50} w={120} h={36}
                label="key_n" sub="현재 1-RTT 키" color={C.aead} outlined />
              <motion.path d="M 175 68 L 305 68"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                stroke={C.warn} strokeWidth={1.4} fill="none" markerEnd="url(#kua)" />
              <defs>
                <marker id="kua" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill={C.warn} />
                </marker>
              </defs>
              <text x={240} y={62} textAnchor="middle" fontSize={8.5} fill={C.warn} fontWeight={600}>
                HKDF-derive
              </text>
              <text x={240} y={82} textAnchor="middle" fontSize={8} fill={C.warn} opacity={0.8}>
                헤더 flag 로 신호
              </text>
              <DataBox x={310} y={50} w={120} h={36}
                label="key_n+1" sub="새 1-RTT 키" color={C.ok} outlined />
              <text x={240} y={130} textAnchor="middle" fontSize={9} fill="#9ca3af">
                key_n 폐기 → 과거 캡처가 미래 키로 복호 불가 (forward secrecy)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
