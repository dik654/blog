import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './CheckTxFlowVizData';

export function Step0() {
  return (<g>
    <DataBox x={15} y={35} w={55} h={26} label="TX" color={C.tx} />
    <motion.line x1={75} y1={48} x2={105} y2={48} stroke={C.tx} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.1, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <ActionBox x={110} y={30} w={85} h={35} label="cache.Push()" sub="중복 체크" color={C.cache} />
    </motion.g>
    <motion.line x1={200} y1={48} x2={230} y2={48} stroke={C.cache} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.4, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={235} y={30} w={80} h={35} label="Size 체크" sub="용량 확인" color={C.cache} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={360} y={42} fontSize={10} fill={C.err}>중복 → ErrTxInCache</text>
      <text x={360} y={58} fontSize={10} fill={C.err}>가득 참 → ErrMempoolIsFull</text>
    </motion.g>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={20} y={30} w={85} h={35} label="preCheck(tx)" sub="경량 검증" color={C.cache} />
    <motion.line x1={110} y1={48} x2={150} y2={48} stroke={C.abci} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={155} y={22} w={130} h={48} label="CheckTxAsync()" sub="ABCI → 앱 검증" color={C.abci} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={310} y={30} width={90} height={35} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={355} y={46} textAnchor="middle" fontSize={10} fill="var(--foreground)">콜백 등록</text>
      <text x={355} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">reqResCb()</text>
    </motion.g>
  </g>);
}
