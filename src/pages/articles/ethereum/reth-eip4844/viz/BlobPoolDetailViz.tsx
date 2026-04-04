import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './BlobPoolDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      validate_blob_sidecar() 진입
    </text>
    <text x={20} y={42} fontSize={10} fill={C.check}>
      Line 1: fn validate_blob_sidecar(sidecar: &amp;BlobSidecar) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.blob}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let blobs = &amp;sidecar.blobs  // Vec&lt;Blob&gt;
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     let commits = &amp;sidecar.commitments
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     let proofs = &amp;sidecar.proofs  // 4단계 검증
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      개수 일치 + 한도 확인
    </text>
    <text x={20} y={42} fontSize={10} fill={C.check}>
      Line 1: ensure!(blobs.len() == commits.len())
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: ensure!(commits.len() == proofs.len())
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: ensure!(blobs.len() &lt;= 6)  // MAX_BLOBS_PER_BLOCK
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      실패 시 MismatchedLength / TooManyBlobs (각 blob 131,072 bytes)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      versioned hash 매칭
    </text>
    <text x={20} y={42} fontSize={10} fill={C.hash}>
      Line 1: for (i, commit) in commits.iter().enumerate() {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let hash = kzg_to_versioned_hash(commit)
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     // SHA256(commit)[1..] | 0x01 prefix
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     ensure!(hash == tx.blob_hashes[i])
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.hash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      KZG proof 배치 검증
    </text>
    <text x={20} y={42} fontSize={10} fill={C.kzg}>
      Line 1: verify_blob_kzg_proof_batch(
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     &amp;blobs, &amp;commits, &amp;proofs
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.kzg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: )?  // 배치 pairing 연산
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      pairing 연산 공유 → 6개 blob도 효율적 처리
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function BlobPoolDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
