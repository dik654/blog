import { motion } from 'framer-motion';
import { C } from './MVCCVizData';

export function Step0() {
  return (
    <g>
      <text x={200} y={30} textAnchor="middle" fontSize={12}
        fontWeight={700} fill="var(--foreground)">MVCC</text>
      <text x={200} y={48} textAnchor="middle" fontSize={10}
        fill={C.dim}>Multi-Version Concurrency Control</text>
      {[1, 2, 3].map(v => (
        <motion.g key={v} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: v * 0.2 }}>
          <rect x={40 + (v - 1) * 110} y={70} width={90}
            height={50} rx={5} fill={`${C.txn}${8 + v * 4}`}
            stroke={C.txn} strokeWidth={v === 3 ? 1.4 : 0.7} />
          <text x={85 + (v - 1) * 110} y={92} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={C.txn}>
            Version {v}
          </text>
          <text x={85 + (v - 1) * 110} y={108} textAnchor="middle"
            fontSize={9} fill={C.dim}>txnid={v}</text>
        </motion.g>
      ))}
      <motion.text x={200} y={152} textAnchor="middle" fontSize={10}
        fill={C.dim} initial={{ opacity: 0 }}
        animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        각 reader는 자기 시작 시점의 버전을 봄
      </motion.text>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <rect x={20} y={20} width={100} height={30} rx={5}
        fill={`${C.reader}14`} stroke={C.reader} strokeWidth={1.2} />
      <text x={70} y={39} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.reader}>Reader (txn=5)</text>
      <motion.line x1={70} y1={50} x2={70} y2={75}
        stroke={C.reader} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }} />
      <polygon points="66,73 74,73 70,80" fill={C.reader} />
      <rect x={20} y={82} width={100} height={60} rx={5}
        fill={`${C.reader}08`} stroke={C.reader} strokeWidth={0.8} />
      <text x={70} y={100} textAnchor="middle" fontSize={10}
        fill={C.reader}>B+tree @ txn=5</text>
      <text x={70} y={118} textAnchor="middle" fontSize={9}
        fill={C.dim}>일관된 스냅샷</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={200} y={20} width={100} height={30} rx={5}
          fill={`${C.writer}14`} stroke={C.writer}
          strokeWidth={1} />
        <text x={250} y={39} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.writer}>Writer (txn=6)</text>
        <rect x={200} y={82} width={100} height={60} rx={5}
          fill={`${C.writer}08`} stroke={C.writer}
          strokeWidth={0.8} />
        <text x={250} y={100} textAnchor="middle" fontSize={10}
          fill={C.writer}>new pages</text>
        <text x={250} y={118} textAnchor="middle" fontSize={9}
          fill={C.dim}>Reader에 영향 없음</text>
      </motion.g>
    </g>
  );
}
