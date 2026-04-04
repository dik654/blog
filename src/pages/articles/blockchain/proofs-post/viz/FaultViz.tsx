import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './FaultVizData';

function StepFault() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.fault}>WindowPoSt 미제출 → Fault</text>
    <text x={20} y={44} fontSize={10} fill={C.fault}>Line 1: if !submitted(deadline) {'{'} state = SectorFaulty {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.fault}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: power -= sector.power  // 파워 즉시 제외
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: penalty = daily_fee * 2.14  // 일일 패널티 부과
    </motion.text>
  </g>);
}

function StepRecover() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.recover}>FaultsRecovered — 복구 선언</text>
    <text x={20} y={44} fontSize={10} fill={C.recover}>Line 1: msg = DeclareFaultsRecovered{'{'}sectors: faulty_list{'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // 다음 데드라인에서 WindowPoSt 성공 시 복구 완료
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: power += sector.power  // 파워 복구
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="파워 복구" sub="성공 시" color={C.ok} />
    </motion.g>
  </g>);
}

function StepTerminate() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.term}>14일 초과 → Termination</text>
    <text x={20} y={44} fontSize={10} fill={C.term}>Line 1: if fault_duration {'>'} MAX_FAULT_EPOCHS {'{'} terminate(sector) {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.fault}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: slash(initial_pledge)  // 담보 전액 몰수
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: remove_sector(sector)  // 섹터 영구 제거 — 경제적 강제
    </motion.text>
  </g>);
}

const R = [StepFault, StepRecover, StepTerminate];

export default function FaultViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
