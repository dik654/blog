export const DORY_STEPS = [
  { label: 'Commitment 개요', body: '데이터를 고정 크기 암호학적 값으로 압축. Binding, Hiding, Homomorphic 특성.' },
  { label: 'CommittableColumn', body: '다양한 SQL 데이터 타입(bool, int, varchar 등)을 스칼라 필드로 변환합니다.' },
  { label: 'HyperKZG 스킴', body: 'KZG 기반 다항식 commitment. BN254 곡선 위에서 pairing 연산을 사용합니다.' },
  { label: 'DORY 스킴', body: '내적 증명(Inner Product Argument) 기반. 투명 셋업으로 신뢰 문제를 완화합니다.' },
];

export const COMMIT_SCHEMES = [
  { name: 'HyperKZG', setup: 'Trusted (SRS)', proof: 'O(1)', verify: 'O(1)', curve: 'BN254' },
  { name: 'DORY', setup: 'Transparent', proof: 'O(log n)', verify: 'O(log n)', curve: 'BN254' },
  { name: 'IPA', setup: 'Transparent', proof: 'O(log n)', verify: 'O(n)', curve: 'Curve25519' },
];

export const COMMIT_CODE = `// CommittableColumn -- SQL 타입 → 스칼라 변환
#[non_exhaustive]
pub enum CommittableColumn<'a> {
  Boolean(&'a [bool]),     // bool → Scalar
  Uint8(&'a [u8]),         // u8 → Scalar
  TinyInt(&'a [i8]),       // i8 → Scalar
  // ... 기타 정수 타입들
  Scalar(Vec<[u64; 4]>),   // Montgomery 형태
  VarChar(Vec<[u64; 4]>),  // 해시 → 스칼라
}
// CommitmentScheme 트레이트
trait CommitmentScheme {
  type Commitment; type Proof;
  fn commit(&self, data: &[Scalar]) -> Self::Commitment;
  fn prove(&self, data: &[Scalar], point: &[Scalar])
    -> Self::Proof;
  fn verify(&self, commitment: &Self::Commitment,
    proof: &Self::Proof) -> bool;
}`;

export const COMMIT_ANNOTATIONS = [
  { lines: [3, 9] as [number, number], color: 'sky' as const, note: 'SQL 타입별 스칼라 변환' },
  { lines: [12, 13] as [number, number], color: 'emerald' as const, note: 'Commitment 스킴 추상화' },
  { lines: [14, 18] as [number, number], color: 'amber' as const, note: 'commit / prove / verify 인터페이스' },
];
