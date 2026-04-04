export const ECC_MODULE_CODE = `// halo2-ecc 모듈 계층
bigint/    ← 큰 정수 연산 (CRTInteger, limb 기반)
  ↓
fields/    ← 소수체 연산 (FpChip, Fp2Chip, Fp12Chip)
  ↓
ecc/       ← 타원곡선 점 연산 (EccChip)
  ↓
secp256k1/ | bn254/  ← 특정 곡선 구현

// 핵심 트레이트
pub trait FieldChip<F: BigPrimeField> {
    fn mul_no_carry(&self, ctx, a, b) -> UnsafeFieldPoint;
    fn add_no_carry(&self, ctx, a, b) -> UnsafeFieldPoint;
    fn carry_mod(&self, ctx, a: UnsafeFieldPoint) -> FieldPoint;
    fn divide_unsafe(&self, ctx, a, b) -> FieldPoint;
}`;

export const ECPOINT_CODE = `// halo2-ecc/src/ecc/mod.rs
pub struct EcPoint<F: BigPrimeField, FieldPoint> {
    pub x: FieldPoint,   // x 좌표 (필드 원소)
    pub y: FieldPoint,   // y 좌표 (필드 원소)
}

// x 좌표가 [0, p) 범위로 축약된 점 → 비교 효율적
pub struct StrictEcPoint<F: BigPrimeField, FC: FieldChip<F>> {
    pub x: FC::ReducedFieldPoint,  // 축약된 x 좌표
    pub y: FC::FieldPoint,         // 일반 y 좌표
}

// 비교 가능한 점 (최적화 선택)
pub enum ComparableEcPoint<F, FC: FieldChip<F>> {
    Strict(StrictEcPoint<F, FC>),   // x가 축약된 점
    NonStrict(EcPoint<F, FC::FieldPoint>),  // 일반 점
}

// 무한원점: (0, 0)으로 표현
// 주의: 곡선 위에 (0,0)이 없다는 가정 하에 동작`;
