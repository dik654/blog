import { motion } from 'framer-motion';

const C = { ind: '#6366f1', grn: '#10b981', amb: '#f59e0b' };
const F = { fg: 'var(--foreground)', muted: 'var(--muted-foreground)' };

export function GasStep1() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
        Line 0: func calcExcessBlobGas(parent Header) uint64
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: sum := parent.ExcessBlobGas + parent.BlobGasUsed
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.amb}06`} stroke={C.amb} strokeWidth={0.6} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 2: target := 3 * 131072  // (= 393216) 목표 blob gas
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 3: if sum {'<'} target {'{'} return 0 {'}'} else {'{'} return sum - target {'}'}
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={20} y={136} fontSize={10} fill={F.muted}>
          excess가 target보다 크면 다음 블록의 blob 가스 가격 상승
        </text>
      </motion.g>
    </motion.g>
  );
}

export function GasStep2() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
        Line 0: func CalcBlobFee(excessBlobGas uint64) *big.Int
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: return fakeExponential(1, excessBlobGas, 5314649)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.amb}06`} stroke={C.amb} strokeWidth={0.6} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 2: // price = MIN_PRICE * e^(excess / UPDATE_FRACTION)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 3: // = 1 * e^(excess / 5,314,649) wei — 지수 함수 가격 모델
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={20} y={136} fontSize={10} fill={F.muted}>
          blob 3개 초과 → excess 증가 → 가격 지수적 상승 (EIP-1559과 동일 메커니즘)
        </text>
      </motion.g>
    </motion.g>
  );
}
