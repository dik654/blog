import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './OverviewVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={90} h={42} label="MetaMask" sub="지갑" color={C.problem} />
    <motion.line x1={115} y1={36} x2={155} y2={36} stroke={C.problem} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={160} y={15} w={100} h={42} label="Infura RPC" sub="중앙 서버" color={C.problem} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <AlertBox x={290} y={10} w={170} h={50} label="IP + 주소 + TX 전부 노출" sub="프로파일링 가능" color={C.problem} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={30} y={25} w={130} h={40} label="Helios 검증" sub="BLS + Merkle" color={C.helios} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={185} y={20} width={260} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={195} y={38} fontSize={10} fill={C.helios} fontWeight={600}>블록 헤더: Sync Committee BLS 서명 검증</text>
      <text x={195} y={54} fontSize={10} fill="var(--muted-foreground)">상태 응답: Merkle-Patricia 증명 검증</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={20} y={25} w={110} h={40} label="ORAM 배치" sub="더미 쿼리 혼합" color={C.oram} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={150} y={20} width={300} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={160} y={38} fontSize={10} fill={C.oram} fontWeight={600}>진짜 1개 + 더미 K개 → 셔플 → 배치 전송</text>
      <text x={160} y={54} fontSize={10} fill="var(--muted-foreground)">서버 시점: Pr(식별) = 1/(K+1)</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={20} y={25} w={120} h={40} label="Dandelion++" sub="Stem → Fluff" color={C.dandelion} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={160} y={20} width={290} height={48} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={170} y={38} fontSize={10} fill={C.dandelion} fontWeight={600}>Stem: 단일 피어 3~5홉 → Fluff: 전체 가십</text>
      <text x={170} y={54} fontSize={10} fill="var(--muted-foreground)">관찰자가 TX 발신 노드를 특정할 수 없다</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 100" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
