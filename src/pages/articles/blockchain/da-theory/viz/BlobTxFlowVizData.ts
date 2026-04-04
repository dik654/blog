export const STEPS = [
  {
    label: 'BlobTx 구조체: EIP-4844 트랜잭션 타입',
    body: 'BlobTx는 DynamicFeeTx 기반에 BlobFeeCap, BlobHashes, Sidecar 필드를 추가한 타입이다.',
  },
  {
    label: 'BlobTxSidecar: blob 데이터 + 증명 묶음',
    body: 'Sidecar는 Blobs([131072]byte), Commitments([48]byte), Proofs([48]byte) 배열을 가진다.\nrlp:"-" 태그로 블록 직렬화에서 제외된다.',
  },
  {
    label: 'validateBlobTx(): 단계적 검증',
    body: '비용 낮은 검사 → 비용 높은 검사 순서.\n① sidecar nil 확인 ② version 확인 ③ blob 개수 ≤ 6 ④ hash 일치 ⑤ KZG 증명.',
  },
  {
    label: 'BlobHashes(): 커밋먼트 → versioned hash',
    body: 'SHA256(commitment)의 첫 바이트를 0x01(version)로 교체한다.\n결과는 [32]byte versioned hash로, 블록 헤더에 기록된다.',
  },
];

/** BlobTx 필드 목록 */
export const BLOBTX_FIELDS = [
  { name: 'ChainID', type: '*uint256', color: '#94a3b8' },
  { name: 'Nonce', type: 'uint64', color: '#94a3b8' },
  { name: 'GasFeeCap', type: '*uint256', color: '#94a3b8' },
  { name: 'BlobFeeCap', type: '*uint256', color: '#f59e0b' },
  { name: 'BlobHashes', type: '[]common.Hash', color: '#6366f1' },
  { name: 'Sidecar', type: '*BlobTxSidecar', color: '#10b981' },
];

/** Sidecar 필드 목록 */
export const SIDECAR_FIELDS = [
  { name: 'Blobs', type: '[][131072]byte', size: '~128KB', color: '#6366f1' },
  { name: 'Commitments', type: '[][48]byte', size: '48B', color: '#10b981' },
  { name: 'Proofs', type: '[][48]byte', size: '48B', color: '#f59e0b' },
];

/** validateBlobTx 검증 단계 */
export const VALIDATE_STEPS = [
  { label: 'sidecar != nil', pass: true, color: '#10b981' },
  { label: 'version match', pass: true, color: '#10b981' },
  { label: 'blobCount ≤ 6', pass: true, color: '#10b981' },
  { label: 'hash == SHA256(commit)', pass: true, color: '#6366f1' },
  { label: 'KZG proof valid', pass: true, color: '#f59e0b' },
];
