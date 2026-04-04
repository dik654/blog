import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './UserOpVizData';

function Step0() {
  return (<g>
    <rect x={20} y={15} width={200} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={30} y={33} fontSize={10} fill="var(--muted-foreground)">sender:</text>
    <motion.text x={80} y={33} fontSize={11} fontWeight={600} fill={C.addr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      0x1234..abcd
    </motion.text>
    <text x={30} y={48} fontSize={10} fill="var(--muted-foreground)">Smart Account (not EOA)</text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <rect x={260} y={18} width={180} height={34} rx={6} fill={`${C.addr}10`} stroke={C.addr} strokeWidth={0.8} />
      <text x={350} y={35} textAnchor="middle" fontSize={10} fill={C.addr}>validateUserOp() 보유</text>
      <text x={350} y={47} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">서명 검증 로직 교체 가능</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={30} y={20} width={140} height={36} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={40} y={37} fontSize={10} fill="var(--muted-foreground)">nonce:</text>
    <motion.text x={80} y={37} fontSize={14} fontWeight={700} fill={C.addr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>7</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={200} y={40} fontSize={12} fill="var(--muted-foreground)">→</text>
      <rect x={220} y={22} width={100} height={32} rx={6} fill={`${C.data}10`} stroke={C.data} strokeWidth={0.8} />
      <text x={270} y={37} textAnchor="middle" fontSize={10} fill={C.data}>검증 후: 8</text>
      <text x={270} y={49} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">+1 증가</text>
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      EntryPoint가 nonce 관리 — 재사용 방지
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <rect x={15} y={15} width={230} height={45} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={25} y={32} fontSize={10} fill="var(--muted-foreground)">callData:</text>
    <motion.text x={80} y={32} fontSize={10} fontWeight={600} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      transfer(0x5678.., 500 USDC)
    </motion.text>
    <text x={25} y={50} fontSize={10} fill="var(--muted-foreground)">abi.encode → bytes</text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <rect x={270} y={20} width={170} height={38} rx={6} fill={`${C.data}08`} stroke={C.data} strokeWidth={0.7} />
      <text x={355} y={36} textAnchor="middle" fontSize={10} fill={C.data}>sender.call(callData)</text>
      <text x={355} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">EntryPoint가 대신 실행</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
      <rect x={15} y={15} width={140} height={30} rx={6} fill={`${C.gas}10`} stroke={C.gas} strokeWidth={0.8} />
      <text x={85} y={34} textAnchor="middle" fontSize={10} fill={C.gas}>ECDSA: 65 bytes</text>
    </motion.g>
    <text x={162} y={34} fontSize={12} fill="var(--muted-foreground)">||</text>
    <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <rect x={175} y={15} width={170} height={30} rx={6} fill={`${C.sig}10`} stroke={C.sig} strokeWidth={0.8} />
      <text x={260} y={34} textAnchor="middle" fontSize={10} fill={C.sig}>Dilithium: 2420 bytes</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <rect x={370} y={15} width={90} height={30} rx={15} fill={`${C.sig}15`} stroke={C.sig} strokeWidth={1} />
      <text x={415} y={34} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sig}>2485B</text>
    </motion.g>
    <motion.text x={240} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      기존 대비 38배 크기 — 가스비 증가 but 양자 내성 확보
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function UserOpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
