import { motion } from 'framer-motion';
import { C } from './CompareVizData';

function Chip({ x, y, label, color }: {
  x: number; y: number; label: string; color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={100} height={22} rx={4}
        fill={`${color}14`} stroke={color} strokeWidth={0.8} />
      <text x={x + 50} y={y + 15} textAnchor="middle" fontSize={9}
        fill={color}>{label}</text>
    </g>
  );
}

export function Step0() {
  const items = [
    { label: 'auto geometry', desc: 'DB 크기 자동 확장/축소' },
    { label: 'LIFO reclaim', desc: '최근 해제 페이지 우선 재사용' },
    { label: 'safe readers', desc: 'reader slot 누수 방지' },
  ];
  return (
    <g>
      <rect x={20} y={20} width={80} height={30} rx={5}
        fill={`${C.lmdb}10`} stroke={C.lmdb} strokeWidth={1} />
      <text x={60} y={39} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.lmdb}>LMDB</text>
      <motion.line x1={100} y1={35} x2={145} y2={35}
        stroke={C.mdbx} strokeWidth={1.5} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }} />
      <rect x={150} y={20} width={80} height={30} rx={5}
        fill={`${C.mdbx}14`} stroke={C.mdbx} strokeWidth={1.4} />
      <text x={190} y={39} textAnchor="middle" fontSize={10}
        fontWeight={700} fill={C.mdbx}>MDBX</text>
      {items.map((item, i) => (
        <motion.g key={item.label} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}>
          <Chip x={30} y={70 + i * 34} label={item.label}
            color={C.mdbx} />
          <text x={145} y={85 + i * 34} fontSize={9}
            fill={C.dim}>{item.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <rect x={20} y={20} width={100} height={34} rx={5}
        fill={`${C.rocks}12`} stroke={C.rocks} strokeWidth={1.2} />
      <text x={70} y={37} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.rocks}>RocksDB</text>
      <text x={70} y={48} textAnchor="middle" fontSize={8}
        fill={C.dim}>Facebook (LevelDB fork)</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <Chip x={20} y={70} label="LSM-tree" color={C.rocks} />
        <Chip x={20} y={100} label="Write 최적화" color={C.rocks} />
        <rect x={20} y={136} width={160} height={22} rx={4}
          fill="#ef444412" stroke={C.level} strokeWidth={0.8} />
        <text x={100} y={151} textAnchor="middle" fontSize={9}
          fill={C.level}>compaction → 읽기 지연 불예측</text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <rect x={20} y={20} width={100} height={34} rx={5}
        fill={`${C.level}12`} stroke={C.level} strokeWidth={1.2} />
      <text x={70} y={37} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.level}>LevelDB</text>
      <text x={70} y={48} textAnchor="middle" fontSize={8}
        fill={C.dim}>Google → Geth 기본 DB</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <Chip x={20} y={70} label="LSM-tree" color={C.level} />
        <Chip x={20} y={100} label="단순한 구조" color={C.level} />
        <rect x={20} y={136} width={180} height={22} rx={4}
          fill="#ef444412" stroke={C.level} strokeWidth={0.8} />
        <text x={110} y={151} textAnchor="middle" fontSize={9}
          fill={C.level}>compaction stall → sync 지연</text>
      </motion.g>
    </g>
  );
}
