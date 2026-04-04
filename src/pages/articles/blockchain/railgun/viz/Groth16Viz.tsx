import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './Groth16VizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={10} w={90} h={45} label="Prover" sub="오프체인" color={C.prover} />
    <motion.line x1={115} y1={33} x2={155} y2={33} stroke={C.prover} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={160} y={10} w={80} h={28} label="R1CS" sub="제약식" color={C.prover} />
    </motion.g>
    <motion.line x1={245} y1={24} x2={275} y2={24} stroke={C.prover} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={280} y={10} w={80} h={28} label="QAP" sub="다항식 변환" color={C.prover} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={240} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        A(x)·B(x) - C(x) = H(x)·Z(x)
      </text>
    </motion.g>
  </g>);
}

function Step1() {
  const pts = [
    { label: 'A ∈ G1', val: '[α + a(τ)]₁', color: C.prover },
    { label: 'B ∈ G2', val: '[β + b(τ)]₂', color: C.verifier },
    { label: 'C ∈ G1', val: '[c(τ)+h(τ)z(τ)]₁', color: C.pairing },
  ];
  return (<g>
    {pts.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}>
        <DataBox x={30} y={12 + i * 30} w={90} h={24} label={p.label} color={p.color} />
        <text x={135} y={28 + i * 30} fontSize={10} fill="var(--muted-foreground)">{p.val}</text>
      </motion.g>
    ))}
    <motion.text x={350} y={50} textAnchor="middle" fontSize={11} fill={C.prover} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      proof = 192 bytes
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <ModuleBox x={20} y={10} w={90} h={45} label="Verifier" sub="온체인" color={C.verifier} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={130} y={8} width={330} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={140} y={26} fontSize={10} fill="var(--muted-foreground)">e(A, B) == e(α, β) · e(vk_x, γ) · e(C, δ)</text>
      <text x={140} y={43} fontSize={10} fill="var(--muted-foreground)">vk_x = ic[0] + null·ic[1] + root·ic[2] + ...</text>
      <text x={140} y={58} fontSize={10} fill={C.verifier} fontWeight={600}>4개 페어링 → true/false</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={15} y={12} w={170} h={38} label="Verifier.verifyProof()" sub="EVM 실행" color={C.onchain} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={205} y={8} width={260} height={60} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={215} y={26} fontSize={10} fill="var(--muted-foreground)">ecAdd(0x06), ecMul(0x07)</text>
      <text x={215} y={42} fontSize={10} fill="var(--muted-foreground)">ecPairing(0x08) — EVM precompile</text>
      <text x={215} y={58} fontSize={10} fill={C.onchain} fontWeight={600}>gas ≈ 250,000 → true</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function Groth16Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
