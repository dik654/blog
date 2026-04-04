import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step4() {
  return (<g>
    <ActionBox x={30} y={15} w={130} h={38} label="app.Commit()" sub="앱 상태 영구 저장" color={C.abci} />
    <motion.line x1={165} y1={34} x2={220} y2={34} stroke={C.abci} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={225} y={15} w={140} h={38} label="store.Save(state)" sub="CometBFT 상태 저장" color={C.save} />
    </motion.g>
    <motion.text x={210} y={70} textAnchor="middle" fontSize={10} fill={C.abci}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Commit → Save 순서 필수
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <AlertBox x={120} y={78} w={180} h={28} label="역순 시 크래시 → 상태 불일치" color={C.err} />
    </motion.g>
  </g>);
}
