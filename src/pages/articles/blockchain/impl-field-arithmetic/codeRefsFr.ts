import type { CodeRef } from '@/components/code/types';

export const frCodeRefs: Record<string, CodeRef> = {
  'fr-struct': {
    path: 'field/fr.rs — Fr scalar field',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'Fr 스칼라 필드.\ndefine_prime_field! 매크로 한 줄로 전체 산술 생성. Fp와 구조 동일, 모듈러스만 다름.',
    code: `// Fr — BN254 스칼라체
// Fp: 좌표 표현 (modulus = p)
// Fr: 스칼라 표현 (modulus = r, 곡선 위수)
// ZK 증명의 witness는 Fr 원소

// 매크로 한 줄로 Fr의 모든 산술이 생성
super::define_prime_field!(
    Fr,
    // r = 2188824287...5808495617
    modulus: [
        0x43e1f593f0000001,
        0x2833e84879b97091,
        0xb85045b68181585d,
        0x30644e72e131a029
    ],
    // R = 2^256 mod r
    r: [
        0xac96341c4ffffffb, 0x36fc76959f60cd29,
        0x666ea36f7879462e, 0x0e0a77c19a07df2f
    ],
    // R^2 mod r
    r2: [
        0x1bb8e645ae216da7, 0x53fe3ab1e35c59e3,
        0x8c49833d53bb8085, 0x0216d0b17f4e44a5
    ]
);`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'Fp vs Fr — 좌표 필드 vs 스칼라 필드. R1CS의 모든 연산은 Fr 위에서 수행' },
      { lines: [6, 8], color: 'emerald', note: '매크로 호출 한 줄 — add, sub, mul, inv, pow 모두 자동 생성' },
      { lines: [10, 14], color: 'amber', note: 'r의 modulus — p와 다른 소수. 곡선 위수에서 유도' },
    ],
  },
  'fr-macro': {
    path: 'field/mod.rs — define_prime_field! 매크로',
    lang: 'rust',
    highlight: [1, 20],
    desc: 'define_prime_field! 매크로.\n상수(MODULUS, R, R2)만 넣으면 완전한 필드 타입 생성.',
    code: `/// 상수만 넣으면 완전한 유한체 타입이 생성되는 매크로
macro_rules! define_prime_field {
    ($name:ident,
     modulus: [$m0:expr, $m1:expr, $m2:expr, $m3:expr],
     r:  [$r0:expr, $r1:expr, $r2:expr, $r3:expr],
     r2: [$r2_0:expr, $r2_1:expr, $r2_2:expr, $r2_3:expr]
    ) => {
        const MODULUS: [u64; 4] = [$m0, $m1, $m2, $m3];
        const R: [u64; 4] = [$r0, $r1, $r2, $r3];
        const R2: [u64; 4] = [$r2_0, $r2_1, $r2_2, $r2_3];
        // INV는 MODULUS[0]에서 Newton법으로 자동 계산
        const INV: u64 = { ... };

        // Fp와 100% 동일한 struct + 메서드 생성
        impl $name {
            pub fn from_raw(...) { ... }
            pub fn mont_mul(...) { ... }
            pub fn add/sub/neg/inv/pow(...)
        }
    };
}`,
    annotations: [
      { lines: [2, 7], color: 'sky', note: '매크로 인자 — modulus, R, R2 세 상수만 제공하면 됨' },
      { lines: [8, 11], color: 'emerald', note: '상수 바인딩 — 매크로 내부에서 const로 고정' },
      { lines: [14, 19], color: 'amber', note: '전체 산술 생성 — Fp 수동 구현과 100% 동일한 코드' },
    ],
  },
};
