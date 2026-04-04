import { motion } from 'framer-motion';

const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export function BlobTxFlowStep2({ checks }: { checks: { label: string; pass: boolean; color: string }[] }) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill="#64748b10" stroke="#64748b" strokeWidth={0.8} />
      <text x={30} y={25} fontSize={10} fontWeight={600} fill="#64748b" fontFamily="monospace">Line 0:</text>
      <text x={90} y={25} fontSize={10} fontWeight={700} fill={F.fg} fontFamily="monospace">
        func validateBlobTx(tx *BlobTx, rules Rules) error
      </text>
      {checks.map((c, i) => (
        <motion.g key={c.label}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={42 + i * 26} width={480} height={22} rx={4}
            fill={`${c.color}08`} stroke={c.color} strokeWidth={0.8} />
          <text x={30} y={56 + i * 26} fontSize={10} fontWeight={600} fill={c.color} fontFamily="monospace">
            Line {i + 1}: if !check{c.label}(tx) {'{'} return ErrInvalid{c.label} {'}'}
          </text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={100} y={42 + checks.length * 26 + 8} width={300} height={22} rx={4}
          fill="#ef444408" stroke="#ef4444" strokeWidth={0.8} />
        <text x={250} y={56 + checks.length * 26 + 8} textAnchor="middle" fontSize={10}
          fontWeight={600} fill="#ef4444">
          비용 낮은 검사 우선 — 실패 시 즉시 error 반환
        </text>
      </motion.g>
    </motion.g>
  );
}

export function BlobTxFlowStep3() {
  const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b' };
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.ind}08`} stroke={C.ind} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
        Line 1: func (sc *BlobTxSidecar) BlobHashes() []common.Hash
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 2: h := sha256.Sum256(commitment[:])  // Commitment → SHA256
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={20} y={70} width={480} height={22} rx={4}
          fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
        <text x={30} y={84} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 3: h[0] = 0x01  // versioned hash (version byte prefix)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={20} y={108} fontSize={10} fill={F.muted}>
          [48]byte Commitment → SHA256 → version byte 0x01 → [32]byte versioned hash
        </text>
      </motion.g>
    </motion.g>
  );
}
