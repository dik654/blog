import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { C } from './P2PAuthVizData';

const L = ({ x1, y1, x2, y2 }: {
  x1: number; y1: number; x2: number; y2: number;
}) => <line x1={x1} y1={y1} x2={x2} y2={y2}
  stroke="var(--border)" strokeWidth={0.6} />;

const T = ({ text }: { text: string }) => (
  <text x={240} y={78} textAnchor="middle" fontSize={10}
    fill="var(--muted-foreground)">{text}</text>
);

export function Step0() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={10} y={10} w={120} h={42} c={C.handshake} t="SecretKey::new()" s="임시 X25519 키" />
    <L x1={130} y1={31} x2={160} y2={31} />
    <VizBox x={160} y={10} w={130} h={42} c={C.handshake} t="exchange()" s="DH → SharedSecret" />
    <L x1={290} y1={31} x2={310} y2={31} />
    <VizBox x={310} y={10} w={150} h={42} c={C.handshake} t="ChaCha20-Poly1305" s="HKDF → 대칭키 도출" />
    <T text="non-contributory 검사 → 약한 키 거부" />
  </motion.g>;
}

export function Step1() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={6} y={12} w={100} h={38} c={C.sender} t="Unlimited" s="제한 없음" />
    <VizBox x={118} y={12} w={100} h={38} c={C.sender} t="Limited" s="레이트 리밋" />
    <VizBox x={230} y={12} w={100} h={38} c={C.sender} t="Checked" s="크기 검증" />
    <VizBox x={342} y={12} w={120} h={38} c={C.sender} t="Sender" s="blanket impl" />
    {[106, 218, 330].map((x, i) => <L key={i} x1={x} y1={31} x2={x + 12} y2={31} />)}
    <text x={240} y={74} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">LimitedSender 구현하면 Sender 자동 획득</text>
  </motion.g>;
}

export function Step2() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={20} y={12} w={120} h={38} c={C.relay} t="Recipients::All" s="전체 피어" />
    <VizBox x={165} y={12} w={140} h={38} c={C.relay} t="Recipients::Some" s="특정 피어 집합" />
    <VizBox x={330} y={12} w={120} h={38} c={C.relay} t="Recipients::One" s="단일 피어" />
    <T text="Channel(u64) 멀티플렉싱 — 단일 TCP, 다중 프로토콜" />
  </motion.g>;
}

export function Step3() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={30} y={12} w={170} h={42} c={C.blocker} t="block!(blocker, peer)" s="warn 로깅 + 즉시 차단" />
    <L x1={200} y1={33} x2={240} y2={33} />
    <VizBox x={240} y={12} w={180} h={42} c={C.blocker} t="연결 종료 + 재연결 거부" s="후속 메시지 전부 드롭" />
    <T text="프로토콜 수준 즉시 격리 — 합의 안전성 보장" />
  </motion.g>;
}
