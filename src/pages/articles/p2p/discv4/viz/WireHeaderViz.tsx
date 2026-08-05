import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { mac: '#6366f1', sig: '#10b981', type: '#f59e0b', payload: '#a78bfa' };

const STEPS = [
  {
    label: '97-byte fixed header layout',
    body: '모든 6가지 패킷 타입이 같은 헤더 형태.\n앞 32B는 무결성, 다음 65B는 인증, 다음 1B는 라우팅, 나머지는 타입별 RLP.',
  },
  {
    label: 'MAC 32B — 무결성 게이트',
    body: 'keccak256(sig + type + payload).\n불일치면 즉시 폐기 — ecrecover 비용을 아낀다.\n암호학적 인증은 Signature 담당.',
  },
  {
    label: 'Signature 65B — secp256k1 ECDSA',
    body: 'r(32) + s(32) + v(1).\n서명 대상 = keccak256(type + payload).\n수신자 ecrecover로 from 필드 없이 발신자 식별.',
  },
  {
    label: 'Type 1B + Payload — RLP-encoded struct',
    body: '0x01~0x06로 6가지 패킷 타입 구분.\nPayload는 패킷별 구조체의 RLP 직렬화 (Ping/Pong/Findnode/...).',
  },
];

export default function WireHeaderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
            <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
              [32B MAC] [65B Signature] [1B Type] [RLP Payload]
            </text>
            <ModuleBox
              x={20}
              y={50}
              w={70}
              h={60}
              label="MAC"
              sub="32 B"
              color={step === 0 || step === 1 ? C.mac : 'var(--muted-foreground)'}
            />
            <ModuleBox
              x={100}
              y={50}
              w={130}
              h={60}
              label="Signature"
              sub="65 B"
              color={step === 0 || step === 2 ? C.sig : 'var(--muted-foreground)'}
            />
            <ModuleBox
              x={240}
              y={50}
              w={50}
              h={60}
              label="Type"
              sub="1 B"
              color={step === 0 || step === 3 ? C.type : 'var(--muted-foreground)'}
            />
            <ModuleBox
              x={300}
              y={50}
              w={160}
              h={60}
              label="RLP Payload"
              sub="variable"
              color={step === 0 || step === 3 ? C.payload : 'var(--muted-foreground)'}
            />
            {step === 1 && (
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill={C.mac}>
                MAC = keccak256(sig + type + payload). 무결성 게이트.
              </text>
            )}
            {step === 2 && (
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill={C.sig}>
                ECDSA on keccak256(type + payload). pubkey는 ecrecover로 도출.
              </text>
            )}
            {step === 3 && (
              <text x={240} y={140} textAnchor="middle" fontSize={9.5} fill={C.type}>
                Type 1B → Payload 형태 결정. RLP self-describing.
              </text>
            )}
            {step === 0 && (
              <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                헤더 97B 고정 + 페이로드 가변. 총 ≤ 1280 B.
              </text>
            )}
            <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
              keccak256 / secp256k1 / 0x01~06 / 구조체 직렬화.
            </text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
