import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SyncDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.sync}>collectHeaders() — 역순 헤더 수집</text>
    <text x={20} y={44} fontSize={10} fill={C.sync}>Line 1: cur := maybeHead  // 가장 무거운 체인 팁</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.sync}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for cur.Height() {'>'} known {'{'} cur = s.loadParent(cur) {'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 부모 CID 역순 검증 — heaviest chain 추적
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="headers[]" sub="역순 수집" color={C.sync} />
    </motion.g>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.msg}>collectMessages() — Bitswap 교환</text>
    <text x={20} y={44} fontSize={10} fill={C.msg}>Line 1: blkCID := header.Messages  // 블록 메시지 CID</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.msg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: msgs := s.bswap.GetBlock(ctx, blkCID)  // Bitswap P2P 교환
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // CID 기반 콘텐츠 주소 지정 — 중복 다운로드 방지
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.valid}>ValidateBlock() — 4항목 검증</text>
    <text x={20} y={44} fontSize={10} fill={C.valid}>Line 1: verifyBlockSig(blk)  // 서명 검증</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
      Line 2: checkTimestamp(blk.Timestamp)  // 타임스탬프 유효성
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
      Line 3: verifyParentHash(blk.Parents)  // 부모 해시 일치
    </motion.text>
    <motion.text x={20} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
      Line 4: verifyMessageRoot(blk)  // 하나라도 실패 → 블록 거부
    </motion.text>
  </g>);
}

export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.state}>ApplyBlocks() — FVM 상태 실행</text>
    <text x={20} y={44} fontSize={10} fill={C.state}>Line 1: vmi := fvm.NewFVM(ctx, parentState, epoch)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: vmi.ApplyImplicitMessage(cronMsg)  // CronTick 먼저
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: stateRoot := vmi.Flush()  // HAMT CID = 새 상태 루트
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="State Root" sub="HAMT CID" color={C.valid} />
    </motion.g>
  </g>);
}
