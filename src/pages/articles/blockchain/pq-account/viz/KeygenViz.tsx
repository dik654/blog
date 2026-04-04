import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';
import { C, STEPS } from './KeygenVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={20} w={110} h={40} label="random(32B)" sub="CSPRNG" color={C.seed} />
    <motion.line x1={135} y1={40} x2={185} y2={40} stroke={C.seed} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={190} y={25} w={120} h={30} label="rho (32B)" sub="행렬 시드" color={C.seed} />
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      rho로부터 A 행렬을 결정론적으로 재생성 가능
    </text>
  </g>);
}

function Step1() {
  return (<g>
    <DataBox x={15} y={20} w={80} h={26} label="rho" color={C.seed} />
    <motion.line x1={100} y1={33} x2={140} y2={33} stroke={C.matrix} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={145} y={10} width={120} height={60} rx={6} fill={`${C.matrix}08`} stroke={C.matrix} strokeWidth={0.8} />
      <text x={205} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.matrix}>A (4x4)</text>
      <text x={205} y={42} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">256 coeff each</text>
      <text x={205} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">mod q=8380417</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <text x={290} y={40} fontSize={10} fill="var(--muted-foreground)">SHAKE-128</text>
    </motion.g>
  </g>);
}

function Step2() {
  const vals = ['-2', '-1', '0', '1', '2'];
  return (<g>
    <text x={20} y={25} fontSize={10} fill="var(--muted-foreground)">SampleShort(eta=2):</text>
    {vals.map((v, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20 + i * 50} y={35} width={40} height={24} rx={12}
          fill={v === '0' ? 'var(--card)' : `${C.secret}12`} stroke={C.secret} strokeWidth={0.7} />
        <text x={40 + i * 50} y={51} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.secret}>{v}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <text x={290} y={35} fontSize={10} fill="var(--muted-foreground)">s1: 4 polys x 256 coeff</text>
      <text x={290} y={50} fontSize={10} fill="var(--muted-foreground)">s2: 4 polys x 256 coeff</text>
      <text x={290} y={65} fontSize={10} fill={C.secret}>비밀 정보 (짧은 벡터)</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <DataBox x={10} y={18} w={60} h={24} label="A" color={C.matrix} />
    <text x={80} y={34} fontSize={11} fill="var(--muted-foreground)">*</text>
    <DataBox x={90} y={18} w={60} h={24} label="s1" color={C.secret} />
    <text x={160} y={34} fontSize={11} fill="var(--muted-foreground)">+</text>
    <DataBox x={170} y={18} w={60} h={24} label="s2" color={C.secret} />
    <motion.text x={245} y={34} fontSize={12} fill={C.pk}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      =
    </motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
      <rect x={260} y={10} width={190} height={45} rx={6} fill={`${C.pk}10`} stroke={C.pk} strokeWidth={1} />
      <text x={355} y={28} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.pk}>t = A*s1 + s2</text>
      <text x={355} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">공개키: 4 polys x 256 coeff</text>
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      NTT 도메인 곱셈 — O(n log n) 효율
    </text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function KeygenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>;
      }}
    </StepViz>
  );
}
