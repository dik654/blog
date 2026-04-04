import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BootRespVizData';

function Step0() {
  const fields = ['slot', 'proposer_index', 'state_root'];
  return (<g>
    <text x={20} y={14} fontSize={10} fontWeight={700} fill={C.header}>header</text>
    {fields.map((f, i) => (
      <motion.g key={f} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={20} y={22 + i * 28} w={130} h={22} label={f} color={C.header} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={180} y={22} width={280} height={80} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={190} y={42} fontSize={9} fill="var(--muted-foreground)">체크포인트 시점의 finalized 블록 헤더.</text>
      <text x={190} y={58} fontSize={9} fill="var(--muted-foreground)">state_root가 Merkle 증명의 앵커.</text>
      <text x={190} y={74} fontSize={9} fill="var(--muted-foreground)">slot으로 위원회 period를 계산.</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={10} fontWeight={700} fill={C.committee}>current_sync_committee</text>
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
      <DataBox x={20} y={24} w={140} h={22} label="pubkeys [512]" color={C.committee} />
    </motion.g>
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
      <DataBox x={20} y={52} w={140} h={22} label="aggregate_pubkey" color={C.committee} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      <rect x={190} y={24} width={270} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={200} y={42} fontSize={9} fill="var(--muted-foreground)">512개 BLS12-381 G1 공개키.</text>
      <text x={200} y={58} fontSize={9} fill="var(--muted-foreground)">다음 Update 서명 검증에 사용.</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={10} fontWeight={700} fill={C.branch}>committee_branch</text>
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
      <DataBox x={20} y={24} w={110} h={22} label="hash[0]" color={C.branch} />
      <DataBox x={140} y={24} w={110} h={22} label="hash[1]" color={C.branch} />
      <DataBox x={260} y={24} w={110} h={22} label="... hash[4]" color={C.branch} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={20} y={54} width={350} height={26} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={30} y={70} fontSize={9} fill="var(--muted-foreground)">depth=5, index=22 → state_root까지 Merkle 경로</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BootRespViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 110" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
