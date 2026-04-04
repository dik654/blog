import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './HamtDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.hamt}>Node 구조 — Bitfield + Pointers</text>
    <text x={20} y={44} fontSize={10} fill={C.hamt}>Line 1: type Node struct {'{'} Bitfield [32]byte  // 256비트 비트맵</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.hamt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   Pointers []*Pointer  // 설정된 비트 수만큼 포인터
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  // 희소 배열 — Bitfield가 존재 슬롯 표시
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.hamt}>Find() — SHA256 해시 탐색</text>
    <text x={20} y={44} fontSize={10} fill={C.hamt}>Line 1: hash := sha256.Sum256(key)  // 키 해싱</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.hamt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: idx := hash[depth*5 : depth*5+5]  // 5비트씩 인덱스 추출
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: ptr := node.Pointers[popcount(bitfield, idx)]  // O(log n) 탐색
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.amt}>AMT — Array Mapped Trie</text>
    <text x={20} y={44} fontSize={10} fill={C.amt}>Line 1: type AMT struct {'{'} BitWidth: 3  // 노드당 8슬롯</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.amt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: node.Links[idx] = childCID  // 인덱스 기반 접근
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 순서가 있는 배열 → O(log n) 인덱스 조회
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.state}>Flush() — CBOR 직렬화</text>
    <text x={20} y={44} fontSize={10} fill={C.hamt}>Line 1: for _, n := range dirty {'{'} bz := cbor.Marshal(n) {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cid := store.Put(bz)  // CBOR → CID
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return rootCID  // = state root (HAMT 루트 CID)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Root CID" sub="state root" color={C.state} />
    </motion.g>
  </g>);
}
