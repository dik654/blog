import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './CursorDetailVizData';

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      DupSort — 하나의 키에 여러 값
    </text>
    <text x={20} y={42} fontSize={10} fill={C.rw}>
      Line 1: // USDT(0xdAC1..7e6b) 아래 슬롯들:
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: slot 0x00 = 0x01  // totalSupply
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: slot 0x03 = 0x42  // owner
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4: slot 0x0a = 1e18  // balance[addr]
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      한 주소 아래 수천 슬롯을 정렬 저장 → 범위 조회 최적
    </motion.text>
  </g>);
}

export function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      MVCC — 읽기와 쓰기 동시 가능
    </text>
    <text x={20} y={42} fontSize={10} fill={C.mvcc}>
      Line 1: let ro_tx = env.begin_ro_txn()  // txn_id=47
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.mvcc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // RPC: eth_getBalance #19M (읽기 스냅샷)
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let rw_tx = env.begin_rw_txn()  // txn_id=48
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.rw}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // #19,000,001 블록 실행 중 (쓰기)
    </motion.text>
    <motion.text x={20} y={112} fontSize={10} fill={C.mvcc} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      비차단: 읽기와 쓰기가 동시 가능 — MVCC 스냅샷 격리
    </motion.text>
  </g>);
}
