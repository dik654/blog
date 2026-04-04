import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BlobTxVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Blob TX가 필요한 이유
    </text>
    <text x={20} y={42} fontSize={10} fill={C.blob}>
      Line 1: // L2 롤업: calldata에 batch 게시 → 비용 높음
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.blob}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // EIP-4844: 별도 blob 공간 도입 → 비용 절감
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.blob}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // blob는 ~18일 후 자동 삭제 (영속 저장 X)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Blob TX 구조: TX 본체 + Sidecar
    </text>
    <text x={20} y={42} fontSize={10} fill={C.blob}>
      Line 1: struct BlobTx {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.blob}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     blob_versioned_hashes: Vec&lt;B256&gt;  // TX 본체
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.blob}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 4: struct Sidecar {'{'} blobs, commitments, proofs {'}'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      KZG Commitment 4단계 검증
    </text>
    <text x={20} y={42} fontSize={10} fill={C.kzg}>
      Line 1: ensure!(blobs.len() == commits.len())
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: ensure!(blobs.len() &lt;= 6)  // MAX_BLOBS
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: versioned_hash 매칭 확인
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: verify_blob_kzg_proof_batch()?  // 배치 pairing
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Blob Gas 가격 — 지수 함수
    </text>
    <text x={20} y={42} fontSize={10} fill={C.gas}>
      Line 1: let excess = parent_excess + parent_used - TARGET
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // TARGET = 393,216 (3 blobs) 초과 시 가격 상승
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: let fee = fake_exponential(1, excess, 3_338_477)
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      fake_exponential — 정수 Taylor 급수
    </text>
    <text x={20} y={42} fontSize={10} fill={C.gas}>
      Line 1: let mut output = 0, accum = factor * denom
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for i in 1.. {'{'}
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     output += accum
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     accum = accum * num / (denom * i)
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      정수 연산으로 e^(num/denom) 근사 → 노드 간 결과 동일
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function BlobTxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
