import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C, STEPS } from './ZKCircuitVizData';

function Step0() {
  const pub = ['nullifier', 'merkleRoot', 'outputCommits', 'fee'];
  const priv = ['spendingKey', 'leafIndex', 'siblings[16]', 'noteValues'];
  return (<g>
    <text x={30} y={15} fontSize={10} fontWeight={600} fill={C.public}>public inputs</text>
    {pub.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={30} y={20 + i * 24} w={110} h={19} label={p} color={C.public} />
      </motion.g>
    ))}
    <text x={260} y={15} fontSize={10} fontWeight={600} fill={C.private}>private inputs</text>
    {priv.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.2 }}>
        <DataBox x={260} y={20 + i * 24} w={110} h={19} label={p} color={C.private} />
      </motion.g>
    ))}
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={20} y={15} w={200} h={35} label="poseidon(sk, idx)" sub="nullifier 재계산" color={C.constraint} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={240} y={10} width={220} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={250} y={28} fontSize={10} fill="var(--muted-foreground)">poseidon(0x9c4d.., 42) → 0xbe71..</text>
      <text x={250} y={45} fontSize={10} fill={C.constraint} fontWeight={600}>assert 0xbe71.. == nullifier ✓</text>
    </motion.g>
    <text x={240} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      "이 nullifier를 만든 사람이 진짜 sk 소유자"
    </text>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={15} y={10} w={160} h={35} label="merkleVerify()" sub="commitment ∈ tree" color={C.constraint} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={195} y={5} width={270} height={65} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={205} y={22} fontSize={10} fill="var(--muted-foreground)">commit = poseidon(npk, token, value, random)</text>
      <text x={205} y={38} fontSize={10} fill="var(--muted-foreground)">hash chain: poseidon(leaf, s₀) → ... → root</text>
      <text x={205} y={55} fontSize={10} fill={C.constraint} fontWeight={600}>assert root == merkleRoot (public) ✓</text>
    </motion.g>
    <text x={240} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      "이 commitment가 실제로 Merkle tree에 존재"
    </text>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={20} y={15} w={200} h={35} label="sum(in) == sum(out) + fee" sub="밸런스 보존" color={C.sum} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={240} y={10} width={220} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={250} y={28} fontSize={10} fill="var(--muted-foreground)">inputs = [1000]</text>
      <text x={250} y={43} fontSize={10} fill="var(--muted-foreground)">outputs = [900], fee = 100</text>
      <text x={250} y={58} fontSize={10} fill={C.sum} fontWeight={600}>assert 1000 == 900 + 100 ✓</text>
    </motion.g>
    <text x={240} y={90} textAnchor="middle" fontSize={10} fill={C.sum}>
      돈이 허공에서 생성·소멸되지 않음을 증명
    </text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ZKCircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
