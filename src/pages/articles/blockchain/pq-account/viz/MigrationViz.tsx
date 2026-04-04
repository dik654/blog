import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './MigrationVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={100} h={40} label="EOA" sub="ECDSA only" color={C.ecdsa} />
    <motion.line x1={125} y1={35} x2={185} y2={35} stroke={C.ecdsa} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={190} y={15} w={130} h={40} label="Smart Account" sub="ERC-4337 배포" color={C.ecdsa} />
    </motion.g>
    <motion.text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      자산 이전 — 서명 로직 교체 가능
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <ModuleBox x={20} y={15} w={120} h={40} label="Smart Account" sub="ECDSA 활성" color={C.ecdsa} />
    <motion.line x1={145} y1={35} x2={195} y2={35} stroke={C.pq} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={200} y={20} w={160} h={30} label="dilithiumPubkey" sub="1312 bytes 추가" color={C.pq} />
    </motion.g>
    <motion.text x={240} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      addDilithiumKey() — PQ 키 등록
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={20} y={15} w={120} h={28} label="ECDSA sig" sub="65B" color={C.ecdsa} />
    <DataBox x={20} y={55} w={120} h={28} label="Dilithium sig" sub="2420B" color={C.pq} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={25} width={280} height={40} rx={6} fill={`${C.hybrid}08`} stroke={C.hybrid} strokeWidth={0.8} />
      <text x={310} y={43} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hybrid}>
        require(ecdsaValid &amp;&amp; dilithiumValid)
      </text>
      <text x={310} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        두 서명 모두 유효해야 통과
      </text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <rect x={15} y={15} width={150} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={90} y={32} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">ecdsaKey =</text>
    <motion.text x={90} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.final}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      address(0)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={200} y={12} width={250} height={48} rx={6} fill={`${C.final}08`} stroke={C.final} strokeWidth={1} />
      <text x={325} y={32} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.final}>PQ-only Account</text>
      <text x={325} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        Dilithium 서명만으로 운영 — 양자 내성
      </text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function MigrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
