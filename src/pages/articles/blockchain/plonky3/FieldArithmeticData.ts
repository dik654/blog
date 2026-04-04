export const BABYBEAR_CODE = `// baby-bear/src/baby_bear.rs
// BabyBear: p = 2^31 - 2^27 + 1 = 2013265921
// 2-adic: p - 1 = 2^27 * 15 → 최대 2^27 크기 FFT 도메인

#[derive(Copy, Clone, Default, Eq, Hash, PartialEq)]
pub struct BabyBear { pub value: u32 }

// 모듈러 곱셈: Monty 형식으로 연산 → 캐리 없는 고속 곱셈
impl Mul for BabyBear {
    fn mul(self, rhs: Self) -> Self {
        let long_prod = self.value as u64 * rhs.value as u64;
        Self { value: monty_reduce(long_prod) }
    }
}`;

export const BABYBEAR_ANNOTATIONS = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'BabyBear 소수: 2-adic 친화적' },
  { lines: [9, 13] as [number, number], color: 'emerald' as const, note: 'Montgomery 곱셈' },
];

export const MERSENNE_CODE = `// mersenne-31/src/mersenne_31.rs
// Mersenne31: p = 2^31 - 1 = 2147483647

#[derive(Copy, Clone, Default)]
pub struct Mersenne31 { pub value: u32 }

// 장점: 비트 연산으로 빠른 리덕션
// 단점: 2-adic 부분군 없음 → Circle FFT 필요
//
// Circle group: 복소수 단위원 위의 점 (x, y), x^2 + y^2 = 1
// Mersenne31에서 i^2 = -1인 복소수 확장으로 circle 정의`;

export const MERSENNE_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'Mersenne 소수' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'Circle FFT 사용 이유' },
];

export const EXTENSION_CODE = `// 확장체: BinomialExtensionField<BabyBear, 4>
// BabyBear 4차 확장: F_{p^4} (128비트 보안)
//
// 확장 원소: a + b*W + c*W^2 + d*W^3
// W는 기저체에서 기약인 4차 다항식의 근
//
// 사용처:
// - alpha (제약 결합 챌린지): EF 원소
// - zeta (개구 지점): EF 원소
// - FRI 쿼리 응답: EF에서 평가`;

export const EXTENSION_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: '4차 확장으로 128비트 보안' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: 'STARK 프로토콜 내 사용처' },
];
