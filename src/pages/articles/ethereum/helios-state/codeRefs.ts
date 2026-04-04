import type { CodeRef } from '@/components/code/types';

import proofRs from './codebase/helios/execution/src/proof.rs?raw';

export const codeRefs: Record<string, CodeRef> = {
  'hl-account-proof': {
    path: 'helios/execution/src/proof.rs',
    code: proofRs,
    lang: 'rust',
    highlight: [99, 114],
    desc: 'verify_account_proof — 3단계: keccak(address) → MPT 검증 → RLP 디코딩.',
    annotations: [
      { lines: [103, 104], color: 'sky', note: '단계 1: keccak256(address) → 64 nibble 트라이 경로' },
      { lines: [107, 110], color: 'emerald', note: '단계 2: verify_proof() 호출 — MPT 순회 엔진에 위임' },
      { lines: [113, 114], color: 'amber', note: '단계 3: RLP 디코딩 → Account{nonce, balance, storage_root, code_hash}' },
    ],
  },
  'hl-storage-proof': {
    path: 'helios/execution/src/proof.rs',
    code: proofRs,
    lang: 'rust',
    highlight: [117, 133],
    desc: 'verify_storage_proof — 중첩 트라이: storage_root를 루트로 동일 패턴 반복.',
    annotations: [
      { lines: [120, 122], color: 'sky', note: 'keccak256(key) → storage 트라이 경로. state trie와 동일 패턴' },
      { lines: [124, 128], color: 'emerald', note: 'verify_proof — 1단계에서 검증된 storage_root 기준' },
      { lines: [130, 132], color: 'amber', note: 'U256 디코딩 — Account와 달리 단일 값(스토리지 슬롯)' },
    ],
  },

  'hl-verify-proof': {
    path: 'helios/execution/src/proof.rs',
    code: proofRs,
    lang: 'rust',
    highlight: [29, 94],
    desc: 'verify_proof — MPT 순회 핵심 엔진. proof 배열을 순회하면서 root→leaf 해시 체인 검증.',
    annotations: [
      { lines: [34, 38], color: 'sky', note: '초기화: expected_hash=root, path_offset=0, nibble 변환' },
      { lines: [41, 50], color: 'emerald', note: '해시 검증: keccak256(node) == expected_hash 확인. 불일치 = 위조 감지' },
      { lines: [54, 66], color: 'amber', note: 'Branch 처리: 17항목, nibble로 children[0..15] 중 선택, path_offset += 1' },
      { lines: [69, 85], color: 'violet', note: 'Extension: shared nibble 비교 후 건너뜀 / Leaf: remainder 확인 후 값 반환' },
      { lines: [88, 94], color: 'rose', note: 'Leaf 도달 — items[1] 반환 = 찾던 RLP 데이터' },
    ],
  },
};
