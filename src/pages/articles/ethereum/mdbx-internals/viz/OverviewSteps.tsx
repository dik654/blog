import { motion } from 'framer-motion';
import { C } from './OverviewVizData';

export function Step0() {
  const levels = ['L0', 'L1', 'L2', 'L3'];
  const cx = 120;
  return (
    <g>
      <rect x={cx - 50} y={20} width={100} height={30} rx={5}
        fill={`${C.lsm}18`} stroke={C.lsm} strokeWidth={1.2} />
      <text x={cx} y={40} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.lsm}>Memtable</text>
      <motion.line x1={cx} y1={50} x2={cx} y2={68} stroke={C.lsm}
        strokeWidth={1} initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
      <polygon points={`${cx - 5},68 ${cx + 5},68 ${cx},74`} fill={C.lsm} />
      {levels.map((lv, i) => {
        const y = 80 + i * 32;
        const w = 90 + i * 30;
        const x = cx - w / 2;
        return (
          <motion.g key={lv} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.15 }}>
            <rect x={x} y={y} width={w} height={26} rx={4}
              fill={`${C.lsm}${10 + i * 4}`} stroke={C.lsm}
              strokeWidth={0.8} />
            <text x={cx} y={y + 16} textAnchor="middle"
              fontSize={10} fill={C.lsm}>
              {lv}: SSTable x{i + 1}
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <text x={290} y={40} fontSize={10} fontWeight={600}
          fill={C.lsm}>Read Path</text>
        <text x={290} y={58} fontSize={10} fill={C.dim}>
          L0 miss → L1 miss → L2 ...
        </text>
        <rect x={270} y={70} width={130} height={24} rx={4}
          fill="#ef444418" stroke={C.lsm} strokeWidth={1} />
        <text x={335} y={86} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.lsm}>Read Amplification</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const depths = ['Root', 'Internal', 'Internal', 'Leaf'];
  return (
    <g>
      {depths.map((label, i) => {
        const y = 24 + i * 42;
        const w = 70 + i * 20;
        const x = 180 - w / 2;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}>
            {i > 0 && (
              <line x1={180} y1={y - 14} x2={180} y2={y}
                stroke={C.btree} strokeWidth={0.8} />
            )}
            <rect x={x} y={y} width={w} height={28} rx={5}
              fill={i === 3 ? `${C.btree}20` : `${C.btree}10`}
              stroke={C.btree}
              strokeWidth={i === 3 ? 1.4 : 0.8} />
            <text x={180} y={y + 18} textAnchor="middle"
              fontSize={10} fontWeight={i === 3 ? 700 : 500}
              fill={C.btree}>{label}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <text x={290} y={60} fontSize={10} fontWeight={600}
          fill={C.btree}>O(log n) 보장</text>
        <text x={290} y={78} fontSize={10} fill={C.dim}>
          depth 3~4로 고정
        </text>
      </motion.g>
    </g>
  );
}
