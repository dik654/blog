import type { CodeRef } from '@/components/code/types';

export const g2CodeRefs: Record<string, CodeRef> = {
  'g2-struct': {
    path: 'curve/g2.rs — G2 structs + twist parameter',
    lang: 'rust',
    highlight: [1, 30],
    desc: "G2는 Fp2 위의 트위스트 곡선. G1과 동일한 인터페이스, 좌표 타입만 Fp→Fp2.\nb' = 3/xi 로 sextic twist 파라미터 계산.",
    code: `/// G2는 "진짜로는" E(Fp12) 위의 점이지만,
/// sextic twist로 Fp2 위의 점으로 표현 가능
///   → Fp12 산술 대신 Fp2 산술 → 차원 12→2

/// 트위스트 커브 파라미터: b' = b/ξ = 3/(9+u)
fn twist_b() -> Fp2 {
    let b = fp2_const(3);
    let xi = Fp2::new(Fp::from_u64(9), Fp::from_u64(1));
    b * xi.inv().unwrap() // b' = 3 / (9+u)
}

/// Jacobian 좌표 — 좌표 타입이 Fp2
#[derive(Clone, Copy, Debug)]
pub struct G2 {
    pub x: Fp2, // Jacobian X (Fp2 원소)
    pub y: Fp2, // Jacobian Y (Fp2 원소)
    pub z: Fp2, // Jacobian Z (Fp2 원소)
}

/// BN254 표준 G2 생성자 — 256비트 상수
pub fn generator() -> Self {
    let x = Fp2::new(
        Fp::from_raw([0x46debd5cd992f6ed, ...]),
        Fp::from_raw([0x97e485b7aef312c2, ...]),
    );
    let y = Fp2::new(
        Fp::from_raw([0x4ce6cc0166fa7daa, ...]),
        Fp::from_raw([0x55acdadcd122975b, ...]),
    );
    G2 { x, y, z: Fp2::ONE }
}`,
    annotations: [
      { lines: [1, 3], color: 'sky', note: 'sextic twist: E(Fp12)→E(Fp2). 차원 6배 축소 → 연산 ~36배 빠름' },
      { lines: [6, 9], color: 'emerald', note: "ξ=9+u (Fp6의 non-residue). b'=b/ξ 로 twist 파라미터 계산" },
      { lines: [14, 18], color: 'violet', note: 'G1과 동일한 구조, 좌표만 Fp→Fp2. 연산 공식도 동일' },
      { lines: [21, 30], color: 'amber', note: 'G2 생성자는 큰 상수 — go-ethereum, py_ecc 등에서 표준화된 값' },
    ],
  },
  'g2-double': {
    path: 'curve/g2.rs — G2::double() (Fp2 산술)',
    lang: 'rust',
    highlight: [1, 20],
    desc: 'G1과 동일한 공식, 좌표 타입만 Fp→Fp2.\nFp2 곱셈은 Karatsuba로 Fp 곱셈 3회.',
    code: `/// 점 더블링: 2P — G1과 동일한 공식
pub fn double(&self) -> G2 {
    if self.is_identity() || self.y.is_zero() {
        return G2::identity();
    }
    let two = fp2_const(2);
    let three = fp2_const(3);
    let four = fp2_const(4);
    let eight = fp2_const(8);

    let a = self.y.square();         // Fp2 제곱
    let b = four * self.x * a;      // Fp2 곱셈
    let c = eight * a.square();
    let d = three * self.x.square(); // 3X² (a=0)

    let x3 = d.square() - two * b;
    let y3 = d * (b - x3) - c;
    let z3 = two * self.y * self.z;

    G2 { x: x3, y: y3, z: z3 }
}`,
    annotations: [
      { lines: [1, 2], color: 'sky', note: '공식은 G1::double()과 문자 그대로 동일 — 제네릭은 아니지만 구조 복사' },
      { lines: [11, 14], color: 'emerald', note: 'Fp2 곱셈 1회 = Fp 곱셈 3회 (Karatsuba). G1보다 ~3배 느림' },
    ],
  },
};
