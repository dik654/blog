import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepCheckTx() {
  return (<g>
    <DataBox x={10} y={35} w={55} h={26} label="TX" color={C.mem} />
    <motion.line x1={70} y1={48} x2={100} y2={48} stroke={C.mem} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <ActionBox x={105} y={30} w={80} h={35} label="cache.Push" sub="중복 체크" color={C.mem} />
    </motion.g>
    <motion.line x1={190} y1={48} x2={215} y2={48} stroke={C.check} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={220} y={25} w={90} h={42} label="ABCI CheckTx" sub="앱 검증" color={C.check} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <line x1={315} y1={38} x2={345} y2={30} stroke={C.check} strokeWidth={0.8} />
      <text x={375} y={34} textAnchor="middle" fontSize={10} fill={C.check}>code=0 → addTx()</text>
      <line x1={315} y1={55} x2={345} y2={63} stroke={C.err} strokeWidth={0.8} />
      <text x={375} y={68} textAnchor="middle" fontSize={10} fill={C.err}>code!=0 → reject</text>
    </motion.g>
  </g>);
}

export function StepRecheck() {
  return (<g>
    <ModuleBox x={15} y={18} w={95} h={38} label="Block Commit" sub="상태 변경" color={C.ok} />
    <motion.line x1={115} y1={37} x2={145} y2={37} stroke={C.recheck} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={150} y={18} w={85} h={38} label="Update()" sub="포함 TX 제거" color={C.recheck} />
    </motion.g>
    <motion.line x1={240} y1={37} x2={270} y2={37} stroke={C.recheck} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <ModuleBox x={275} y={18} w={110} h={38} label="recheckTxs()" sub="ABCI Recheck" color={C.recheck} />
    </motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      남은 TX를 CheckTx(type=Recheck)로 재검증 → 무효 TX 제거
    </motion.text>
  </g>);
}
