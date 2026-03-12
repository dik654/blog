export default function AbelianGroup() {
  return (
    <section id="abelian-group" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Abelian Group, Ring, Field</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">군 (Group)</h3>
        <p>
          군은 집합과 연산이 다음 네 가지 성질을 만족하는 대수 구조입니다.
        </p>
        <ul>
          <li><strong>폐쇄성 (Closure)</strong> — a, b가 군의 원소이면 a*b도 군에 속함</li>
          <li><strong>결합성 (Associativity)</strong> — (a*b)*c = a*(b*c)</li>
          <li><strong>항등원 (Identity)</strong> — a*e = e*a = a를 만족하는 e가 존재</li>
          <li><strong>역원 (Inverse)</strong> — 각 a에 대해 a*a&#x207B;&#x00B9; = e인 a&#x207B;&#x00B9;가 존재</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">아벨군 (Abelian Group)</h3>
        <p>
          군의 네 성질에 더하여 <strong>교환 법칙</strong>을 만족합니다: a*b = b*a (모든 a, b에 대해).
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`아벨군 예시:
  (Z, +)      정수의 덧셈: a + b = b + a
  (Z/nZ, +)   모듈로 n 덧셈

비아벨군 예시:
  GL(n, R)    n×n 가역행렬의 곱셈 (AB ≠ BA)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">환 (Ring)</h3>
        <p>
          두 가지 연산(+, *)을 가진 대수 구조입니다. 덧셈에 대해 아벨군, 곱셈에 대해
          결합성과 항등원을 가지며, 분배법칙이 성립합니다.
          곱셈 역원은 모든 원소에 대해 요구되지 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">체 (Field)</h3>
        <p>
          환의 성질에 더하여 <strong>0을 제외한 모든 원소에 곱셈 역원이 존재</strong>합니다.
          즉, (F, +)는 아벨군이고 (F\{'{0}'}, *)도 아벨군입니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`대수 구조 포함 관계:
  군 ⊂ 아벨군 (교환 법칙 추가)

  환: 덧셈 아벨군 + 곱셈 결합 + 분배법칙
  체: 환 + 곱셈 역원 (0 제외)

ZK에서의 체:
  Z/pZ (p는 소수) → 유한체 Fp
  BN254의 Fr, Fp가 모두 유한체`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">표기법</h3>
        <ul>
          <li><strong>Z/nZ</strong> — 정수 Z에서 n으로 나눈 나머지들의 집합</li>
          <li><strong>A\B</strong> — 집합 A에 속하지만 B에는 속하지 않는 원소들의 집합</li>
          <li><strong>Fp</strong> — 소수 p에 대한 유한체 Z/pZ</li>
        </ul>
      </div>
    </section>
  );
}
