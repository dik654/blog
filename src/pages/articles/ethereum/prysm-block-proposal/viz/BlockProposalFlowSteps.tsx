import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './BlockProposalFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={20} y={8} w={110} h={44} label="RANDAO 시드" sub="유사 난수" color={C.proposer} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={130} y1={30} x2={165} y2={30} stroke={C.proposer} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={170} y={8} w={110} h={44} label="공정 추첨" sub="유효 잔액 비례" color={C.proposer} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={14} w={85} h={28} label="매 슬롯 1명" color={C.why} />
    </motion.g>
    <motion.text x={200} y={72} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.6)}>
      잔액이 높을수록 확률 증가
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <DataBox x={10} y={15} w={95} h={26} label="RANDAO 시드" color={C.proposer} />
    <motion.g {...fade(0.2)}>
      <motion.line x1={105} y1={28} x2={135} y2={28} stroke={C.proposer} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    </motion.g>
    <motion.g {...fade(0.3)}>
      <ActionBox x={140} y={8} w={140} h={40} label="ComputeProposerIndex" sub="활성 검증자 목록" color={C.proposer} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={280} y1={28} x2={310} y2={28} stroke={C.proposer} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={315} y={15} w={80} h={26} label="제안자 #N" color={C.proposer} />
    </motion.g>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={10} y={10} w={100} h={40} label="Attest Pool" sub="어테스테이션 풀" color={C.attest} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={110} y1={30} x2={145} y2={30} stroke={C.attest} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={150} y={10} w={110} h={40} label="호환성 필터" sub="에폭·루트 일치" color={C.attest} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={260} y1={30} x2={295} y2={30} stroke={C.attest} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={300} y={17} w={90} h={26} label="최대 128개" color={C.attest} />
    </motion.g>
  </g>);
}
