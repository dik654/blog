import { motion } from 'framer-motion';

export function StepConnect() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TCP 연결 — 병렬 다이얼링
    </text>
    <text x={20} y={42} fontSize={10} fill="#6366f1">
      Line 1: for peer in discovered_peers {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill="#6366f1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     tokio::spawn(TcpStream::connect(peer.addr))
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#6366f1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  // 기본 50피어, 최대 100+
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      timeout 발생 시 다음 피어 시도
    </motion.text>
  </g>);
}

export function StepEncrypt() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      RLPx 암호화 — ECIES auth/ack
    </text>
    <text x={20} y={42} fontSize={10} fill="#8b5cf6">
      Line 1: stream.send(ecies_auth(local_key, peer_pub))
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#10b981"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let ack = stream.recv_ack().await?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#8b5cf6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let shared_secret = ecdh(local_key, ack.pubkey)
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill="#8b5cf6" fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: // 이후 모든 프레임 AES-256-CTR 암호화
    </motion.text>
  </g>);
}

export function StepProtocol() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      eth/68 프로토콜 — 메시지 교환
    </text>
    <text x={20} y={42} fontSize={10} fill="#10b981">
      Line 1: stream.send(Status {'{'} chain_id: 1, best_hash {'}'})
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="#f59e0b"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // NewPooledTxHashes — TX 해시만 전파
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill="#6366f1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // GetBlockHeaders — 헤더 요청-응답
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      eth/68: 해시만 전파 → 대역폭 절약
    </motion.text>
  </g>);
}
