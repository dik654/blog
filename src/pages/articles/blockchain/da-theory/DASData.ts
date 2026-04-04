export const KZG_STEPS = [
  {
    title: 'Blob → 다항식 변환',
    desc: '4096개 필드 원소를 다항식의 계수로 해석한다. 왜 4096? 2^12이라 FFT(고속 푸리에 변환)로 O(n log n)에 다항식 평가가 가능하다. BLS12-381의 스칼라 필드 위에서 동작하며, 각 원소는 32바이트다.',
    codeKey: 'kzg-types',
  },
  {
    title: '다항식 → 커밋먼트 (BlobToCommitment)',
    desc: 'Trusted Setup에서 생성한 SRS(Structured Reference String)를 사용한다. SRS는 비밀값 τ의 거듭제곱을 G1 생성원에 곱한 점들 [τ^0·G, τ^1·G, ..., τ^4095·G]이다. 다항식 계수와 SRS 점들의 선형 결합이 곧 커밋먼트다.',
    codeKey: 'kzg-commit-verify',
  },
  {
    title: '증명 생성 (ComputeBlobProof)',
    desc: '특정 평가점 z에서 "P(z) = v"임을 증명한다. 핵심 아이디어: P(x) - v는 (x - z)로 나누어떨어진다. 이 몫 다항식 Q(x) = (P(x) - v) / (x - z)의 커밋먼트가 증명(π)이다. 나누어떨어지지 않으면 증명 생성이 불가능하다.',
    codeKey: 'kzg-commit-verify',
  },
  {
    title: '검증 (VerifyBlobProof)',
    desc: '검증자는 페어링(bilinear map) 검사로 일관성을 확인한다. e(π, [s-z]₂) = e(C - [v]₁, G₂) 등식이 성립하면 유효하다. 원본 데이터 없이 커밋먼트(48B)와 증명(48B)만으로 O(1) 검증이 가능하다.',
    codeKey: 'kzg-commit-verify',
  },
];

export const PEERDAS_POINTS = [
  '128개 cell로 분할하면 각 cell은 ~1KB다. 라이트 노드가 전체 128KB 대신 몇 개 cell만 요청해도 된다.',
  'cell proof는 해당 cell의 데이터가 원본 blob의 일부임을 KZG로 증명한다.',
  'Osaka부터 BlobSidecarVersion1이 이 구조를 사용한다. VerifyCellProofs로 128개 proof를 배치 검증한다.',
];
