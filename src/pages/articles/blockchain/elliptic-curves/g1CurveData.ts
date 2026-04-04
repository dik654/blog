export const structCode = `// 구조체 정의
pub struct G1Affine { pub x: Fp, pub y: Fp, pub infinity: bool }  // 외부 인터페이스용
pub struct G1 { pub x: Fp, pub y: Fp, pub z: Fp }                // 내부 연산용 Jacobian

// 생성자와 항등원
impl G1 {
    pub fn identity() -> Self { G1 { x: Fp::ZERO, y: Fp::ONE, z: Fp::ZERO } }
    pub fn generator() -> Self { G1 { x: Fp::from_u64(1), y: Fp::from_u64(2), z: Fp::ONE } }
    // 검증: 2² = 4 = 1³ + 3 ✓
}`;

export const doubleCode = `pub fn double(&self) -> G1 {
    if self.is_identity() || self.y.is_zero() { return G1::identity(); }
    let a = self.y.square();
    let b = four * self.x * a;       // 4·X·Y²
    let c = eight * a.square();       // 8·Y⁴
    let d = three * self.x.square();  // 3·X²
    let x3 = d.square() - two * b;
    let y3 = d * (b - x3) - c;
    let z3 = two * self.y * self.z;
    G1 { x: x3, y: y3, z: z3 }
}`;

export const addCode = `pub fn add(&self, rhs: &G1) -> G1 {
    if self.is_identity() { return *rhs; }
    if rhs.is_identity() { return *self; }
    let (z1s, z2s) = (self.z.square(), rhs.z.square());
    let (u1, u2) = (self.x * z2s, rhs.x * z1s);
    let (s1, s2) = (self.y * z2s * rhs.z, rhs.y * z1s * self.z);
    if u1 == u2 {
        if s1 == s2 { return self.double(); }   // P == Q
        else { return G1::identity(); }          // P == -Q
    }
    let (h, r) = (u2 - u1, s2 - s1);
    let (h2, h3) = (h.square(), h * h.square());
    let x3 = r.square() - h3 - Fp::from_u64(2) * u1 * h2;
    let y3 = r * (u1 * h2 - x3) - s1 * h3;
    G1 { x: x3, y: y3, z: h * self.z * rhs.z }
}`;

export const scalarMulCode = `pub fn scalar_mul(&self, scalar: &[u64; 4]) -> G1 {
    let mut result = G1::identity();
    let mut base = *self;
    for &limb in scalar.iter() {
        for j in 0..64 {
            if (limb >> j) & 1 == 1 { result = result.add(&base); }
            base = base.double();
        }
    }
    result
}

// 위수 검증: r·G = O
let r = [0x43e1f593f0000001, 0x2833e84879b97091,
         0xb85045b68181585d, 0x30644e72e131a029];
assert_eq!(g.scalar_mul(&r), G1::identity());
// 분배법칙: 5G = 2G + 3G
assert_eq!(g.scalar_mul(&[5,0,0,0]),
           g.scalar_mul(&[2,0,0,0]).add(&g.scalar_mul(&[3,0,0,0])));`;
