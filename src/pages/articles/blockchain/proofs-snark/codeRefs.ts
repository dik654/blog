import type { CodeRef } from '@/components/code/types';
import proverRs from './codebase/bellperson/prover.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'snark-prover': {
    path: 'src/groth16/prover/native.rs',
    code: proverRs, lang: 'rust', highlight: [4, 50],
    desc: 'create_proof_batch_priority_inner — Groth16 배치 증명 생성 (GPU MSM + NTT)',
    annotations: [
      { lines: [16, 21], color: 'sky',
        note: '회로 합성 — R1CS 제약 조건을 ProvingAssignment로 수집' },
      { lines: [28, 33], color: 'emerald',
        note: 'FFT/NTT — GPU 커널로 QAP 다항식 평가 가속' },
      { lines: [36, 45], color: 'amber',
        note: 'MSM — GPU 커널로 G1/G2 점 곱셈 (전체 시간의 70~80%)' },
      { lines: [51, 54], color: 'violet',
        note: 'Proof 구조체 — A(G1) + B(G2) + C(G1) = 192바이트' },
    ],
  },
};
