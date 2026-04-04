export const twistCode = `// 페어링 구조
// G1 = Fp 위의 점   → 좌표가 Fp (256-bit 정수 1개)
// G2 = Fp2 위의 점  → 좌표가 Fp2 (256-bit 정수 2개)
// GT = Fp12의 부분군 → 페어링 결과

// 트위스트 커브: Y² = X³ + b', b' = 3/(9+u)
fn twist_b() -> Fp2 {
    let b = Fp2::new(Fp::from_u64(3), Fp::ZERO);
    let xi = Fp2::new(Fp::from_u64(9), Fp::from_u64(1));  // ξ = 9+u
    b * xi.inv().unwrap()
}

// G2 구조체 (Fp2 좌표)
pub struct G2Affine { pub x: Fp2, pub y: Fp2, pub infinity: bool }
pub struct G2 { pub x: Fp2, pub y: Fp2, pub z: Fp2 }`;

export const generatorCode = `// G2 생성자 (EIP-197 표준)
pub fn generator() -> Self {
    let x = Fp2::new(
        Fp::from_raw([0x46debd5cd992f6ed, 0x674322d4f75edadd,
                      0x426a00665e5c4479, 0x1800deef121f1e76]),
        Fp::from_raw([0x97e485b7aef312c2, 0xf1aa493335a9e712,
                      0x7260bfb731fb5d25, 0x198e9393920d483a]),
    );
    let y = Fp2::new(
        Fp::from_raw([0x4ce6cc0166fa7daa, 0xe3d1e7690c43d37b,
                      0x4aab71808dcb408f, 0x12c85ea5db8c6deb]),
        Fp::from_raw([0x55acdadcd122975b, 0xbc4b313370b38ef3,
                      0xec9e99ad690c3395, 0x090689d0585ff075]),
    );
    G2 { x, y, z: Fp2::ONE }
}

// G1/G2 공통 더블링 — 타입만 Fp→Fp2로 교체
let a = self.y.square();        // Fp::square() or Fp2::square()
let b = four * self.x * a;     // 동일한 코드, 다른 타입
let d = three * self.x.square();`;

export const affineCode = `// Jacobian → Affine: 역원 1회
pub fn to_affine(&self) -> G2Affine {
    if self.is_identity() { return G2Affine::identity(); }
    let z_inv = self.z.inv().unwrap();
    let z_inv2 = z_inv.square();
    let z_inv3 = z_inv2 * z_inv;
    G2Affine { x: self.x * z_inv2, y: self.y * z_inv3, infinity: false }
}

// Affine → Jacobian: Z = 1 (무료)
pub fn to_projective(&self) -> G2 {
    if self.infinity { G2::identity() }
    else { G2 { x: self.x, y: self.y, z: Fp2::ONE } }
}

// Jacobian 동치 비교 (to_affine 없이)
impl PartialEq for G2 {
    fn eq(&self, other: &Self) -> bool {
        let (z1s, z2s) = (self.z.square(), other.z.square());
        self.x * z2s == other.x * z1s
            && self.y * z2s * other.z == other.y * z1s * self.z
    }
}

// 위수 검증: G1과 G2 모두 위수 r — 페어링이 작동하는 전제 조건
let r = [0x43e1f593f0000001, 0x2833e84879b97091,
         0xb85045b68181585d, 0x30644e72e131a029];
assert_eq!(g2.scalar_mul(&r), G2::identity());`;
