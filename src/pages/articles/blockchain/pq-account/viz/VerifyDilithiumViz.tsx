import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './VerifyDilithiumVizData';

function Step0() {
  return (<g>
    <DataBox x={10} y={15} w={50} h={22} label="A" color={C.restore} />
    <text x={68} y={30} fontSize={10} fill="var(--muted-foreground)">*</text>
    <DataBox x={78} y={15} w={50} h={22} label="z" color={C.restore} />
    <text x={136} y={30} fontSize={10} fill="var(--muted-foreground)">-</text>
    <DataBox x={145} y={15} w={50} h={22} label="c" color={C.check} />
    <text x={203} y={30} fontSize={10} fill="var(--muted-foreground)">*</text>
    <DataBox x={213} y={15} w={50} h={22} label="t" color={C.check} />
    <motion.line x1={268} y1={26} x2={300} y2={26} stroke={C.restore} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={305} y={10} w={120} h={36} label="UseHint(h, ...)" sub="상위 비트 복원" color={C.restore} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={335} y={55} w={100} h={24} label="w1'" sub="복원됨" color={C.restore} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <rect x={15} y={10} width={440} height={75} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <motion.text x={25} y={28} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>
      A*z - c*t
    </motion.text>
    <motion.text x={25} y={43} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      = A*(y + c*s1) - c*(A*s1 + s2)
    </motion.text>
    <motion.text x={25} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      = A*y + A*c*s1 - c*A*s1 - c*s2
    </motion.text>
    <motion.text x={25} y={73} fontSize={11} fontWeight={600} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      = A*y - c*s2 (c*s2 작음 → HighBits = w1)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <DataBox x={15} y={18} w={80} h={24} label="mu" color={C.check} />
    <text x={105} y={34} fontSize={11} fill="var(--muted-foreground)">||</text>
    <DataBox x={115} y={18} w={80} h={24} label="w1'" color={C.restore} />
    <motion.line x1={200} y1={30} x2={240} y2={30} stroke={C.check} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={245} y={18} w={90} h={24} label="c_tilde'" color={C.check} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={350} y={34} fontSize={12} fill="var(--muted-foreground)">==</text>
      <DataBox x={370} y={18} w={90} h={24} label="c_tilde" color={C.proof} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      <rect x={200} y={60} width={100} height={26} rx={13} fill={`${C.proof}15`} stroke={C.proof} strokeWidth={1} />
      <text x={250} y={77} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.proof}>VALID</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function VerifyDilithiumViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
