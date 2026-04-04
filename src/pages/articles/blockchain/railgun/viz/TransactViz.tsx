import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './TransactVizData';

function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={110} h={45} label="transact()" sub="내부 전송" color={C.proof} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={155} y={12} width={300} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={165} y={28} fontSize={10} fill="var(--foreground)">Alice → Bob (shielded)</text>
      <text x={165} y={43} fontSize={10} fill={C.null}>inputNullifiers = [0xbe71..]</text>
      <text x={165} y={58} fontSize={10} fill={C.commit}>outputCommitments = [0x44ab..]</text>
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <ActionBox x={20} y={15} w={130} h={38} label="verifyProof()" sub="Groth16 검증" color={C.proof} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={170} y={10} width={280} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={180} y={27} fontSize={10} fill="var(--muted-foreground)">e(A,B) == e(α,β)·e(vk_x,γ)·e(C,δ)</text>
      <text x={180} y={42} fontSize={10} fill="var(--muted-foreground)">publicInputs = [nullifier, root, commits]</text>
      <text x={180} y={57} fontSize={11} fill={C.proof} fontWeight={600}>→ true (증명 유효)</text>
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <ActionBox x={20} y={15} w={170} h={38} label="require(!nullifiers[n])" sub="이중사용 루프" color={C.null} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={210} y={10} width={240} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={220} y={27} fontSize={10} fill="var(--muted-foreground)">nullifiers[0xbe71..] == false ✓</text>
      <text x={220} y={44} fontSize={10} fill={C.null} fontWeight={600}>nullifiers[0xbe71..]: false → true</text>
      <text x={220} y={58} fontSize={10} fill="var(--muted-foreground)">Alice의 Note 소비 완료</text>
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <ActionBox x={20} y={15} w={140} h={38} label="insertLeaf(0x44ab..)" sub="Bob의 새 Note" color={C.commit} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={180} y={10} width={270} height={55} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={190} y={27} fontSize={10} fill="var(--muted-foreground)">leaves[43] ← 0x44ab..</text>
      <text x={190} y={44} fontSize={10} fill={C.commit} fontWeight={600}>root: 0xf1e2.. → 0xd2e1..</text>
      <text x={190} y={58} fontSize={10} fill="var(--muted-foreground)">Bob만 이 Note를 소비할 수 있다</text>
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <ActionBox x={20} y={20} w={120} h={35} label="emit Transact" sub="이벤트" color={C.event} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={160} y={15} width={290} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={170} y={33} fontSize={10} fill={C.event} fontWeight={600}>Transact([0xbe71..], [0x44ab..])</text>
      <text x={170} y={50} fontSize={10} fill="var(--muted-foreground)">해시만 공개. 금액·수신자·토큰 비공개.</text>
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function TransactViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => { const S = R[step]; return <svg viewBox="0 0 480 150" className="w-full max-w-2xl"><S /></svg>; }}
    </StepViz>
  );
}
