export const prDiffCode = `p = 0x30644e72e131a029 b85045b68181585d 97816a916871ca8d 3c208c16d87cfd47
r = 0x30644e72e131a029 b85045b68181585d 2833e84879b97091 43e1f593f0000001
    ^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^
    상위 2 limb 동일          하위 2 limb이 다름`;

export const frStructCode = `const MODULUS: [u64; 4] = [
    0x43e1f593f0000001,
    0x2833e84879b97091,
    0xb85045b68181585d,
    0x30644e72e131a029,
];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Fr(pub(crate) [u64; 4]);`;

export const macroCode = `macro_rules! define_prime_field {
    ($name:ident,
     modulus: [$m0, $m1, $m2, $m3],
     r:  [$r0, $r1, $r2, $r3],
     r2: [$r20, $r21, $r22, $r23]
    ) => {
        // 구조체, 상수, 메서드, trait impl 전부 생성
    };
}`;

export const macroCallCode = `// fr.rs
define_prime_field!(
    Fr,
    modulus: [0x43e1f593f0000001, 0x2833e84879b97091,
              0xb85045b68181585d, 0x30644e72e131a029],
    r:  [0xac96341c4ffffffb, 0x36fc76959f60cd29,
         0x666ea36f7879462e, 0x0e0a77c19a07df2f],
    r2: [0x1bb8e645ae216da7, 0x53fe3ab1e35c59e3,
         0x8c49833d53bb8085, 0x0216d0b17f4e44a5]
);`;

export const fileStructCode = `field/
├── mod.rs   ← adc/sbb/mac 공용 헬퍼 + define_prime_field! 매크로
├── fp.rs    ← 수동 구현 (학습 참고용)
└── fr.rs    ← 매크로로 생성 (코드 재사용)`;
