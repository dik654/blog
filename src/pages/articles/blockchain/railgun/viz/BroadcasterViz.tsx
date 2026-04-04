import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BroadcasterVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={90} h={45} label="User" sub="오프체인" color={C.user} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={140} y={15} w={120} h={28} label="ZK proof 생성" color={C.user} />
      <ActionBox x={140} y={48} w={120} h={28} label="TX 데이터 조립" color={C.user} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={285} y={22} width={170} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={295} y={38} fontSize={10} fill={C.user}>직접 제출 시 msg.sender 노출</text>
      <text x={295} y={52} fontSize={10} fill="var(--muted-foreground)">→ Broadcaster에 위임</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={15} y={10} w={120} h={35} label="AES-256-GCM" sub="암호화" color={C.waku} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={155} y={5} width={310} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={165} y={22} fontSize={10} fill="var(--muted-foreground)">ECDH(userKey, broadcasterPubKey) → sharedSecret</text>
      <text x={165} y={38} fontSize={10} fill="var(--muted-foreground)">ciphertext = AES-GCM(TX, sharedSecret)</text>
      <text x={165} y={54} fontSize={10} fill={C.waku} fontWeight={600}>Waku.publish("railgun-tx", ciphertext)</text>
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      P2P 네트워크 경유 — IP 추적 어려움
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <ModuleBox x={15} y={10} w={100} h={45} label="Broadcaster" sub="릴레이어" color={C.broadcaster} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={135} y={5} width={330} height={65} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={145} y={22} fontSize={10} fill="var(--muted-foreground)">subscribe("railgun-tx") → ciphertext 수신</text>
      <text x={145} y={38} fontSize={10} fill="var(--muted-foreground)">복호화 → TX 데이터 획득</text>
      <text x={145} y={54} fontSize={10} fill={C.broadcaster} fontWeight={600}>gasPrice 확인: fee ≥ minReward</text>
      <text x={145} y={66} fontSize={10} fill="var(--muted-foreground)">수수료 충분 → 온체인 제출 결정</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={15} y={10} w={155} h={38} label="eth_sendRawTransaction" sub="Broadcaster EOA" color={C.chain} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={190} y={5} width={275} height={65} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={22} fontSize={10} fill="var(--muted-foreground)">Broadcaster가 자신의 EOA로 서명</text>
      <text x={200} y={40} fontSize={10} fill={C.chain} fontWeight={600}>msg.sender = 0xBroadcaster</text>
      <text x={200} y={55} fontSize={10} fill={C.broadcaster} fontWeight={600}>≠ 0xUser (실제 사용자)</text>
      <text x={200} y={66} fontSize={10} fill="var(--muted-foreground)">→ 발신자 프라이버시 보호 완료</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function BroadcasterViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
