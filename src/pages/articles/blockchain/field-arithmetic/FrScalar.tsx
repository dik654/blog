export default function FrScalar() {
  return (
    <section id="fr-scalar" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fr 스칼라체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Fp와 Fr - 왜 체가 두 개 필요한가?</h3>
        <p>BN254 커브에는 소수가 두 개 등장한다.</p>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b"><th className="text-left p-2"></th><th className="text-left p-2">Fp (base field)</th><th className="text-left p-2">Fr (scalar field)</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-2 font-semibold">역할</td><td className="p-2">점의 좌표 범위</td><td className="p-2">스칼라 (점을 몇 번 더할지) 범위</td></tr>
            <tr className="border-b"><td className="p-2 font-semibold">용도</td><td className="p-2">G1 좌표 (x, y)</td><td className="p-2">ZK witness, 회로 변수</td></tr>
          </tbody>
        </table>
        <p className="mt-3">비유하면, 지도의 좌표는 위도/경도(Fp)로 표현하고 &quot;몇 km 이동&quot;은 거리(Fr)로 표현한다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">p와 r의 차이</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`p = 0x30644e72e131a029 b85045b68181585d 97816a916871ca8d 3c208c16d87cfd47
r = 0x30644e72e131a029 b85045b68181585d 2833e84879b97091 43e1f593f0000001
    ^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^
    상위 2 limb 동일          하위 2 limb이 다름`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fr 구조체</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`const MODULUS: [u64; 4] = [
    0x43e1f593f0000001,
    0x2833e84879b97091,
    0xb85045b68181585d,
    0x30644e72e131a029,
];

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Fr(pub(crate) [u64; 4]);`}</code></pre>
        <p>Fp와 구조가 100% 동일하다. 다른 것은 MODULUS 값뿐이다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">define_prime_field! 매크로로 코드 재사용</h3>
        <p>Fr의 add, sub, mont_mul, inv 모두 Fp와 로직이 동일하고 상수만 다르다. Rust의 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">macro_rules!</code>로 코드 템플릿을 만든다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`macro_rules! define_prime_field {
    ($name:ident,
     modulus: [$m0, $m1, $m2, $m3],
     r:  [$r0, $r1, $r2, $r3],
     r2: [$r20, $r21, $r22, $r23]
    ) => {
        // 구조체, 상수, 메서드, trait impl 전부 생성
    };
}`}</code></pre>

        <p>하나의 매크로 호출로 16가지가 생성된다: 상수(MODULUS, R, R2, INV), 구조체, 메서드(from_raw, mont_mul, add, sub, pow, inv 등), 연산자(+, -, *), Display.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Fr 생성: 매크로 한 줄</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`// fr.rs
define_prime_field!(
    Fr,
    modulus: [0x43e1f593f0000001, 0x2833e84879b97091,
              0xb85045b68181585d, 0x30644e72e131a029],
    r:  [0xac96341c4ffffffb, 0x36fc76959f60cd29,
         0x666ea36f7879462e, 0x0e0a77c19a07df2f],
    r2: [0x1bb8e645ae216da7, 0x53fe3ab1e35c59e3,
         0x8c49833d53bb8085, 0x0216d0b17f4e44a5]
);`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">파일 구조</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`field/
├── mod.rs   ← adc/sbb/mac 공용 헬퍼 + define_prime_field! 매크로
├── fp.rs    ← 수동 구현 (학습 참고용)
└── fr.rs    ← 매크로로 생성 (코드 재사용)`}</code></pre>
        <p>상수 3개(MODULUS, R, R2)만 바꾸면 새 유한체를 생성할 수 있다. 나중에 BLS12-381 등 다른 커브를 추가할 때도 같은 매크로를 재사용할 수 있다.</p>
      </div>
    </section>
  );
}
