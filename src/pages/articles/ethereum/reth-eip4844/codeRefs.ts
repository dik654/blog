import type { CodeRef } from '@/components/code/types';
import eip4844Rs from './codebase/reth/crates/primitives-traits/src/eip4844.rs?raw';
import blobRs from './codebase/reth/crates/transaction-pool/src/blobstore/blob.rs?raw';
import { blobStoreRefs } from './codeRefsBlobStore';
import { validationRefs } from './codeRefsValidation';
import { trackerRefs } from './codeRefsTracker';

const baseRefs: Record<string, CodeRef> = {
  'blob-gas': {
    path: 'reth/crates/primitives-traits/src/eip4844.rs',
    code: eip4844Rs,
    lang: 'rust',
    highlight: [5, 42],
    desc: '문제: Blob 가스는 일반 가스와 별도의 가격 메커니즘을 사용합니다. 수요에 따라 지수 함수적으로 가격이 변동합니다.\n\n해결: calc_excess_blob_gas()로 초과 blob 가스를 누적하고, calc_blob_fee()가 fake_exponential()로 지수 가격을 계산합니다.',
    annotations: [
      { lines: [5, 16], color: 'sky', note: 'calc_excess_blob_gas: 이전 블록의 excess+used가 target보다 크면 초과분 누적' },
      { lines: [20, 27], color: 'emerald', note: 'calc_blob_fee: fake_exponential()로 지수 가격 산출' },
      { lines: [31, 42], color: 'amber', note: 'fake_exponential: Taylor 급수로 정수만 사용하는 지수 근사' },
    ],
  },
  'blob-validate': {
    path: 'reth/crates/transaction-pool/src/blobstore/blob.rs',
    code: blobRs,
    lang: 'rust',
    highlight: [4, 38],
    desc: '문제: Blob TX의 사이드카(blobs + commitments + proofs)가 올바른지 검증해야 합니다.\n\n해결: 개수 일치 확인 → blob 한도 확인 → commitment → versioned hash 매칭 → KZG proof 배치 검증 순으로 처리합니다.',
    annotations: [
      { lines: [9, 13], color: 'sky', note: 'blob, commitment, proof 개수가 모두 같아야 함' },
      { lines: [16, 20], color: 'emerald', note: 'MAX_BLOBS_PER_BLOCK(6) 초과 시 거부' },
      { lines: [23, 28], color: 'amber', note: 'KZG commitment → versioned hash 변환 후 일치 확인' },
      { lines: [31, 36], color: 'violet', note: 'KZG proof 배치 검증 — blob 데이터와 commitment 일치 증명' },
    ],
  },
};

export const codeRefs: Record<string, CodeRef> = {
  ...baseRefs,
  ...blobStoreRefs,
  ...validationRefs,
  ...trackerRefs,
};
