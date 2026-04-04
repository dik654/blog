import { motion } from 'framer-motion';
import { C } from './OverviewVizData';

const B = ({ x, y, w, h, c, t, s }: {
  x: number; y: number; w: number; h: number;
  c: string; t: string; s: string;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--card)" />
    <rect x={x} y={y} width={w} height={h} rx={5}
      fill={`${c}10`} stroke={c} strokeWidth={1} />
    <text x={x + w / 2} y={y + 18} textAnchor="middle"
      fontSize={10} fontWeight={600} fill={c}>{t}</text>
    <text x={x + w / 2} y={y + 34} textAnchor="middle"
      fontSize={10} fill="var(--muted-foreground)">{s}</text>
  </g>
);

const L = ({ x1, y1, x2, y2 }: {
  x1: number; y1: number; x2: number; y2: number;
}) => <line x1={x1} y1={y1} x2={x2} y2={y2}
  stroke="var(--border)" strokeWidth={0.6} />;

const T = ({ x, y, text }: { x: number; y: number; text: string }) => (
  <text x={x} y={y} textAnchor="middle" fontSize={10}
    fill="var(--muted-foreground)">{text}</text>
);

export function Step0() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <B x={20} y={15} w={130} h={48} c={C.signer} t="Signer" s="sign(ns, msg) → Sig" />
    <L x1={150} y1={39} x2={175} y2={39} />
    <B x={175} y={15} w={130} h={48} c={C.signer} t="PrivateKey" s="Signer + Encode" />
    <T x={240} y={88} text="namespace 필수 → 크로스 도메인 리플레이 차단" />
  </motion.g>;
}

export function Step1() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <B x={10} y={15} w={130} h={48} c={C.verifier} t="Verifier" s="verify(ns, msg, sig)" />
    <L x1={140} y1={39} x2={165} y2={39} />
    <B x={165} y={15} w={140} h={48} c={C.verifier} t="PublicKey" s="+ Ord + Hash + Array" />
    <L x1={305} y1={39} x2={330} y2={39} />
    <B x={330} y={15} w={130} h={48} c={C.verifier} t="Signature" s="+ Clone + Encode" />
    <T x={240} y={88} text="Ord + Array → BTreeSet/HashMap 키로 피어 관리" />
  </motion.g>;
}

export function Step2() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <B x={30} y={10} w={110} h={45} c={C.batch} t="add()" s="서명 누적" />
    <B x={170} y={10} w={110} h={45} c={C.batch} t="add()" s="서명 누적" />
    <B x={310} y={10} w={140} h={45} c={C.batch} t="verify(rng)" s="랜덤 가중 일괄 검증" />
    <L x1={140} y1={33} x2={170} y2={33} />
    <L x1={280} y1={33} x2={310} y2={33} />
    <T x={240} y={80} text="랜덤 가중합으로 (c₁+d, c₂-d) 위조 배치 방지" />
  </motion.g>;
}

export function Step3() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <B x={40} y={15} w={160} h={48} c={C.recover} t="Recoverable" s="서명 65B (r + s + v)" />
    <L x1={200} y1={39} x2={240} y2={39} />
    <B x={240} y={15} w={180} h={48} c={C.recover} t="recover_signer()" s="v → 공개키 복원" />
    <T x={240} y={88} text="secp256r1 전용 — EIP-712 스타일 서명 검증" />
  </motion.g>;
}
