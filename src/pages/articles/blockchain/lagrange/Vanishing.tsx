import VanishingViz from './viz/VanishingViz';

export default function Vanishing() {
  return (
    <section id="vanishing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vanishing Polynomial</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          도메인 모든 점에서 0인 다항식 &mdash; 제약 검증을 한 번의 다항식 나눗셈으로 가능하게 한다.
        </p>
      </div>
      <div className="not-prose"><VanishingViz /></div>
    </section>
  );
}
