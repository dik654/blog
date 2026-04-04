export const TRAIT_CODE = `// arkworks-rs/poly-commit: 다항식 커밋먼트 통합 라이브러리
// PolynomialCommitment 트레이트 — 모든 스킴의 공통 인터페이스

pub trait PolynomialCommitment<F: PrimeField, P: Polynomial<F>> {
  type UniversalParams;            // 설정 파라미터
  type CommitterKey;               // 커밋 키
  type VerifierKey;                // 검증 키
  type Commitment;                 // 커밋먼트 값
  type Proof;                      // 증명
  type BatchProof;                 // 배치 증명

  fn setup(max_degree: usize, rng: &mut R) -> Result<UniversalParams>;
  fn commit(ck: &CommitterKey, polys: &[P]) -> Result<Vec<Commitment>>;
  fn open(ck: &CommitterKey, polys: &[P], point: F) -> Result<Proof>;
  fn check(vk: &VerifierKey, comms: &[Commitment], point: F,
           values: &[F], proof: &Proof) -> Result<bool>;
}`;

export const TRAIT_ANNOTATIONS = [
  { lines: [4, 10] as [number, number], color: 'sky' as const, note: '5개 연관 타입: 파라미터/키/커밋먼트/증명' },
  { lines: [12, 16] as [number, number], color: 'emerald' as const, note: '4개 핵심 연산: setup/commit/open/check' },
];

export const DIR_CODE = `// poly-commit 디렉토리 구조
poly-commit/src/
├── lib.rs             # PolynomialCommitment 트레이트 정의
├── data_structures.rs # LabeledPolynomial, LabeledCommitment
├── error.rs           # 에러 타입 정의
├── kzg10/             # 원본 KZG10 구현 (페어링 기반)
├── marlin/            # Marlin PC (차수 제한 + 은닉)
├── sonic_pc/          # Sonic PC (AuroraLight 최적화)
├── ipa_pc/            # Inner Product Argument (투명 설정)
├── hyrax/             # Hyrax 다변수 PC
├── linear_codes/      # Ligero/Brakedown (해시 기반)
└── streaming_kzg/     # 스트리밍 KZG 구현

// 설계 철학: 모듈화 + 표준화 + 성능 최적화
// 핵심 의존성: ark-ff, ark-ec, ark-poly, ark-serialize`;

export const DIR_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '공통 인터페이스 + 데이터 구조' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '페어링 기반: KZG10, Marlin, Sonic' },
  { lines: [9, 11] as [number, number], color: 'amber' as const, note: '비페어링: IPA, Hyrax, Linear Codes' },
];
