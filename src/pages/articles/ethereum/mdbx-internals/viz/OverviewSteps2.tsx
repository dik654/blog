import { motion } from 'framer-motion';
import { C } from './OverviewVizData';

export function Step2() {
  return (
    <g>
      <rect x={30} y={30} width={120} height={50} rx={6}
        fill={`${C.dim}10`} stroke={C.dim} strokeWidth={1} />
      <text x={90} y={55} textAnchor="middle" fontSize={11}
        fontWeight={600} fill={C.dim}>LMDB</text>
      <text x={90} y={70} textAnchor="middle" fontSize={9}
        fill={C.dim}>Howard Chu, 2011</text>
      <motion.line x1={150} y1={55} x2={200} y2={55}
        stroke={C.mdbx} strokeWidth={1.5} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }} />
      <text x={175} y={48} textAnchor="middle" fontSize={9}
        fill={C.mdbx}>fork</text>
      <motion.g initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={210} y={20} width={140} height={70} rx={6}
          fill={`${C.mdbx}12`} stroke={C.mdbx} strokeWidth={1.5} />
        <text x={280} y={42} textAnchor="middle" fontSize={12}
          fontWeight={700} fill={C.mdbx}>MDBX</text>
        <text x={280} y={58} textAnchor="middle" fontSize={9}
          fill={C.mdbx}>Leonid Yuriev, 2015~</text>
        <text x={280} y={78} textAnchor="middle" fontSize={9}
          fill={C.dim}>libmdbx (C library)</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        {['auto geometry', 'LIFO reclaim', 'safe readers'].map(
          (t, i) => (
            <g key={t}>
              <rect x={60 + i * 110} y={120} width={100}
                height={26} rx={4} fill={`${C.mdbx}10`}
                stroke={C.mdbx} strokeWidth={0.8} />
              <text x={110 + i * 110} y={137} textAnchor="middle"
                fontSize={10} fill={C.mdbx}>{t}</text>
            </g>
          ),
        )}
      </motion.g>
    </g>
  );
}
