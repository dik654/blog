export const CELL_PROOF_STEPS = [
  {
    title: 'Blob = 128KB = 4096 필드 원소',
    desc: 'BLS12-381 스칼라 필드 원소 1개 = 32바이트. 4096 × 32B = 131,072B(128KB). 이 4096개 원소가 다항식 p(x)의 계수가 된다.',
    codeKey: 'kzg-types',
  },
  {
    title: 'Cell 분할: 128개 × 32 원소 = 1KB/cell',
    desc: '4096 원소를 128등분하면 cell당 32개 원소(1KB)다. 각 cell은 독립적으로 KZG 증명을 가진다. 전체 blob 없이 개별 cell만 검증할 수 있다.',
    codeKey: 'kzg-cell-proofs',
  },
  {
    title: 'Reed-Solomon 확장: 128 → 256 cells',
    desc: '다항식 평가를 2배 지점에서 수행하면 256개 cell로 확장된다. 50%가 손실되어도 임의의 128개 cell로 원본 복구가 가능하다(Lagrange 보간).',
    codeKey: 'kzg-cell-proofs',
  },
  {
    title: 'DAS 샘플링: 75개 cell → 99.6% 복원 확률',
    desc: 'Reed-Solomon 2배 확장에서 50% 이상 사용 가능하면 복원 가능하다. 랜덤 75개 cell을 요청하면, 50% 이하로 사용 가능한 확률은 (0.5)^75 ≈ 10^-23이다.',
    codeKey: 'kzg-cell-proofs',
  },
];

export const VERSION_COMPARE = [
  {
    version: 'V0 (Cancun)',
    desc: 'blob당 1개 증명. 전체 blob 데이터가 있어야 검증 가능하다.',
    proofCount: '1 / blob',
    codeKey: 'blob-validate-legacy',
  },
  {
    version: 'V1 (Osaka)',
    desc: '128개 cell proof. 개별 cell만으로 부분 검증 — DAS가 가능해진다.',
    proofCount: '128 / blob',
    codeKey: 'kzg-cell-proofs',
  },
];
