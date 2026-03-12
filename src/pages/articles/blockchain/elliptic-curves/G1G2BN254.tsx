export default function G1G2BN254() {
  return (
    <section id="g1-g2-bn254" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G1 + G2 — BN254 타원곡선 군</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">G1 vs G2와 Sextic Twist</h3>
        <p>
          페어링 e(G1, G2) → GT에서 G1은 Fp 위의 점, G2는 Fp2 위의 점, GT는 Fp12의 부분군이다.
          BN254의 embedding degree k=12에서 G2는 원래 E(Fp12) 위의 점이지만,
          sextic twist를 사용하면 E&apos;(Fp2) 위의 점으로 표현할 수 있어
          차원이 12에서 2로 줄어들어 연산 비용이 극적으로 감소한다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 페어링 구조
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
pub struct G2 { pub x: Fp2, pub y: Fp2, pub z: Fp2 }`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">G2 생성자와 연산</h3>
        <p>
          G1 생성자는 (1, 2)로 간단하지만, G2 생성자는 254-bit Fp2 좌표로 EIP-197에서 정의된 표준값이다.
          G1과 G2의 더블링/덧셈 코드는 동일하며, Rust의 연산자 오버로딩 덕분에
          Fp 산술이 Fp2 산술로 자동 치환된다. 이것이 타워 구조의 장점이다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// G2 생성자 (EIP-197 표준)
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
let d = three * self.x.square();`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Affine/Jacobian 변환과 커브 검증</h3>
        <p>
          Jacobian → Affine 변환은 (X, Y, Z) → (X/Z², Y/Z³)로 역원 1회만 필요하다.
          Affine → Jacobian은 Z=1로 두면 무료이다. Jacobian 동치 비교는
          X₁Z₂² == X₂Z₁²와 Y₁Z₂³ == Y₂Z₁³로 to_affine 없이 가능하다.
          커브 위 검증은 Affine에서 y²=x³+b, Jacobian에서 Y²=X³+bZ⁶이다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// Jacobian → Affine: 역원 1회
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
assert_eq!(g2.scalar_mul(&r), G2::identity());`}</code></pre>
      </div>
    </section>
  );
}
