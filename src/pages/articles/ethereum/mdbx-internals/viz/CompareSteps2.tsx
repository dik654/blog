import { motion } from 'framer-motion';
import { C } from './CompareVizData';

export function Step3() {
  return (
    <g>
      <rect x={20} y={20} width={100} height={34} rx={5}
        fill={`${C.sqlite}12`} stroke={C.sqlite} strokeWidth={1.2} />
      <text x={70} y={37} textAnchor="middle" fontSize={11}
        fontWeight={700} fill={C.sqlite}>SQLite</text>
      <text x={70} y={48} textAnchor="middle" fontSize={8}
        fill={C.dim}>범용 임베디드 RDBMS</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={20} y={70} width={100} height={22} rx={4}
          fill={`${C.sqlite}14`} stroke={C.sqlite} strokeWidth={0.8} />
        <text x={70} y={85} textAnchor="middle" fontSize={9}
          fill={C.sqlite}>B-tree (not B+tree)</text>
        <rect x={20} y={100} width={100} height={22} rx={4}
          fill={`${C.sqlite}14`} stroke={C.sqlite} strokeWidth={0.8} />
        <text x={70} y={115} textAnchor="middle" fontSize={9}
          fill={C.sqlite}>SQL 파싱 오버헤드</text>
        <rect x={20} y={136} width={200} height={22} rx={4}
          fill={`${C.sqlite}08`} stroke={C.sqlite}
          strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={120} y={151} textAnchor="middle" fontSize={9}
          fill={C.dim}>KV 패턴에 과도한 추상화</text>
      </motion.g>
    </g>
  );
}

export function Step4() {
  const engines = [
    { name: 'MDBX', c: C.mdbx, tree: 'B+tree', rw: 'R > W',
      latency: '예측 가능' },
    { name: 'RocksDB', c: C.rocks, tree: 'LSM', rw: 'W > R',
      latency: '변동' },
    { name: 'LevelDB', c: C.level, tree: 'LSM', rw: 'W > R',
      latency: '변동' },
    { name: 'SQLite', c: C.sqlite, tree: 'B-tree', rw: '범용',
      latency: 'SQL 오버헤드' },
  ];
  const cols = ['Engine', 'Tree', 'R/W', 'Latency'];
  const cw = [80, 65, 65, 90];
  const cx = [20, 100, 165, 230];
  return (
    <g>
      {/* Header */}
      {cols.map((col, i) => (
        <g key={col}>
          <rect x={cx[i]} y={20} width={cw[i]} height={22} rx={3}
            fill="var(--muted)" />
          <text x={cx[i] + cw[i] / 2} y={35} textAnchor="middle"
            fontSize={9} fontWeight={700}
            fill="var(--foreground)">{col}</text>
        </g>
      ))}
      {/* Rows */}
      {engines.map((e, ri) => {
        const y = 48 + ri * 28;
        const vals = [e.name, e.tree, e.rw, e.latency];
        return (
          <motion.g key={e.name} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: ri * 0.12 }}>
            {vals.map((v, ci) => (
              <g key={ci}>
                <rect x={cx[ci]} y={y} width={cw[ci]} height={22}
                  rx={3}
                  fill={ci === 0 ? `${e.c}10` : 'transparent'}
                  stroke={ci === 0 ? e.c : 'var(--border)'}
                  strokeWidth={ci === 0 ? 0.8 : 0.3} />
                <text x={cx[ci] + cw[ci] / 2} y={y + 15}
                  textAnchor="middle" fontSize={9}
                  fontWeight={ci === 0 ? 600 : 400}
                  fill={ci === 0 ? e.c : 'var(--foreground)'}>
                  {v}
                </text>
              </g>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}
