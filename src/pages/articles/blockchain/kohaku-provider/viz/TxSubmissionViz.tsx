import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './TxSubmissionVizData';

function Step0() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 1~2</text>
    <ActionBox x={15} y={22} w={120} h={28} label="epoch 계산" sub="시간 기반" color={C.stem} />
    <motion.line x1={140} y1={36} x2={175} y2={36} stroke={C.stem} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={180} y={24} w={140} h={24} label="stem_peer = peers[seed]" color={C.stem} />
    </motion.g>
    <motion.text x={400} y={38} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      에폭 동안 고정
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 3</text>
    <ModuleBox x={15} y={25} w={80} h={38} label="발신자" sub="Kohaku" color={C.stem} />
    <motion.line x1={100} y1={44} x2={150} y2={44} stroke={C.stem} strokeWidth={1.5}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={155} y={25} w={80} h={38} label="Stem 피어" sub="hop: 0" color={C.stem} />
      <text x={255} y={38} fontSize={9} fill={C.stem}>StemMessage</text>
      <text x={255} y={50} fontSize={9} fill="var(--muted-foreground)">{'{ tx, hop: 0 }'}</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={14} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 4~5</text>
    {[0, 1, 2].map((i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 }}>
        <ModuleBox x={15 + i * 125} y={25} w={100} h={38} label={`릴레이 ${i + 1}`}
          sub={`hop: ${i + 1}`} color={C.relay} />
        {i < 2 && <line x1={120 + i * 125} y1={44} x2={140 + i * 125} y2={44}
          stroke={C.relay} strokeWidth={1} />}
      </motion.g>
    ))}
    <motion.text x={420} y={48} fontSize={10} fill={C.relay}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      hop ≥ 3~5?
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={10} fontSize={9} fontWeight={600} fill="var(--muted-foreground)">Line 6~9: Fluff</text>
    <ModuleBox x={170} y={15} w={80} h={30} label="릴레이 N" sub="Fluff 시작" color={C.fluff} />
    {[0, 1, 2, 3].map((i) => {
      const angle = -60 + i * 40;
      const rad = (angle * Math.PI) / 180;
      const ex = 210 + Math.cos(rad) * 120, ey = 30 + Math.sin(rad) * 55;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.12 }}>
          <motion.line x1={210} y1={45} x2={ex} y2={ey} stroke={C.fluff} strokeWidth={0.8}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }} />
          <circle cx={ex} cy={ey} r={8} fill={`${C.fluff}22`} stroke={C.fluff} strokeWidth={0.8} />
          <text x={ex} y={ey + 3} textAnchor="middle" fontSize={7} fill={C.fluff}>P{i + 1}</text>
        </motion.g>
      );
    })}
    <motion.text x={240} y={100} textAnchor="middle" fontSize={10} fill={C.fluff}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      전체 가십 — 발신자 특정 불가
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function TxSubmissionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 120" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
