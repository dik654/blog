export default function Fp2() {
  return (
    <section id="fp2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp2 이차 확장체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BN254 페어링에서 G2의 좌표는 Fp 안에 존재하지 않는다.
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">x² = -1</code>의 해가 실수에 없어서
          복소수가 필요한 것처럼, Fp를 확장한 <strong>Fp2</strong> 위에서 해를 찾는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">타워 구조</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Fp  →  Fp2  →  Fp6  →  Fp12
 │      │       │        └── 페어링 결과 e(P,Q) ∈ Fp12
 │      │       └────────── Fp12를 효율적으로 구성하는 중간 단계
 │      └────────────────── G2 좌표 (Fp2 = Fp[u] / (u²+1))
 └───────────────────────── G1 좌표 + 모든 확장의 기초`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Karatsuba 곱셈 (4회 → 3회)</h3>
        <p>
          Fp2 곱셈은 복소수 곱셈과 동일한 구조다.{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(a₀+a₁u)(b₀+b₁u) = (a₀b₀−a₁b₁) + (a₀b₁+a₁b₀)u</code>.
          Karatsuba 트릭으로 Fp 곱셈을 4회에서 3회로 줄인다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn mul(&self, rhs: &Fp2) -> Fp2 {
    let v0 = self.c0 * rhs.c0;  // a₀·b₀
    let v1 = self.c1 * rhs.c1;  // a₁·b₁
    // (a₀+a₁)(b₀+b₁) - v₀ - v₁ = a₀b₁ + a₁b₀
    let c1 = (self.c0 + self.c1) * (rhs.c0 + rhs.c1) - v0 - v1;
    let c0 = v0 - v1;  // u² = -1
    Fp2 { c0, c1 }
}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Conjugate, Norm, Inverse</h3>
        <p>
          <strong>Conjugate</strong>: <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a₀+a₁u → a₀−a₁u</code> (복소수 켤레와 동일).{' '}
          <strong>Norm</strong>: <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a·conj(a) = a₀²+a₁² ∈ Fp</code> — 결과가 Fp2가 아니라 <strong>Fp</strong>로 내려간다.
        </p>
        <p>
          <strong>Inverse</strong>: Fp2에서 직접 역원을 구하면{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">p²−2</code>승이 필요하지만,{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a⁻¹ = conj(a) / norm(a)</code>로 쓰면
          Fp의 inv(Fermat p−2승) 1번 + Fp 곱셈 2번으로 끝난다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Frobenius 사상</h3>
        <p>
          BN254에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">u^p = −u</code> (p ≡ 3 mod 4)이므로
          Frobenius(x→x^p)는 conjugate와 동일하다.
          Frobenius를 2번 적용하면 원래 값으로 돌아오는데, Fp2가 Fp의 <strong>2차</strong> 확장이기 때문이다.
        </p>
      </div>
    </section>
  );
}
