import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './StateTreeVizData';

export function StepStruct() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.tree}>StateTree 구조체</text>
    <text x={20} y={44} fontSize={10} fill={C.tree}>Line 1: type StateTree struct {'{'} root *hamt.Node</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.hamt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   Store cbor.IpldStore  // 블록스토어 CBOR I/O
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   snaps map[cid.Cid]*StateTree  // 에폭별 스냅샷 {'}'}
    </motion.text>
  </g>);
}

export function StepGet() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.tree}>GetActor() — 액터 조회</text>
    <text x={20} y={44} fontSize={10} fill={C.tree}>Line 1: idAddr := st.LookupID(addr)  // f0 ID 주소로 변환</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.hamt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: act := st.root.Find(ctx, string(idAddr))  // HAMT O(log n)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return cbor.Unmarshal(act, &Actor{'{'}{'}'}  // Balance, Head, Nonce 포함
    </motion.text>
  </g>);
}

export function StepFlush() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.store}>Flush() — dirty 노드 커밋</text>
    <text x={20} y={44} fontSize={10} fill={C.hamt}>Line 1: root.ForEachDirty(func(n *Node) {'{'} store.Put(n) {'}'})</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.store}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: rootCID := cbor.Put(store, root)  // 루트 CBOR 직렬화
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return rootCID  // = state root (다음 블록 헤더에 포함)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Root CID" sub="state root" color={C.tree} />
    </motion.g>
  </g>);
}

export function StepSnap() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.snap}>스냅샷 — 에폭별 상태 보존</text>
    <text x={20} y={44} fontSize={10} fill={C.tree}>Line 1: snap := &StateTree{'{'}root: curRoot, version: epoch{'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.hamt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 변경 안 된 HAMT 노드는 이전 에폭과 CID 공유
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // GC 전까지 모든 에폭 상태 접근 가능
    </motion.text>
  </g>);
}
