import type { CodeRef } from '@/components/code/types';

export const g1CodeRefs: Record<string, CodeRef> = {
  'g1-struct': {
    path: 'curve/g1.rs — G1Affine + G1 structs',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'Affine (x, y) → 외부 인터페이스. Jacobian (X, Y, Z) → 내부 연산.\nAffine에서 Jacobian으로: Z=1로 설정. 역방향은 inv() 필요.',
    code: `/// Affine 좌표 — 외부 인터페이스용
#[derive(Clone, Copy, Debug)]
pub struct G1Affine {
    pub x: Fp,       // x 좌표
    pub y: Fp,       // y 좌표
    pub infinity: bool, // 무한원점 플래그
}

/// y² = x³ + 3
pub fn is_on_curve(&self) -> bool {
    if self.infinity { return true; }
    let b = Fp::from_u64(3);
    self.y.square() == self.x.square() * self.x + b
}

/// Jacobian 좌표 — 내부 연산용
/// (X, Y, Z) → affine (X/Z², Y/Z³)
#[derive(Clone, Copy, Debug)]
pub struct G1 {
    pub x: Fp, // Jacobian X
    pub y: Fp, // Jacobian Y
    pub z: Fp, // Jacobian Z (0이면 무한원점)
}

/// BN254 G1 생성자: affine (1, 2)
/// 확인: 2² = 4 = 1³ + 3 ✓
pub fn generator() -> Self {
    G1 { x: Fp::from_u64(1), y: Fp::from_u64(2), z: Fp::ONE }
}`,
    annotations: [
      { lines: [3, 7], color: 'sky', note: 'G1Affine — 직관적 좌표. 덧셈마다 inv() 필요해 내부 연산엔 부적합' },
      { lines: [10, 14], color: 'emerald', note: 'BN254: a=0, b=3 → y²=x³+3. a=0이라 더블링 공식이 단순' },
      { lines: [20, 24], color: 'violet', note: 'Jacobian 좌표: Z로 나눗셈을 미뤄 역원 호출 최소화' },
      { lines: [28, 30], color: 'amber', note: '생성자 G=(1,2) — 최소 좌표. 2²=1³+3=4 ✓' },
    ],
  },
  'g1-double': {
    path: 'curve/g1.rs — G1::double()',
    lang: 'rust',
    highlight: [1, 22],
    desc: '접선 기울기 공식을 Jacobian 좌표로 변환.\na=0이므로 +aZ⁴ 항이 사라져 곱셈 1회 절약.',
    code: `/// 점 더블링: 2P (a=0 단순화)
/// A=Y², B=4·X·A, C=8·A², D=3·X²
pub fn double(&self) -> G1 {
    if self.is_identity() || self.y.is_zero() {
        return G1::identity();
    }
    let two = Fp::from_u64(2);
    let three = Fp::from_u64(3);
    let four = Fp::from_u64(4);
    let eight = Fp::from_u64(8);

    let a = self.y.square();         // A = Y²
    let b = four * self.x * a;      // B = 4·X·Y²
    let c = eight * a.square();     // C = 8·Y⁴
    let d = three * self.x.square(); // D = 3·X² (a=0)

    let x3 = d.square() - two * b;  // X₃ = D² - 2B
    let y3 = d * (b - x3) - c;      // Y₃ = D(B-X₃) - C
    let z3 = two * self.y * self.z;  // Z₃ = 2·Y·Z

    G1 { x: x3, y: y3, z: z3 }
}`,
    annotations: [
      { lines: [4, 5], color: 'sky', note: '무한원점이나 Y=0(자기 역원)이면 결과는 무한원점' },
      { lines: [12, 15], color: 'emerald', note: '중간 변수 A,B,C,D — 중복 계산 제거로 곱셈 횟수 최소화' },
      { lines: [17, 19], color: 'amber', note: '역원(inv) 없이 곱셈+덧셈만으로 완료 — Jacobian의 핵심 이점' },
    ],
  },
};
