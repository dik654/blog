import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C, STEPS } from './SignVizData';

function Step0() {
  return (<g>
    <ActionBox x={20} y={18} w={120} h={38} label="SampleMask" sub="gamma1 = 2^17" color={C.mask} />
    <motion.line x1={145} y1={37} x2={195} y2={37} stroke={C.mask} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={200} y={22} w={120} h={30} label="y (마스킹)" sub="큰 범위 랜덤" color={C.mask} />
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      y가 s1을 숨기는 마스크 역할
    </text>
  </g>);
}

function Step1() {
  return (<g>
    <DataBox x={10} y={18} w={60} h={24} label="A" color={C.challenge} />
    <text x={80} y={34} fontSize={11} fill="var(--muted-foreground)">*</text>
    <DataBox x={90} y={18} w={60} h={24} label="y" color={C.mask} />
    <motion.text x={165} y={34} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>→</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={180} y={18} w={60} h={24} label="w" color={C.challenge} />
    </motion.g>
    <motion.text x={255} y={34} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>HighBits →</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={330} y={18} w={100} h={24} label="w1 (상위)" color={C.challenge} />
    </motion.g>
    <text x={240} y={70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      하위 비트 제거 → 서명 크기 절약
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <rect x={15} y={15} width={180} height={35} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={25} y={33} fontSize={10} fill="var(--muted-foreground)">H(mu || w1) → c_tilde</text>
    <text x={25} y={45} fontSize={10} fill={C.challenge}>SHAKE-256</text>
    <motion.line x1={200} y1={33} x2={240} y2={33} stroke={C.challenge} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={245} y={12} width={200} height={45} rx={6} fill={`${C.challenge}08`} stroke={C.challenge} strokeWidth={0.7} />
      <text x={345} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.challenge}>c: 256 coefficients</text>
      <text x={345} y={46} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">39개 = +1/-1, 나머지 = 0</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <DataBox x={15} y={20} w={60} h={24} label="y" color={C.mask} />
    <text x={85} y={36} fontSize={11} fill="var(--muted-foreground)">+</text>
    <DataBox x={95} y={20} w={60} h={24} label="c" color={C.challenge} />
    <text x={165} y={36} fontSize={11} fill="var(--muted-foreground)">*</text>
    <DataBox x={175} y={20} w={60} h={24} label="s1" color={C.sign} />
    <motion.text x={250} y={36} fontSize={12} fill={C.sign}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>=</motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
      <rect x={265} y={14} width={170} height={38} rx={6} fill={`${C.sign}10`} stroke={C.sign} strokeWidth={1} />
      <text x={350} y={30} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sign}>z = y + c*s1</text>
      <text x={350} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">서명 벡터</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <rect x={15} y={12} width={200} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={25} y={30} fontSize={10} fill="var(--muted-foreground)">||z||inf =</text>
    <motion.text x={80} y={30} fontSize={11} fontWeight={600} fill={C.reject}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      131000
    </motion.text>
    <text x={25} y={45} fontSize={10} fill="var(--muted-foreground)">gamma1 - beta = 130570</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={240} y={10} w={130} h={44} label="RESTART" sub="s1 노출 위험" color={C.reject} />
    </motion.g>
    <motion.text x={240} y={80} textAnchor="middle" fontSize={10} fill={C.reject}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>거부 샘플링: 평균 4-7회 반복 후 성공</motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];
export default function SignViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
