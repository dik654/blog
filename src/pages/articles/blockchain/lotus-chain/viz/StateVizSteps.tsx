import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './StateVizData';

export function StepVM() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.vm}>NewFVM() — VM 인스턴스 생성</text>
    <text x={20} y={44} fontSize={10} fill={C.vm}>Line 1: stateRoot := parentState  // 부모 state root</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: vmi := fvm.NewFVM(ctx, stateRoot, ts.Height())
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // stCache 재사용 — 에폭 간 상태 캐시 공유
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="stCache" sub="캐시 재사용" color={C.state} />
    </motion.g>
  </g>);
}

export function StepCron() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cron}>ApplyImplicitMessage(cronMsg)</text>
    <text x={20} y={44} fontSize={10} fill={C.cron}>Line 1: cronMsg := &types.Message{'{'}To: cron.Address, Method: 2{'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.cron}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: vmi.ApplyImplicitMessage(cronMsg)  // 시스템 자동 작업
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // WindowPoSt deadline 확인 + 보상 분배 + 결함 처리
    </motion.text>
  </g>);
}

export function StepFlush() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.msg}>ApplyMessage() → Flush()</text>
    <text x={20} y={44} fontSize={10} fill={C.msg}>Line 1: for _, msg := range blk.Messages {'{'} vmi.ApplyMessage(msg) {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: gasUsed += receipt.GasUsed  // 가스 소비 누적
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: rootCID := vmi.Flush()  // HAMT root → 새 state root
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Flush()→CID" sub="HAMT root" color={C.state} />
    </motion.g>
  </g>);
}
