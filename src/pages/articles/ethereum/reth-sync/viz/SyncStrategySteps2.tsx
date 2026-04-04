import { motion } from 'framer-motion';

export function StepSnap() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Snap Sync — 상태 다운로드 + Merkle 검증
    </text>
    <text x={20} y={42} fontSize={10} fill="#10b981">
      Line 1: let accounts = peer.get_account_range(start, end)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let storage = peer.get_storage_ranges(accounts)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: verify_merkle_proof(data, proof, state_root)?
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: provider.write_to_db(verified_data)?  // 2-6시간
    </motion.text>
  </g>);
}

export function StepLive() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Live Sync — ExEx 이벤트 스트림
    </text>
    <text x={20} y={42} fontSize={10} fill="#f59e0b">
      Line 1: // tip 도달 후 12초/블록 실시간 추종
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#8b5cf6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: exex_manager.broadcast(ChainCommitted(chain))
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#ef4444"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: exex_manager.broadcast(ChainReorged(old, new))
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Indexer, Bridge 등 ExEx가 이벤트를 수신하여 처리
    </motion.text>
  </g>);
}
