export const C = { blob: '#6366f1', check: '#10b981', kzg: '#f59e0b', hash: '#0ea5e9' };

export const STEPS = [
  {
    label: 'validate_blob_sidecar() 진입',
    body: 'Blob TX 사이드카(blobs+commitments+proofs)를 4단계로 검증합니다.',
  },
  {
    label: '개수 일치 + 한도 확인',
    body: 'blobs/commitments/proofs 개수 일치와 MAX_BLOBS_PER_BLOCK(6) 한도를 확인합니다.',
  },
  {
    label: 'versioned hash 매칭',
    body: 'kzg_to_versioned_hash() 결과가 TX의 blob_versioned_hashes[i]와 일치해야 합니다.',
  },
  {
    label: 'KZG proof 배치 검증',
    body: 'verify_blob_kzg_proof_batch()로 pairing 연산을 공유하여 6개 blob을 효율적 처리합니다.',
  },
];
