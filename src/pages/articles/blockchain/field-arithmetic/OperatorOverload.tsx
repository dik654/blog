export default function OperatorOverload() {
  return (
    <section id="operator-overload" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">연산자 오버로딩 + Display</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Rust의 연산자 = 트레잇 메서드</h3>
        <p>Rust에서 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">a + b</code>를 쓰면 컴파일러가 트레잇 메서드를 호출한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`a + b  →  <Fp as Add<Fp>>::add(a, b)
a - b  →  <Fp as Sub<Fp>>::sub(a, b)
a * b  →  <Fp as Mul<Fp>>::mul(a, b)
-a     →  <Fp as Neg>::neg(a)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Add 구현</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`impl Add for Fp {
    type Output = Fp;
    fn add(self, rhs: Fp) -> Fp { Fp::add(&self, &rhs) }
}

// 참조 버전: a + &b 지원
impl Add<&Fp> for Fp {
    type Output = Fp;
    fn add(self, rhs: &Fp) -> Fp { Fp::add(&self, rhs) }
}`}</code></pre>
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp</code>는 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">Copy</code>이므로 값으로 받아도 32바이트 복사 비용이 거의 없다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Mul이 mont_mul을 호출하는 이유</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`impl Mul for Fp {
    type Output = Fp;
    fn mul(self, rhs: Fp) -> Fp { self.mont_mul(&rhs) }
    // 유한체 곱셈의 실체는 Montgomery 곱셈
}`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Display: Montgomery form이 아닌 실제 값 출력</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`impl fmt::Display for Fp {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let r = self.to_repr();  // Montgomery → normal 변환
        write!(f, "Fp(0x{:016x}{:016x}{:016x}{:016x})",
            r[3], r[2], r[1], r[0])  // big-endian 순서 출력
    }
}`}</code></pre>
        <p>내부 저장값은 Montgomery form(a * R mod p)이라 그대로 출력하면 의미 없는 숫자가 나온다. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">to_repr()</code>로 변환 후 출력해야 한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">체(Field) 공리 테스트</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// 항등원
assert_eq!(a + Fp::ZERO, a);
assert_eq!(a * Fp::ONE, a);

// 교환법칙
assert_eq!(a + b, b + a);
assert_eq!(a * b, b * a);

// 결합법칙
assert_eq!((a + b) + c, a + (b + c));
assert_eq!((a * b) * c, a * (b * c));

// 분배법칙
assert_eq!(a * (b + c), a * b + a * c);`}</code></pre>
        <p>Montgomery 구현은 상수 하나만 틀려도 모든 곱셈이 조용히 틀린 값을 낸다. 공리 테스트는 구현이 수학적으로 올바른 체인지 한꺼번에 검증하는 통합 테스트 역할을 한다.</p>
      </div>
    </section>
  );
}
