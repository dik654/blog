import WhyAlgebraViz from './viz/WhyAlgebraViz';
import GroupRingFieldViz from './viz/GroupRingFieldViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">군 . 환 . 체 정의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          ZKP의 모든 연산은 유한체(finite field) 위에서 수행된다.
          <br />
          왜 대수 구조가 필요하고, 군-환-체가 무엇인지.
        </p>
      </div>
      <div className="not-prose mb-8"><WhyAlgebraViz /></div>
      <div className="not-prose"><GroupRingFieldViz /></div>
    </section>
  );
}
