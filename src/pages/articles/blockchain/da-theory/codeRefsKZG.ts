import type { CodeRef } from '@/components/code/types';

import kzgGo from './codebase/go-ethereum/crypto/kzg4844/kzg4844.go?raw';
import eipsGo from './codebase/go-ethereum/core/vm/eips.go?raw';

export const kzgCodeRefs: Record<string, CodeRef> = {
  'kzg-types': {
    path: 'go-ethereum/crypto/kzg4844/kzg4844.go',
    code: kzgGo,
    lang: 'go',
    highlight: [41, 85],
    desc: 'KZG4844 패키지의 핵심 타입들입니다.\nBlob은 131072바이트(4096개 필드 원소 x 32바이트) 고정 배열입니다.\nCommitment(48B)과 Proof(48B)는 BLS12-381 곡선 위의 점을 압축 직렬화한 것입니다.',
    annotations: [
      { lines: [42, 42], color: 'sky', note: 'Blob [131072]byte — 128KB 고정. 4096개 BLS 필드 원소' },
      { lines: [55, 55], color: 'emerald', note: 'Commitment [48]byte — 다항식 커밋먼트 (G1 점)' },
      { lines: [68, 68], color: 'amber', note: 'Proof [48]byte — 몫 다항식의 커밋먼트 (G1 점)' },
    ],
  },

  'kzg-commit-verify': {
    path: 'go-ethereum/crypto/kzg4844/kzg4844.go',
    code: kzgGo,
    lang: 'go',
    highlight: [109, 162],
    desc: 'KZG 핵심 연산: BlobToCommitment → ComputeBlobProof → VerifyBlobProof.\n① blob 데이터를 다항식으로 해석 → G1 커밋먼트 생성\n② blob과 커밋먼트로 증명 계산\n③ 검증자가 (commitment, proof)만으로 blob 무결성 확인.\nGo/C 백엔드를 useCKZG 플래그로 런타임 전환합니다.',
    annotations: [
      { lines: [110, 115], color: 'sky', note: 'BlobToCommitment — blob → 다항식 보간 → G1 커밋 (trusted setup 사용)' },
      { lines: [139, 144], color: 'emerald', note: 'ComputeBlobProof — (blob, commitment) → proof' },
      { lines: [147, 152], color: 'amber', note: 'VerifyBlobProof — blob와 commitment의 일치를 증명으로 검증' },
    ],
  },

  'kzg-cell-proofs': {
    path: 'go-ethereum/crypto/kzg4844/kzg4844.go',
    code: kzgGo,
    lang: 'go',
    highlight: [154, 186],
    desc: 'Osaka(PeerDAS) 대비 cell proof 연산입니다.\nblob을 128개 cell로 분할 → 각 cell마다 KZG proof 생성.\n라이트 노드가 전체 blob 없이 일부 cell만 샘플링하여 가용성을 확인할 수 있습니다.\nCalcBlobHashV1은 커밋먼트의 SHA256에 0x01 prefix를 붙여 versioned hash를 만듭니다.',
    annotations: [
      { lines: [157, 162], color: 'sky', note: 'VerifyCellProofs — 128 x blobCount개 proof 배치 검증' },
      { lines: [168, 173], color: 'emerald', note: 'ComputeCellProofs — blob → 128개 cell proof 생성' },
      { lines: [177, 186], color: 'amber', note: 'CalcBlobHashV1 — SHA256(commitment)에 version 0x01 접두사' },
    ],
  },

  'opcode-blobhash': {
    path: 'go-ethereum/core/vm/eips.go',
    code: eipsGo,
    lang: 'go',
    highlight: [280, 314],
    desc: 'BLOBHASH(0x49) 옵코드 — EVM에서 blob의 versioned hash에 접근합니다.\n스택에서 인덱스를 pop → TxContext.BlobHashes[index]를 push.\n범위 밖이면 0을 반환합니다. 롤업 컨트랙트가 blob 데이터를 참조할 때 사용합니다.',
    annotations: [
      { lines: [282, 288], color: 'sky', note: 'BlobHashes 배열 범위 확인 → 범위 밖이면 Clear(0)' },
      { lines: [293, 296], color: 'emerald', note: 'BLOBBASEFEE — 현재 블록의 blob 기본 수수료를 push' },
      { lines: [308, 313], color: 'amber', note: 'enable4844 — Cancun JumpTable에 BLOBHASH 등록' },
    ],
  },
};
