import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './DealDetailVizData';

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.deal}>HandleDealProposal() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.deal}>Line 1: prop := deal.ClientDealProposal  // 가격+기간+콜래터럴</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: err := validateProposal(prop)  // 유효성 검증
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: deal.State = StorageDealAccepting  // 수락 → 데이터 전송 시작
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.data}>데이터 전송 → 섹터 추가</text>
    <text x={20} y={44} fontSize={10} fill={C.deal}>Line 1: gs.Request(ctx, proposal.PieceCID)  // GraphSync 전송</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pieceInfo := miner.AddPiece(ctx, piece, sectorNum)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: deal.State = StorageDealSealing  // 봉인 대기 큐 진입
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.chain}>PublishDeals → 온체인 활성화</text>
    <text x={20} y={44} fontSize={10} fill={C.chain}>Line 1: msg := PublishStorageDeals{'{'}Deals: deals{'}'}  // 배치 퍼블리시</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: deal.State = StorageDealActive  // 딜 활성화
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 에폭별 자동 정산 — StoragePowerActor 파워 증가
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Active" sub="에폭별 정산" color={C.data} />
    </motion.g>
  </g>);
}
