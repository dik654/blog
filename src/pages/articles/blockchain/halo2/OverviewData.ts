export const CRATE_CODE = `// halo2_proofs/src/
plonk/
  circuit.rs    // Circuit 트레이트, ConstraintSystem, Expression<F>
  keygen.rs     // keygen_vk, keygen_pk — 회로 컴파일 & 키 생성
  prover.rs     // create_proof — 증명 생성 파이프라인
  verifier.rs   // verify_proof
  permutation/  // 복사 제약(copy constraints) — 그랜드 프로덕트
  lookup/       // Plookup 테이블 인수
  vanishing/    // 소멸 다항식 h(X)
poly/
  commitment/   // Params (KZG SRS), commit_lagrange
  multiopen/    // SHPLONK 다중 지점 개구
  domain.rs     // EvaluationDomain (NTT, coset 변환)
transcript.rs   // Fiat-Shamir (Blake2b 기반)`;

export const CIRCUIT_CODE = `// halo2_proofs/src/plonk/circuit.rs

pub trait Circuit<F: Field> {
    type Config: Clone + Debug;
    type FloorPlanner: FloorPlanner;

    fn without_witnesses(&self) -> Self;
    fn configure(meta: &mut ConstraintSystem<F>) -> Self::Config;
    fn synthesize(&self, config: Self::Config, layouter: impl Layouter<F>) -> Result<(), plonk::Error>;
}

// Expression<F>: 저차 다항식 표현 (회로 게이트 정의)
pub enum Expression<F> {
    Constant(F),
    Selector(Selector),           // 선택자 (행 활성화)
    Fixed(FixedQuery),            // 고정 열 (상수 값)
    Advice(AdviceQuery),          // 어드바이스 열 (증인)
    Instance(InstanceQuery),      // 인스턴스 열 (공개 입력)
    Negated(Box<Expression<F>>),
    Sum(Box<Expression<F>>, Box<Expression<F>>),
    Product(Box<Expression<F>>, Box<Expression<F>>),
    Scaled(Box<Expression<F>>, F),
}

// 게이트 등록: 셀 간 다항식 제약
// meta.create_gate("name", |meta| vec![expr1, expr2, ...]);
// 허용 행 제약: meta.enable_selector(selector, row)
// 복사 제약: meta.enable_equality(column) → 퍼뮤테이션 인수`;

export const COLUMN_CODE = `// halo2_proofs/src/plonk/circuit.rs

// 열 3종류
Column<Advice>    // 증인 (비밀 값, 다항식 커밋 + 블라인딩)
Column<Fixed>     // 상수 (keygen 시 확정, 커밋만)
Column<Instance>  // 공개 입력 (검증자도 알고 있음)

// 회로 영역(Region): Layouter로 셀 할당
// layouter.assign_region("name", |mut region| {
//   region.assign_advice(|| "val", col, row, || Value::known(x))?;
//   region.assign_fixed(|| "const", col, row, || Value::known(F::ONE))?;
//   region.constrain_equal(cell_a, cell_b)?;  // 복사 제약
// });

// 선택자(Selector): 특정 행에서만 게이트 활성화
// → keygen 시 selector → fixed 열로 압축 최적화
// → cs.compress_selectors(assembly.selectors)`;
