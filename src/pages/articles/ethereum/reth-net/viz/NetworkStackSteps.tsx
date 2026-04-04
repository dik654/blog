import { motion } from 'framer-motion';

export function StepOverview() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      네트워크 스택 — 4단계 연결 과정
    </text>
    <text x={20} y={42} fontSize={10} fill="#6b7280">
      Line 1: Discovery (UDP)  // Kademlia DHT로 피어 발견
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#6366f1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: Connect (TCP)  // TcpStream::connect
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#8b5cf6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: Encrypt (RLPx)  // ECIES → AES-CTR
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: Protocol (eth/68)  // 블록/TX 메시지 교환
    </motion.text>
    <motion.text x={20} y={112} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      tokio 비동기 런타임 위 단일 이벤트 루프
    </motion.text>
  </g>);
}

export function StepDiscovery() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      UDP Discovery — Kademlia DHT
    </text>
    <text x={20} y={42} fontSize={10} fill="#6b7280">
      Line 1: discv4.find_node(bootnode, target_id)  // FIND_NODE
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#6b7280"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let neighbors = recv_neighbors().await?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#6b7280"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: for peer in neighbors {'{'} kbucket.insert(peer) {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      K-bucket 256개 — XOR 거리 기반 피어 정렬
    </motion.text>
  </g>);
}
