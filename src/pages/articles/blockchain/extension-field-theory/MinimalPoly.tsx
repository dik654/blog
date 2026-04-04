import MinimalPolyStepViz from './viz/MinimalPolyStepViz';

export default function MinimalPoly() {
  return (
    <section id="minimal-poly" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">최소다항식 (Minimal Polynomial)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          확장체를 만들려면 <strong>기약 다항식</strong>이 필요하다.
          <br />
          기약(irreducible) = 해당 체 안에서 더 이상 인수분해할 수 없는 다항식.
          <br />
          기약 다항식의 근을 추가해야만 체가 진짜로 확장된다.
        </p>
      </div>
      <div className="not-prose"><MinimalPolyStepViz /></div>
    </section>
  );
}
