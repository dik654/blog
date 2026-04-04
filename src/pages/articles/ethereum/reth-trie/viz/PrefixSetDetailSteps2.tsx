import { motion } from 'framer-motion';
import { C } from './PrefixSetDetailVizData';

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      변경된 Leaf에서 새 해시 계산
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: let leaf_hash = keccak256(rlp(account_data))
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.root}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: branch_node.children[idx] = leaf_hash  // 갱신
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.root}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let branch_hash = keccak256(branch_node.encode())
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.match} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: root_hash = keccak256(root_node)  // 새 Root
    </motion.text>
  </g>);
}

export function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Storage trie도 동일 방식 처리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.change}>
      Line 1: let storage_root = calc_storage_root(
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     account_addr, &amp;storage_prefix_set)?
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill={C.key}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3: account_leaf.storage_root = storage_root
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.match} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 4: state_root = calc_account_root(&amp;account_prefix_set)?
    </motion.text>
    <motion.text x={20} y={114} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      storage root → account leaf → final state root
    </motion.text>
  </g>);
}
