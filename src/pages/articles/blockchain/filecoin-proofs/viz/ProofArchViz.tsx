import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { core: '#6366f1', porep: '#10b981', post: '#f59e0b', hash: '#ec4899' };

const STEPS = [
  { label: '전체 아키텍처 — 크레이트 구조', body: 'Filecoin 증명 시스템의 크레이트 의존 관계입니다.' },
  { label: '공통 인프라 내부', body: 'core 크레이트와 hashers가 기반을 제공합니다.' },
  { label: 'PoRep 레이어 내부', body: 'Stacked DRG + Groth16으로 복제 증명을 생성합니다.' },
  { label: 'PoSt 레이어 내부', body: 'WindowPoSt와 WinningPoSt가 지속 저장을 증명합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">크레이트 의존 관계 전체</text>
    <text x={20} y={44} fontSize={10} fill={C.hash}>Line 1: filecoin-hashers → Poseidon, SHA256 해시 제공</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.core}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
      Line 2: proofs-core → MerkleTree, Graph, 공통 trait 정의
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.porep}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
      Line 3: proofs-porep → StackedDRG + 회로 (core 의존)
    </motion.text>
    <motion.text x={20} y={98} fontSize={10} fill={C.post}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
      Line 4: proofs-post → Window/WinningPoSt (core + bellperson 의존)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.core}>proofs-core + filecoin-hashers</text>
    <text x={20} y={44} fontSize={10} fill={C.hash}>Line 1: pub trait Hasher: Domain {'{'} fn hash(data: &[u8]) → Self  </text>
    <motion.text x={20} y={62} fontSize={10} fill={C.core}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pub struct MerkleTree{'<'}H: Hasher{'>'} {'{'} data: Vec{'<'}H::Domain{'>'} {'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Poseidon(ZK-friendly) + SHA256(일반 해싱)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.porep}>proofs-porep — StackedDRG</text>
    <text x={20} y={44} fontSize={10} fill={C.porep}>Line 1: pub fn seal(config, data) → SealOutput // 봉인 메인</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.porep}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   labels := generate_labels(graph, data)  // SDR 11레이어
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   proof := groth16::prove(circuit, labels) {'}'}  // zk-SNARK
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.post}>proofs-post — Window/Winning</text>
    <text x={20} y={44} fontSize={10} fill={C.post}>Line 1: WindowPoSt: 48 deadlines, 각 30분 주기</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.post}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: WinningPoSt: 블록 생산 시 소수 리프 Merkle 증명
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 둘 다 bellperson GPU 가속 Groth16 사용
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={110} h={22} label="bellperson" sub="GPU 가속" color={C.post} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ProofArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
