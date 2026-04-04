import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C, STEPS } from './CommitmentVizData';

function Step0() {
  const fields = [
    { label: 'npk = 0xa3f2..', y: 15 },
    { label: 'token = 0xA0b8..', y: 40 },
    { label: 'value = 1000', y: 65 },
    { label: 'random = 0x7b1e..', y: 90 },
  ];
  return (<g>
    <text x={30} y={12} fontSize={10} fill="var(--muted-foreground)">hashCommitment 입력:</text>
    {fields.map((f, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={30} y={f.y} w={140} h={20} label={f.label} color={C.input} />
      </motion.g>
    ))}
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={20} y={20} w={130} h={40} label="poseidon4()" sub="4-input 해시" color={C.hash} />
    <motion.line x1={155} y1={40} x2={210} y2={40} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={215} y={27} w={210} h={26} label="commitment = 0x2d8a..f1e2" color={C.hash} />
    </motion.g>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ZK-friendly 해시: 소수 필드 위 산술 연산만 사용
    </text>
  </g>);
}

function Step2() {
  const slots = [40, 41, 42, 43, 44];
  return (<g>
    <text x={30} y={20} fontSize={10} fill="var(--muted-foreground)">Merkle leaves[]</text>
    {slots.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <rect x={30 + i * 85} y={28} width={78} height={28} rx={4}
          fill={s === 42 ? `${C.merkle}15` : 'var(--card)'} stroke={s === 42 ? C.merkle : 'var(--border)'} strokeWidth={s === 42 ? 1.2 : 0.5} />
        <text x={30 + i * 85 + 39} y={40} textAnchor="middle" fontSize={10}
          fill={s === 42 ? C.merkle : 'var(--muted-foreground)'}>[{s}]</text>
        <text x={30 + i * 85 + 39} y={52} textAnchor="middle" fontSize={8}
          fill={s === 42 ? C.merkle : 'var(--muted-foreground)'}>{s === 42 ? '0x2d8a..' : s < 42 ? '0x..' : '0x00'}</text>
      </motion.g>
    ))}
    <motion.text x={240} y={80} textAnchor="middle" fontSize={10} fill={C.merkle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      nextIndex: 42 → 43
    </motion.text>
  </g>);
}

function Step3() {
  const levels = ['leaf: 0x2d8a..', 'd0: poseidon(leaf, sib₀)', 'd1: poseidon(h₀, sib₁)', 'root = 0xf1e2..ab34'];
  return (<g>
    {levels.map((l, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.25 }}>
        <rect x={30} y={10 + i * 26} width={400} height={20} rx={4}
          fill={i === 3 ? `${C.root}12` : 'var(--card)'} stroke={i === 3 ? C.root : 'var(--border)'} strokeWidth={0.5} />
        <text x={40} y={24 + i * 26} fontSize={10}
          fill={i === 3 ? C.root : 'var(--foreground)'} fontWeight={i === 3 ? 600 : 400}>{l}</text>
      </motion.g>
    ))}
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function CommitmentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
