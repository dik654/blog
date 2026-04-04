import { motion } from 'framer-motion';
import { C, F } from './svgHelpers';

export function KZGStep0() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.ind}08`} stroke={C.ind} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
        Line 0: func BlobToCommitment(blob Blob) (Commitment, error)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: // blob = [131072]byte → 4096개 32B 필드 원소로 분할
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 2: C = MSM(srs.G1Points, blobElements)  // C = Σ ai*[τ^i]₁
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 3: return CompressG1(C)  // G1 점 → [48]byte 압축 Commitment
        </text>
      </motion.g>
    </motion.g>
  );
}

export function KZGStep1() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
        Line 0: func ComputeBlobProof(blob, commitment) (Proof, error)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: z := computeChallenge(blob, commitment)  // Fiat-Shamir
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 2: Q := computeQuotient(poly, z)  // Q(x) = (p(x)-p(z))/(x-z)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 3: return MSM(srs.G1Points, Q)  // π = [Q(τ)]₁ → [48]byte Proof
        </text>
      </motion.g>
    </motion.g>
  );
}
