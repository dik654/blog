import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SectorDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.seal}>handlePreCommit1() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.sector}>Line 1: pieces := sector.Pieces  // Piece 데이터 채우기</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.seal}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: out := sb.SealPreCommit1(ctx, sector, pieces)  // SDR 인코딩
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // CPU 바운드 3-5h — 단일 코어, 병렬화 어려움
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.seal}>PreCommit2 + WaitSeed 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.seal}>Line 1: cids := sb.SealPreCommit2(ctx, sector, pc1Out)  // Merkle Tree GPU</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.sector}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: api.PreCommitSector(params)  // 온체인 PreCommit 제출
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: waitForSeed(150)  // 150 에폭 대기 (~75분)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={110} h={22} label="WaitSeed" sub="150 에폭" color={C.err} />
    </motion.g>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prove}>Commit — Groth16 증명 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.prove}>Line 1: proof := sb.SealCommit1(ctx, sector, seed)  // 챌린지 생성</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.prove}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: snark := sb.SealCommit2(ctx, sector, c1Out)  // GPU Groth16
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: api.ProveCommitSector(snark)  // 온체인 제출 → Active
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={90} h={22} label="Active" sub="파워 인정" color={C.prove} />
    </motion.g>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.err}>WindowPoSt — 24시간 주기</text>
    <text x={20} y={44} fontSize={10} fill={C.prove}>Line 1: deadlines := 48  // 각 30분, 총 24시간</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.prove}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proof := generateWindowPoSt(dl.Sectors)  // 증명 생성
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 미제출 → Fault → 누적 시 Terminated(슬래싱)
    </motion.text>
  </g>);
}
