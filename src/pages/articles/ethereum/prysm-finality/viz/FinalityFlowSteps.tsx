import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './FinalityFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={20} y={8} w={120} h={44} label="포크 선택" sub="LMD-GHOST" color={C.cp} />
    <motion.g {...fade(0.3)}>
      <rect x={170} y={8} width={80} height={44} rx={6}
        fill="var(--card)" stroke={C.final} strokeWidth={1} strokeDasharray="4 3" />
      <text x={210} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.final}>뒤집힐 수</text>
      <text x={210} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.final}>있음</text>
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={250} y1={30} x2={285} y2={30} stroke={C.final} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <ModuleBox x={290} y={8} w={100} h={44} label="Finality" sub="절대 불가역" color={C.final} />
    </motion.g>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={10} y={16} fontSize={10} fontWeight={600} fill={C.cp}>Checkpoint 구조</text>
    <motion.g {...fade(0.2)}>
      <rect x={10} y={24} width={180} height={40} rx={6}
        fill={`${C.cp}10`} stroke={C.cp} strokeWidth={0.8} />
      <text x={100} y={42} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={C.cp}>
        {'{ Epoch, Root }'}
      </text>
      <text x={100} y={56} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        에폭 경계 첫 슬롯 블록
      </text>
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={220} y={24} w={90} h={22} label="Epoch 150" color={C.cp} />
      <DataBox x={220} y={50} w={90} h={22} label="Slot 4800" color={C.cp} />
    </motion.g>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={10} y={15} w={110} h={38} label="타겟 투표" sub="활성 밸런스 기준" color={C.vote} />
    <motion.g {...fade(0.3)}>
      <StatusBox x={150} y={8} w={130} h={48} label="투표율" sub="2/3 (66.7%) 이상" color={C.vote} progress={0.72} />
    </motion.g>
    <motion.g {...fade(0.6)}>
      <motion.line x1={280} y1={32} x2={310} y2={32} stroke={C.vote} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <DataBox x={315} y={19} w={70} h={26} label="통과" color={C.vote} />
    </motion.g>
  </g>);
}
