import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = {
  init: '#0ea5e9',
  hs: '#6366f1',
  zrtt: '#10b981',
  one: '#a855f7',
  retry: '#f59e0b',
  ver: '#94a3b8',
  warn: '#f43f5e',
};

const STEPS = [
  {
    label: 'QUIC 패킷 타입 — 핸드셰이크 단계별 분리',
    body: 'TLS 1.3 메시지를 단일 채널로 흘리지 않고, 패킷 타입으로 단계와 키 도메인을 구분.',
  },
  {
    label: 'Initial — Long header, ClientHello 운반',
    body: 'CRYPTO 프레임에 TLS ClientHello 가 들어감. 키는 version-specific salt 로 HKDF 유도, 사실상 평문.',
  },
  {
    label: 'Handshake — TLS 핸드셰이크 메시지 + 인증',
    body: 'ServerHello, EncryptedExtensions, Certificate, Finished. 키 교환 직후 Handshake 키로 보호.',
  },
  {
    label: '0-RTT / 1-RTT — 애플리케이션 데이터',
    body: '1-RTT 는 핸드셰이크 후 일반 데이터, 0-RTT 는 PSK 로 첫 패킷부터 가능. replay 위험은 멱등 요청만으로 완화.',
  },
  {
    label: 'Retry / Version — DoS 방어와 협상',
    body: 'Retry 는 stateless 토큰으로 amplification 방어. Version Negotiation 으로 버전 협상.',
  },
];

interface PacketRowProps {
  y: number; type: string; color: string; phase: string; note: string; active?: boolean;
}

function PacketRow({ y, type, color, phase, note, active }: PacketRowProps) {
  return (
    <motion.g initial={{ opacity: active ? 0 : 0.4 }}
      animate={{ opacity: active ? 1 : 0.35 }} transition={sp}>
      <DataBox x={20} y={y} w={92} h={26} label={type} color={color} outlined={active} />
      <rect x={130} y={y + 3} width={120} height={20} rx={3}
        fill={`${color}15`} stroke={active ? color : 'var(--border)'} strokeWidth={0.5} />
      <text x={190} y={y + 17} textAnchor="middle" fontSize={9} fill={color} fontWeight={600}>
        {phase}
      </text>
      <text x={265} y={y + 17} fontSize={8.5} fill="#9ca3af">{note}</text>
    </motion.g>
  );
}

export default function HandshakePacketViz() {
  const activeMap: Record<number, string[]> = {
    0: ['Initial', 'Handshake', '0-RTT', '1-RTT', 'Retry', 'VerNeg'],
    1: ['Initial'],
    2: ['Handshake'],
    3: ['0-RTT', '1-RTT'],
    4: ['Retry', 'VerNeg'],
  };

  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const isActive = (k: string) => activeMap[step]?.includes(k);
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <PacketRow y={10} type="Initial" color={C.init} phase="connect"
              note="ClientHello, 평문 일부" active={isActive('Initial')} />
            <PacketRow y={42} type="Handshake" color={C.hs} phase="auth"
              note="EE + Cert + Finished" active={isActive('Handshake')} />
            <PacketRow y={74} type="0-RTT" color={C.zrtt} phase="early data"
              note="PSK, 첫 패킷부터" active={isActive('0-RTT')} />
            <PacketRow y={106} type="1-RTT" color={C.one} phase="application"
              note="일반 트래픽" active={isActive('1-RTT')} />
            <PacketRow y={138} type="Retry" color={C.retry} phase="DoS 방어"
              note="stateless 토큰" active={isActive('Retry')} />
            <PacketRow y={170} type="Version Neg" color={C.ver} phase="버전 협상"
              note="server downgrade signal" active={isActive('VerNeg')} />

            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <line x1={250} y1={23} x2={420} y2={23} stroke={C.init} strokeWidth={0.6} />
                <text x={420} y={20} textAnchor="end" fontSize={8} fill={C.init}>
                  CRYPTO frame ⊃ TLS_ClientHello
                </text>
              </motion.g>
            )}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={400} y={70} width={70} height={36} rx={6}
                  fill={`${C.warn}10`} stroke={C.warn} strokeWidth={0.7} strokeDasharray="3 2" />
                <text x={435} y={84} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C.warn}>
                  replay
                </text>
                <text x={435} y={96} textAnchor="middle" fontSize={7.5} fill={C.warn} opacity={0.8}>
                  GET only
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
