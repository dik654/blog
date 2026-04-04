import { motion } from 'framer-motion';
import { C, F } from './svgHelpers';

export function KZGStep2() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill={`${C.amb}08`} stroke={C.amb} strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
        Line 0: func VerifyBlobProof(blob, commit, proof) (bool, error)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: lhs := pairing(proof, sub(srs.G2[1], mulScalar(G2, z)))
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.red}06`} stroke={C.red} strokeWidth={0.6} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.red} fontFamily="monospace">
          Line 2: rhs := pairing(sub(commit, mulScalar(G1, v)), G2)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill={`${C.grn}08`} stroke={C.grn} strokeWidth={0.8} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={C.grn} fontFamily="monospace">
          Line 3: return lhs == rhs  // e(π,[s-z]₂) == e(C-[v]₁,G₂) → O(1) 검증
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={20} y={136} fontSize={10} fill={F.muted}>
          페어링 검증 2회로 128KB blob 전체를 O(1)에 검증 — KZG의 핵심
        </text>
      </motion.g>
    </motion.g>
  );
}

export function KZGStep3() {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
      <rect x={20} y={10} width={480} height={22} rx={4}
        fill="var(--background)" stroke="var(--border)" strokeWidth={0.8} />
      <text x={30} y={24} fontSize={10} fontWeight={700} fill={F.fg} fontFamily="monospace">
        Line 0: // 호출 체인: useCKZG 플래그로 백엔드 분기
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <rect x={20} y={40} width={480} height={22} rx={4}
          fill={`${C.ind}06`} stroke={C.ind} strokeWidth={0.6} />
        <text x={30} y={54} fontSize={10} fontWeight={600} fill={C.ind} fontFamily="monospace">
          Line 1: if useCKZG {'{'} return ckzg4844.BlobToCommitment(blob) {'}'}  // C 바인딩
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={20} y={68} width={480} height={22} rx={4}
          fill={`${C.amb}06`} stroke={C.amb} strokeWidth={0.6} />
        <text x={30} y={82} fontSize={10} fontWeight={600} fill={C.amb} fontFamily="monospace">
          Line 2: return gokzg4844.BlobToCommitment(blob)  // Go 네이티브 (gnark-crypto)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={20} y={96} width={480} height={22} rx={4}
          fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={110} fontSize={10} fontWeight={600} fill={F.muted} fontFamily="monospace">
          Line 3: // 기본값 = Go (gnark-crypto), useCKZG = C (c-kzg-4844)
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={20} y={136} fontSize={10} fill={F.muted}>
          crypto/kzg4844/kzg4844.go — 3개 함수 모두 동일 분기 패턴
        </text>
      </motion.g>
    </motion.g>
  );
}
