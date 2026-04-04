import CRTConceptViz from './viz/CRTConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">중국인 나머지 정리란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          여러 개의 나머지 조건을 동시에 만족하는 수를 찾는 정리.
          <br />
          서로소인 모듈러 m₁, m₂에 대해 x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)이면,
          x는 mod m₁·m₂에서 유일하게 결정된다.
          <br />
          큰 문제를 작은 모듈러 여러 개로 쪼개서 풀고, 다시 합칠 수 있다는 뜻이다.
        </p>
      </div>
      <div className="not-prose"><CRTConceptViz /></div>
    </section>
  );
}
