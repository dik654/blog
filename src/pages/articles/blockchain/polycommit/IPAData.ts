export const IPA_CODE = `// IPA PC (Inner Product Argument) — 투명 설정
// 신뢰할 수 있는 설정이 불필요한 이산로그 기반 스킴

// 투명한 설정: 해시로부터 결정론적 generator 생성
fn sample_generators(num_generators: usize) -> Vec<G> {
  let generators: Vec<_> = (0..num_generators)
    .map(|i| {
      let hash = D::digest([Self::PROTOCOL_NAME, &i.to_le_bytes()]);
      G::from_random_bytes(&hash) // Nothing-up-my-sleeve
    }).collect();
  generators
}

// IPA 커밋: C = sum(a_i * G_i) (Pedersen vector commitment)
// 검증: 재귀적 halving으로 O(log n) 라운드
// 각 라운드에서 벡터를 절반으로 줄임 (Bulletproofs와 동일 구조)

// 보안 특성:
// - Transparent Setup: 공개적으로 검증 가능한 설정
// - Discrete Logarithm Problem 기반
// - O(log n) 크기의 증명 (KZG의 O(1)보다 큼)`;

export const IPA_ANNOTATIONS = [
  { lines: [5, 11] as [number, number], color: 'sky' as const, note: '투명 설정: 해시 기반 결정론적 생성원' },
  { lines: [14, 15] as [number, number], color: 'emerald' as const, note: 'Pedersen 벡터 커밋 + 재귀 halving' },
  { lines: [18, 20] as [number, number], color: 'amber' as const, note: '투명 설정, DLog 가정, O(log n) 증명' },
];

export const MARLIN_CODE = `// Marlin PC — KZG10 확장 (차수 제한 + 은닉)
// EUROCRYPT 2020: KZG에 degree bound enforcement 추가

// 차수 제한 강제 메커니즘:
// p(x)의 차수가 d 이하임을 증명하기 위해:
// shifted_commitment = p(x) * x^(max_degree - d) 를 추가 커밋
// → 검증자가 shift 관계를 페어링으로 확인

// Marlin의 추가 커밋먼트:
pub struct Commitment<E: Pairing> {
  comm: kzg10::Commitment<E>,           // 기본 커밋먼트
  shifted_comm: Option<kzg10::Commitment<E>>, // 차수 제한용
}

// 배치 검증 최적화:
// 여러 다항식의 평가를 하나의 검증으로 통합
// randomizer를 사용하여 개별 증명 실패를 숨김
pub fn batch_check<R: RngCore>(
  vk: &VerifierKey<E>, commitments: &[Commitment<E>],
  points: &[E::ScalarField], values: &[E::ScalarField],
  proofs: &[Proof<E>], rng: &mut R,
) -> Result<bool, Error> { ... }`;

export const MARLIN_ANNOTATIONS = [
  { lines: [5, 7] as [number, number], color: 'sky' as const, note: 'shifted_commitment로 차수 제한 강제' },
  { lines: [10, 12] as [number, number], color: 'emerald' as const, note: 'Commitment: 기본 + shifted (옵션)' },
  { lines: [16, 22] as [number, number], color: 'amber' as const, note: '배치 검증: randomizer로 효율 극대화' },
];
