import type { CodeRef } from '@/components/code/types';

import txBlobGo from './codebase/go-ethereum/core/types/tx_blob.go?raw';
import validationGo from './codebase/go-ethereum/core/txpool/validation.go?raw';

export const blobCodeRefs: Record<string, CodeRef> = {
  'blob-tx-struct': {
    path: 'go-ethereum/core/types/tx_blob.go',
    code: txBlobGo,
    lang: 'go',
    highlight: [47, 68],
    desc: 'BlobTx는 EIP-4844 트랜잭션 타입입니다.\n기존 DynamicFeeTx에 BlobFeeCap(blob 가스 최대 가격)과 BlobHashes(versioned hash 목록)가 추가됩니다.\nSidecar는 네트워크 전파 시에만 포함되고, 블록에는 저장되지 않습니다.',
    annotations: [
      { lines: [57, 57], color: 'amber', note: 'BlobFeeCap — blob 가스의 최대 가격 (별도 수수료 시장)' },
      { lines: [58, 58], color: 'sky', note: 'BlobHashes — 각 blob 커밋먼트의 versioned hash' },
      { lines: [62, 62], color: 'emerald', note: 'Sidecar — 실제 blob 데이터 + 증명. rlp:"-"로 블록 직렬화에서 제외' },
    ],
  },

  'blob-sidecar': {
    path: 'go-ethereum/core/types/tx_blob.go',
    code: txBlobGo,
    lang: 'go',
    highlight: [71, 96],
    desc: 'BlobTxSidecar는 blob 데이터 + KZG 커밋먼트 + 증명을 묶은 구조체입니다.\nVersion 0(Cancun)은 blob당 1개 증명, Version 1(Osaka)은 128개 cell proof를 사용합니다.\nBlobHashes()로 커밋먼트에서 versioned hash를 계산합니다.',
    annotations: [
      { lines: [72, 72], color: 'amber', note: 'Version — 0: blob proof(Cancun), 1: cell proof(Osaka/DAS 대비)' },
      { lines: [73, 75], color: 'sky', note: 'Blobs[131072B] + Commitments[48B] + Proofs[48B]' },
      { lines: [89, 96], color: 'emerald', note: 'SHA256(commitment)에 version byte 0x01 접두사 → versioned hash' },
    ],
  },

  'blob-validate-tx': {
    path: 'go-ethereum/core/txpool/validation.go',
    code: validationGo,
    lang: 'go',
    highlight: [161, 199],
    desc: 'validateBlobTx는 blob 트랜잭션의 정적 유효성 검증입니다.\n① sidecar 존재 확인 ② 포크별 version 일치 ③ 최소 blob 가스 가격 ④ blob 개수 제한(최대 6개)\n⑤ 커밋먼트-해시 일치 ⑥ KZG 증명 검증까지 단계적으로 수행합니다.',
    annotations: [
      { lines: [168, 173], color: 'amber', note: 'Osaka 이후 Version1(cell proof), 이전은 Version0(blob proof)' },
      { lines: [181, 186], color: 'sky', note: '빈 blob 금지 + 최대 6개 제한 (BlobTxMaxBlobs)' },
      { lines: [191, 191], color: 'emerald', note: '커밋먼트에서 계산한 hash와 tx의 BlobHashes 비교' },
      { lines: [195, 199], color: 'rose', note: 'version별 분기: Legacy(blob proof) vs Osaka(cell proof)' },
    ],
  },

  'blob-validate-legacy': {
    path: 'go-ethereum/core/txpool/validation.go',
    code: validationGo,
    lang: 'go',
    highlight: [202, 222],
    desc: 'Legacy(Version 0)는 blob당 1개 증명으로 전체 blob을 검증합니다.\nOsaka(Version 1)는 128개 cell proof로 blob의 부분 검증(DAS)이 가능합니다.\nkzg4844.VerifyBlobProof → 다항식 커밋먼트와 blob 데이터의 일치를 수학적으로 확인.',
    annotations: [
      { lines: [206, 208], color: 'sky', note: 'V0: blob마다 VerifyBlobProof — O(n) 개별 검증' },
      { lines: [214, 219], color: 'emerald', note: 'V1: VerifyCellProofs — 128개 cell proof 배치 검증' },
    ],
  },
};
