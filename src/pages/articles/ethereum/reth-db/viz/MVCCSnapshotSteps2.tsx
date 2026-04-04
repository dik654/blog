import { motion } from 'framer-motion';
import { C } from './MVCCSnapshotVizData';

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      txnid로 버전 관리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.rd}>
      Line 1: let ro_tx = env.begin_ro_txn()  // txnid=5
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.rd}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Reader → root → pg3 → pg7 (5 시점 트리)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.wr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let rw_tx = env.begin_rw_txn()  // txnid=6
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.wr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // Writer → root → pg3 → pg42 (6 시점 새 트리)
    </motion.text>
    <motion.text x={20} y={118} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      같은 B+tree, 서로 다른 버전의 스냅샷
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Reth에서의 실전 효과
    </text>
    <text x={20} y={42} fontSize={10} fill={C.wr}>
      Line 1: // Writer (txnid=N+1): EVM 블록 실행 중
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.wr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: cursor.upsert(account, new_balance)?
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.rd}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3: // Reader (txnid=N): RPC eth_getBalance
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.rd}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 4: cursor.seek_exact(account)? → 이전 블록 잔액
    </motion.text>
    <motion.text x={20} y={118} fontSize={10} fill={C.ok} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Lock 없이 동시 진행 — MVCC 덕분
    </motion.text>
  </g>);
}
