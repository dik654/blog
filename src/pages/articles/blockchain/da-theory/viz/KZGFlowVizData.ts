export const STEPS = [
  {
    label: 'BlobToCommitment(blob) → Commitment',
    body: 'blob = [131072]byte = 4096 필드 원소 x 32B.\nSRS 포인트와 선형 결합: C = Sigma ai * [tau^i]_1.\n결과는 BLS12-381 G1 점 (48바이트).',
  },
  {
    label: 'ComputeBlobProof(blob, commitment) → Proof',
    body: '평가점 z에서 v = p(z)를 계산한다.\n몫 다항식 Q(x) = (p(x) - p(z)) / (x - z).\n증명 pi = [Q(tau)]_1 (48바이트 G1 점).',
  },
  {
    label: 'VerifyBlobProof(blob, commitment, proof) → bool',
    body: '페어링 등식 e(pi, [s-z]_2) = e(C-[v]_1, G2)를 확인한다.\n원본 128KB 없이 48B+48B만으로 O(1) 검증.',
  },
  {
    label: '전체 호출 체인: Go/C 백엔드 분기',
    body: 'useCKZG 플래그에 따라 Go(gnark-crypto) 또는 C(c-kzg-4844) 백엔드를 선택한다.\ncrypto/kzg4844/kzg4844.go에서 분기.',
  },
];

/** BlobToCommitment 입출력 */
export const COMMIT_IO = {
  input: { name: 'Blob', type: '[131072]byte', detail: '4096 x 32B 필드 원소' },
  process: 'C = Sigma ai * [tau^i]_1',
  output: { name: 'Commitment', type: '[48]byte', detail: 'G1 점 압축' },
};

/** ComputeBlobProof 입출력 */
export const PROOF_IO = {
  inputs: [
    { name: 'Blob', type: '[131072]byte' },
    { name: 'Commitment', type: '[48]byte' },
  ],
  process: 'Q(x) = (p(x) - p(z)) / (x - z)',
  output: { name: 'Proof', type: '[48]byte', detail: 'G1 점 압축' },
};

/** VerifyBlobProof 입출력 */
export const VERIFY_IO = {
  inputs: [
    { name: 'Blob', type: '[131072]byte' },
    { name: 'Commitment', type: '[48]byte' },
    { name: 'Proof', type: '[48]byte' },
  ],
  pairing: 'e(pi, [s-z]_2) = e(C-[v]_1, G2)',
  output: { name: 'bool', detail: 'true / false' },
};
