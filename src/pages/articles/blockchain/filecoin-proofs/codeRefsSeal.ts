import type { CodeRef } from '@/components/code/types';
import sealRs from './codebase/rust-fil-proofs/filecoin-proofs/src/api/seal.rs?raw';

export const sealCodeRefs: Record<string, CodeRef> = {
  'seal-pc1': {
    path: 'filecoin-proofs/src/api/seal.rs',
    code: sealRs,
    lang: 'rust',
    highlight: [58, 207],
    annotations: [
      { lines: [58, 67], color: 'sky', note: 'seal_pre_commit_phase1 시그니처 — PoRepConfig, 경로, prover_id, ticket' },
      { lines: [145, 176], color: 'emerald', note: 'comm_d 계산 — BinaryMerkleTree(SHA256)로 원본 데이터 Merkle 루트' },
      { lines: [185, 191], color: 'amber', note: 'replica_id 파생 — SHA256(prover_id || sector_id || ticket || comm_d)' },
      { lines: [193, 197], color: 'violet', note: 'SDR 11계층 레이블링 — replicate_phase1 (CPU 집약)' },
    ],
    desc: 'PC1(Pre-Commit Phase 1)은 원본 데이터를 mmap한 후 comm_d(원본 Merkle 루트)를 계산하고, replica_id를 파생한 뒤 SDR 11계층 레이블링을 수행합니다.',
  },

  'seal-pc2': {
    path: 'filecoin-proofs/src/api/seal.rs',
    code: sealRs,
    lang: 'rust',
    highlight: [210, 312],
    annotations: [
      { lines: [210, 219], color: 'sky', note: 'seal_pre_commit_phase2 시그니처 — PC1 출력 + 캐시/복제본 경로' },
      { lines: [262, 277], color: 'emerald', note: '데이터 트리 로드 — DiskStore에서 BinaryMerkleTree 복원' },
      { lines: [292, 299], color: 'amber', note: 'replicate_phase2 — TreeC/TreeR 생성 (GPU 가속), 복제본 인코딩' },
      { lines: [301, 308], color: 'violet', note: 'comm_r 계산 — SHA256(comm_c || comm_r_last), p_aux/t_aux 저장' },
    ],
    desc: 'PC2는 PC1 출력(레이블)을 받아 TreeC(컬럼 해시)와 TreeR(복제본 Merkle)을 생성합니다. GPU로 Poseidon 해시를 가속하며, comm_r = SHA256(comm_c || comm_r_last)을 계산합니다.',
  },

  'seal-c2': {
    path: 'filecoin-proofs/src/api/seal.rs',
    code: sealRs,
    lang: 'rust',
    highlight: [590, 645],
    annotations: [
      { lines: [590, 605], color: 'sky', note: 'seal_commit_phase2 시그니처 — C1 출력 + prover_id + sector_id' },
      { lines: [607, 608], color: 'emerald', note: 'Groth16 증명 생성 — seal_commit_phase2_circuit_proofs' },
      { lines: [611, 626], color: 'amber', note: 'NI-PoRep이면 증명 집계 — aggregate_seal_commit_proofs' },
      { lines: [630, 641], color: 'violet', note: '자기 검증 — verify_seal로 증명 유효성 확인 후 반환' },
    ],
    desc: 'C2(Commit Phase 2)는 Groth16 SNARK 증명을 생성합니다. Non-Interactive PoRep이 활성화되면 증명을 집계하고, 반환 전 verify_seal로 자기 검증을 수행합니다.',
  },
};
