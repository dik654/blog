import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { C } from './BLSVizData';

const Arr = ({ x1, y1, x2, y2, label }: {
  x1: number; y1: number; x2: number; y2: number; label: string;
}) => (
  <g>
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--border)" strokeWidth={0.6}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.3 }} />
    <text x={(x1 + x2) / 2} y={y1 - 5} textAnchor="middle"
      fontSize={10} fill="var(--muted-foreground)">{label}</text>
  </g>
);

const T = ({ text }: { text: string }) => (
  <text x={230} y={78} textAnchor="middle" fontSize={10}
    fill="var(--muted-foreground)">{text}</text>
);

export function Step0() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={20} y={12} w={120} h={42} c={C.dealer} t="Dealer.start()" s="비밀 다항식 생성" />
    <Arr x1={140} y1={33} x2={195} y2={33} label="PubMsg" />
    <Arr x1={140} y1={43} x2={195} y2={53} label="PrivMsg" />
    <VizBox x={195} y={12} w={110} h={42} c={C.player} t="Player 1" s="커밋먼트 수신" />
    <VizBox x={325} y={12} w={110} h={42} c={C.player} t="Player 2" s="커밋먼트 수신" />
    <T text="브로드캐스트 불필요 — 암호화 채널로 개별 전달" />
  </motion.g>;
}

export function Step1() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={20} y={12} w={130} h={42} c={C.player} t="dealer_message()" s="커밋먼트 vs share 검증" />
    <Arr x1={150} y1={33} x2={205} y2={33} label="ACK" />
    <VizBox x={205} y={12} w={120} h={42} c={C.dealer} t="Dealer" s="PlayerAck 수집" />
    <T text="검증 실패 → None 반환 (암묵적 complaint)" />
  </motion.g>;
}

export function Step2() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={20} y={12} w={130} h={42} c={C.dealer} t="Dealer.finalize()" s="SignedDealerLog 생성" />
    <Arr x1={150} y1={33} x2={205} y2={33} label="reveal" />
    <VizBox x={205} y={12} w={140} h={42} c="#ef4444" t="ACK 미수신 share" s="공개 (최대 f개)" />
    <T text="동기: 최대 f reveal / 비동기: 최대 2f reveal" />
  </motion.g>;
}

export function Step3() {
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <VizBox x={20} y={12} w={130} h={42} c={C.player} t="Player.finalize()" s="share 합산" />
    <Arr x1={150} y1={33} x2={195} y2={33} label="" />
    <VizBox x={195} y={12} w={120} h={42} c={C.output} t="Share + Output" s="개인 share + 그룹 PK" />
    <T text="그룹 공개키 96B — 검증자 수 무관 O(1) 인증서" />
  </motion.g>;
}
