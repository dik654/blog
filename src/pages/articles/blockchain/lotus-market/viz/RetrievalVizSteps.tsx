import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './RetrievalVizData';

export function StepQuery() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.query}>QueryAsk() — PieceStore 조회</text>
    <text x={20} y={44} fontSize={10} fill={C.query}>Line 1: info := pieceStore.GetPieceInfo(payloadCID)  // CID → 섹터 매핑</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.data}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: sector, offset := info.Deals[0].SectorID, info.Deals[0].Offset
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return QueryResponse{'{'}Size: info.Size, PricePerByte: ask.Price{'}'}
    </motion.text>
  </g>);
}

export function StepPrice() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pay}>가격 계산 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.pay}>Line 1: totalCost := pricePerByte * pieceSize  // 기본 비용</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.pay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: totalCost += unsealPrice  // 봉인 해제 비용 (선택)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: paymentInterval := 1048576  // 1MB마다 마이크로페이먼트
    </motion.text>
  </g>);
}

export function StepPayment() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.data}>데이터 전송 + 바우처 검증</text>
    <text x={20} y={44} fontSize={10} fill={C.data}>Line 1: block := readBlock(sector, offset)  // 오프체인 전송</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.pay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: voucher := payCh.CreateVoucher(amount)  // 오프체인 결제
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: payCh.Settle()  // 최종 정산: 온체인 1회만
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Settle()" sub="온체인 1회" color={C.pay} />
    </motion.g>
  </g>);
}
