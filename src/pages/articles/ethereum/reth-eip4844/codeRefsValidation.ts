import type { CodeRef } from '@/components/code/types';
import validateEthRs from './codebase/reth/crates/transaction-pool/src/validate/eth.rs?raw';
import consensusRs from './codebase/reth/crates/consensus/common/src/validation.rs?raw';

export const validationRefs: Record<string, CodeRef> = {
  'tx-validate-stateless': {
    path: 'reth/crates/transaction-pool/src/validate/eth.rs',
    code: validateEthRs,
    lang: 'rust',
    highlight: [4, 45],
    desc: '문제: Blob TX가 풀에 진입하기 전 상태 없이 빠르게 필터링해야 합니다.\n\n해결: 포크 활성 여부, 크기 한도, blob 개수를 검사합니다. 상태 조회 없이 O(1).',
    annotations: [
      { lines: [9, 12], color: 'sky', note: 'Cancun 포크 미활성 → EIP-4844 거부' },
      { lines: [18, 24], color: 'emerald', note: 'blob TX는 input 바이트 기준 크기 제한 (본체만 메모리)' },
      { lines: [28, 41], color: 'amber', note: 'blob 개수 0이면 거부, max_blob_count 초과도 거부' },
    ],
  },
  'tx-validate-eip4844': {
    path: 'reth/crates/transaction-pool/src/validate/eth.rs',
    code: validateEthRs,
    lang: 'rust',
    highlight: [49, 75],
    desc: '문제: Blob TX의 사이드카가 유효한지 KZG 검증을 수행해야 합니다. re-org 시 blob이 없는 경우도 처리해야 합니다.\n\n해결: take_blob()으로 사이드카를 추출하고, Missing/Present/None 3가지 케이스로 분기합니다.',
    annotations: [
      { lines: [56, 57], color: 'sky', note: 'None: blob TX인데 사이드카 자체가 없음 → 에러' },
      { lines: [60, 65], color: 'emerald', note: 'Missing: re-org 재주입. BlobStore에 있으면 OK' },
      { lines: [68, 71], color: 'amber', note: 'Present: KZG 검증 수행 → 성공 시 사이드카 반환' },
    ],
  },
  'header-blob-gas': {
    path: 'reth/crates/consensus/common/src/validation.rs',
    code: consensusRs,
    lang: 'rust',
    highlight: [4, 17],
    desc: '문제: 블록 헤더의 blob_gas_used가 실제 blob TX의 가스 합계와 일치해야 합니다.\n\n해결: 본체의 blob gas 합계와 헤더 값을 비교. 불일치 시 ConsensusError.',
    annotations: [
      { lines: [7, 9], color: 'sky', note: 'header의 blob_gas_used 필드 존재 확인' },
      { lines: [10, 15], color: 'emerald', note: '본체 합계 ≠ 헤더 값이면 BlobGasUsedDiff 에러' },
    ],
  },
  'header-4844-standalone': {
    path: 'reth/crates/consensus/common/src/validation.rs',
    code: consensusRs,
    lang: 'rust',
    highlight: [20, 50],
    desc: '문제: 부모 블록 없이도 헤더의 EIP-4844 필드를 검증해야 합니다.\n\n해결: 4가지 독립 검사 — blob_gas_used 존재, beacon root 존재, 131072 배수, 최대값 초과.',
    annotations: [
      { lines: [28, 29], color: 'sky', note: 'blob_gas_used 필드 존재 확인' },
      { lines: [32, 34], color: 'emerald', note: 'parent_beacon_block_root — Cancun 필수 필드' },
      { lines: [38, 42], color: 'amber', note: 'DATA_GAS_PER_BLOB(131072)의 배수 검증' },
      { lines: [46, 49], color: 'violet', note: '블록당 최대 blob gas 초과 확인' },
    ],
  },
};
