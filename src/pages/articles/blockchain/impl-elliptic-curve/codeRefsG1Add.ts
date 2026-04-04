import type { CodeRef } from '@/components/code/types';

export const g1AddCodeRefs: Record<string, CodeRef> = {
  'g1-add': {
    path: 'curve/g1.rs — G1::add()',
    lang: 'rust',
    highlight: [1, 30],
    desc: '두 점의 덧셈. P==Q면 double, P==-Q면 무한원점.\nJacobian 좌표라 Z 보정이 필요 — U,S 계산으로 해결.',
    code: `/// 점 덧셈: P + Q (Jacobian)
pub fn add(&self, rhs: &G1) -> G1 {
    if self.is_identity() { return *rhs; }
    if rhs.is_identity() { return *self; }

    let z1s = self.z.square();      // Z₁²
    let z2s = rhs.z.square();       // Z₂²
    let u1 = self.x * z2s;          // U₁ = X₁·Z₂²
    let u2 = rhs.x * z1s;           // U₂ = X₂·Z₁²
    let s1 = self.y * z2s * rhs.z;  // S₁ = Y₁·Z₂³
    let s2 = rhs.y * z1s * self.z;  // S₂ = Y₂·Z₁³

    if u1 == u2 {
        if s1 == s2 { return self.double(); } // P == Q
        else { return G1::identity(); }        // P == -Q
    }

    let h = u2 - u1;        // H = U₂ - U₁
    let r = s2 - s1;        // R = S₂ - S₁
    let h2 = h.square();    // H²
    let h3 = h * h2;        // H³
    let u1h2 = u1 * h2;     // U₁·H²

    let x3 = r.square() - h3 - Fp::from_u64(2) * u1h2;
    let y3 = r * (u1h2 - x3) - s1 * h3;
    let z3 = h * self.z * rhs.z;

    G1 { x: x3, y: y3, z: z3 }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: '무한원점(항등원) 처리 — P+O=P, O+Q=Q' },
      { lines: [6, 11], color: 'emerald', note: 'Z 보정: affine x₁=X₁/Z₁² 비교를 X₁·Z₂²==X₂·Z₁² 로 변환 (역원 회피)' },
      { lines: [13, 15], color: 'amber', note: '같은 점이면 double, 역원이면 무한원점 — 특수 케이스 분기' },
      { lines: [23, 25], color: 'violet', note: '최종 좌표 — 역원 없이 곱셈 16회, 제곱 4회로 완료' },
    ],
  },
  'g1-scalar-mul': {
    path: 'curve/g1.rs — G1::scalar_mul() + to_affine()',
    lang: 'rust',
    highlight: [1, 26],
    desc: 'double-and-add: 256비트 스칼라를 비트 순회.\n최종 출력 시에만 to_affine 호출 → inv() 딱 1번.',
    code: `/// 스칼라 곱: k·P (double-and-add)
pub fn scalar_mul(&self, scalar: &[u64; 4]) -> G1 {
    let mut result = G1::identity(); // 누적기 = O
    let mut base = *self;            // 현재 2^i·P
    for &limb in scalar.iter() {     // 4개 limb 순회
        for j in 0..64 {             // limb당 64비트
            if (limb >> j) & 1 == 1 {
                result = result.add(&base); // 비트=1이면 누적
            }
            base = base.double();    // 매번 2배
        }
    }
    result
}

/// Jacobian → Affine: (X,Y,Z) → (X/Z², Y/Z³)
/// 역원 호출은 이 순간에만 1번
pub fn to_affine(&self) -> G1Affine {
    if self.is_identity() {
        return G1Affine::identity();
    }
    let z_inv = self.z.inv().unwrap();  // 역원 1번
    let z_inv2 = z_inv.square();        // z⁻²
    let z_inv3 = z_inv2 * z_inv;        // z⁻³
    G1Affine { x: self.x * z_inv2, y: self.y * z_inv3, infinity: false }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'result=O(항등원), base=P에서 시작. LSB부터 스캔' },
      { lines: [7, 8], color: 'emerald', note: '비트가 1인 위치에서만 add — 평균 128회 add + 256회 double' },
      { lines: [22, 25], color: 'amber', note: '전체 연산 중 유일한 inv() 호출 — Jacobian 사용 이유' },
    ],
  },
};
