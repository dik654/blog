import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './ENSResolutionVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1</text>
    <ModuleBox x={15} y={22} w={100} h={38} label="ENS Registry" sub="0x00..0C2E" color={C.registry} />
    <motion.line x1={120} y1={41} x2={160} y2={41} stroke={C.registry} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={165} y={26} w={130} h={30} label="resolver(namehash)" sub="Helios eth_call" color={C.registry} />
    </motion.g>
    <motion.line x1={300} y1={41} x2={335} y2={41} stroke={C.registry} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={340} y={30} w={120} h={22} label="resolver_addr" color={C.registry} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 2: namehash</text>
    <ActionBox x={15} y={22} w={95} h={28} label="keccak256" sub="0x0 || &quot;eth&quot;" color={C.hash} />
    <motion.line x1={115} y1={36} x2={145} y2={36} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      <ActionBox x={150} y={22} w={115} h={28} label="keccak256" sub='+ "vitalik"' color={C.hash} />
    </motion.g>
    <motion.line x1={270} y1={36} x2={300} y2={36} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
      <DataBox x={305} y={24} w={150} h={24} label="namehash = 0xee6c.." color={C.hash} />
    </motion.g>
    <motion.text x={240} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      오른쪽(eth)부터 재귀 해싱 → 왼쪽(vitalik) 결합
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 3</text>
    <ModuleBox x={15} y={22} w={100} h={38} label="Resolver" sub="리졸버 컨트랙트" color={C.resolver} />
    <motion.line x1={120} y1={41} x2={160} y2={41} stroke={C.resolver} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={165} y={26} w={120} h={30} label="addr(namehash)" sub="Helios eth_call" color={C.resolver} />
    </motion.g>
    <motion.line x1={290} y1={41} x2={320} y2={41} stroke={C.resolver} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={325} y={30} w={135} h={22} label="0xd8dA..6045" color={C.resolver} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 4: 보안</text>
    <ActionBox x={30} y={25} w={130} h={35} label="Merkle 증명 검증" sub="Helios 경량 클라이언트" color={C.hash} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={190} y={20} width={260} height={45} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={38} fontSize={10} fill={C.hash} fontWeight={600}>악의적 RPC → 가짜 주소 반환 시도</text>
      <text x={200} y={54} fontSize={10} fill="var(--muted-foreground)">→ Merkle 증명 불일치로 즉시 감지/거부</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ENSResolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 100" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
