export default function G1Curve() {
  return (
    <section id="g1-curve" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">G1 — BN254 위의 타원곡선군</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">타원곡선과 Jacobian 좌표</h3>
        <p>
          유한체 Fp 위에서 y² = x³ + ax + b를 만족하는 점의 집합과 무한원점 O가 타원곡선군을 이룬다.
          BN254에서는 a = 0, b = 3이므로 y² = x³ + 3이다.
          타원곡선 위의 점들은 덧셈에 대해 군을 이루며, 스칼라 곱 k·P는 쉽지만
          P와 Q = k·P로부터 k를 구하는 것은 어렵다 (ECDLP).
        </p>
        <p>
          Affine 좌표 (x, y)에서는 점 덧셈마다 역원(Fp::inv)이 필요하여 비용이 크다.
          Jacobian 좌표 (X, Y, Z)는 affine (x, y) = (X/Z², Y/Z³)로 대응되며,
          역원 없이 mul/add만으로 연산이 가능하다. 최종 결과가 필요할 때만 to_affine으로 역원 1번 호출한다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 구조체 정의
pub struct G1Affine { pub x: Fp, pub y: Fp, pub infinity: bool }  // 외부 인터페이스용
pub struct G1 { pub x: Fp, pub y: Fp, pub z: Fp }                // 내부 연산용 Jacobian

// 생성자와 항등원
impl G1 {
    pub fn identity() -> Self { G1 { x: Fp::ZERO, y: Fp::ONE, z: Fp::ZERO } }
    pub fn generator() -> Self { G1 { x: Fp::from_u64(1), y: Fp::from_u64(2), z: Fp::ONE } }
    // 검증: 2² = 4 = 1³ + 3 ✓
}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">점 더블링과 점 덧셈</h3>
        <p>
          더블링(2P)은 곡선 위의 점 P에서 접선을 그어 곡선과 만나는 점을 x축 대칭시킨다.
          a=0 특화 공식으로 A=Y², B=4XA, C=8A², D=3X²를 구한 뒤
          X₃=D²-2B, Y₃=D(B-X₃)-C, Z₃=2YZ로 계산한다. 역원 호출 0회.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn double(&self) -> G1 {
    if self.is_identity() || self.y.is_zero() { return G1::identity(); }
    let a = self.y.square();
    let b = four * self.x * a;       // 4·X·Y²
    let c = eight * a.square();       // 8·Y⁴
    let d = three * self.x.square();  // 3·X²
    let x3 = d.square() - two * b;
    let y3 = d * (b - x3) - c;
    let z3 = two * self.y * self.z;
    G1 { x: x3, y: y3, z: z3 }
}`}</code></pre>
        <p>
          덧셈(P+Q)은 두 점을 잇는 직선이 곡선과 만나는 세 번째 점을 x축 대칭시킨다.
          U₁=X₁Z₂², U₂=X₂Z₁², S₁=Y₁Z₂³, S₂=Y₂Z₁³, H=U₂-U₁, R=S₂-S₁로 계산하며,
          U₁==U₂일 때 S₁==S₂이면 double, 아니면 역원(-Q)이므로 identity를 반환한다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn add(&self, rhs: &G1) -> G1 {
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
}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">스칼라 곱과 위수 검증</h3>
        <p>
          스칼라 곱 k·P는 double-and-add 알고리즘으로 구현한다.
          254-bit 스칼라에 대해 최대 254 doublings + 254 additions이 필요하다.
          r·G = O (항등원)를 검증하여 G1의 위수가 r임을 확인할 수 있다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn scalar_mul(&self, scalar: &[u64; 4]) -> G1 {
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
           g.scalar_mul(&[2,0,0,0]).add(&g.scalar_mul(&[3,0,0,0])));`}</code></pre>
      </div>
    </section>
  );
}
