import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './SortitionVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StepBeacon() {
  return (
    <g>
      <ModuleBox x={15} y={18} w={95} h={44} label="Beacon" sub="drand 랜덤" color={C.vrf} />
      <motion.line x1={115} y1={40} x2={155} y2={40} stroke={C.vrf} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <ActionBox x={160} y={18} w={130} h={44} label="DrawRandomness" sub="DomainSep + miner" color={C.vrf} />
      </motion.g>
      <motion.line x1={295} y1={40} x2={325} y2={40} stroke={C.thresh} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <DataBox x={330} y={24} w={80} h={30} label="vrfBase" color={C.thresh} />
      </motion.g>
      <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 0.7, ...sp }}>
        에폭 + 마이너 주소로 바인딩된 고유 시드
      </motion.text>
    </g>
  );
}

export function StepVRF() {
  return (
    <g>
      <DataBox x={15} y={28} w={80} h={30} label="vrfBase" color={C.vrf} />
      <motion.line x1={100} y1={43} x2={135} y2={43} stroke={C.vrf} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <ActionBox x={140} y={20} w={140} h={44} label="VerifyElectionPoStVRF" sub="BLS 서명 검증" color={C.thresh} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, ...sp }}>
        <text x={350} y={38} fontSize={10} fontWeight={600} fill={C.poisson}>통과</text>
        <text x={350} y={55} fontSize={10} fill="var(--muted-foreground)">공개키로 검증 가능</text>
      </motion.g>
    </g>
  );
}
