import { motion } from 'framer-motion';
import { C } from './MVCCVizData';

export function Step3() {
  const pages = [
    { pgno: 'pg3', txnid: 2 },
    { pgno: 'pg7', txnid: 5 },
    { pgno: 'pg12', txnid: 8 },
  ];
  return (
    <g>
      <text x={20} y={24} fontSize={10} fontWeight={600}
        fill={C.txn}>txnid: 페이지에 기록된 트랜잭션 ID</text>
      {pages.map((p, i) => (
        <motion.g key={p.pgno} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}>
          <rect x={30 + i * 120} y={50} width={100} height={50}
            rx={5} fill={`${C.txn}10`} stroke={C.txn}
            strokeWidth={0.8} />
          <text x={80 + i * 120} y={70} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={C.txn}>
            {p.pgno}
          </text>
          <text x={80 + i * 120} y={88} textAnchor="middle"
            fontSize={9} fill={C.dim}>txnid = {p.txnid}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <text x={200} y={130} textAnchor="middle" fontSize={10}
          fill={C.dim}>
          커밋마다 txnid++ → 수정 이력 추적
        </text>
        <rect x={100} y={140} width={200} height={18} rx={3}
          fill={`${C.txn}08`} stroke={C.txn} strokeWidth={0.5} />
        <text x={200} y={153} textAnchor="middle" fontSize={9}
          fill={C.txn}>meta.txnid = 최신 커밋 ID</text>
      </motion.g>
    </g>
  );
}

export function Step4() {
  return (
    <g>
      <text x={20} y={24} fontSize={10} fontWeight={600}
        fill={C.gc}>GC: Freelist 페이지 재활용</text>
      {/* Active readers bar */}
      <rect x={20} y={40} width={160} height={24} rx={4}
        fill={`${C.reader}10`} stroke={C.reader} strokeWidth={0.8} />
      <text x={100} y={56} textAnchor="middle" fontSize={9}
        fill={C.reader}>oldest reader: txn=5</text>
      {/* Pages */}
      {[
        { pg: 'pg2', txn: 3, reclaimable: true },
        { pg: 'pg4', txn: 4, reclaimable: true },
        { pg: 'pg9', txn: 6, reclaimable: false },
      ].map((p, i) => (
        <motion.g key={p.pg} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.2 }}>
          <rect x={30 + i * 120} y={80} width={90} height={40}
            rx={4}
            fill={p.reclaimable ? `${C.gc}14` : `${C.dim}08`}
            stroke={p.reclaimable ? C.gc : C.dim}
            strokeWidth={p.reclaimable ? 1 : 0.6} />
          <text x={75 + i * 120} y={98} textAnchor="middle"
            fontSize={10} fill={p.reclaimable ? C.gc : C.dim}>
            {p.pg} (txn={p.txn})
          </text>
          <text x={75 + i * 120} y={112} textAnchor="middle"
            fontSize={8}
            fill={p.reclaimable ? C.gc : C.dim}>
            {p.reclaimable ? 'freelist' : '사용 중'}
          </text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <text x={200} y={150} textAnchor="middle" fontSize={10}
          fill={C.gc}>txn &lt; oldest_reader → 재활용 가능</text>
        <text x={200} y={168} textAnchor="middle" fontSize={9}
          fill={C.dim}>MDBX: LIFO 회수로 캐시 지역성 향상</text>
      </motion.g>
    </g>
  );
}
