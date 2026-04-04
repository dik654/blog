import { motion } from 'framer-motion';
import { C } from './StateStructVizData';

export function Step3() {
  return (<g>
    <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
      <rect x={30} y={25} width={100} height={40} rx={8} fill={`${C.state}10`}
        stroke={C.state} strokeWidth={0.8} />
      <text x={80} y={49} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.state}>State</text>
    </motion.g>
    <motion.line x1={135} y1={45} x2={190} y2={45} stroke={C.app} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={195} y={22} width={110} height={45} rx={8} fill="var(--card)" stroke={C.app} strokeWidth={0.8} />
      <text x={250} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.app}>store.Save()</text>
      <text x={250} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">LevelDB 원자 기록</text>
    </motion.g>
    <motion.line x1={310} y1={45} x2={350} y2={45} stroke={C.app} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
    <motion.text x={380} y={42} textAnchor="middle" fontSize={18} fill={C.state}
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }}>
      {'✓'}
    </motion.text>
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill={C.state}>
      크래시 시 이 저장 시점에서 복구
    </text>
  </g>);
}
