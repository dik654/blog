import TrickViz from './viz/TrickViz';

export default function KaratsubaTrick() {
  return (
    <section id="karatsuba-trick" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Karatsuba 트릭: 3회로 줄이기</h2>
      <div className="not-prose mb-8"><TrickViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          핵심 관찰: ad + bc = (a+b)(c+d) - ac - bd.
          <br />
          ac와 bd는 실수부 계산에 이미 필요하므로 <strong>재사용</strong>할 수 있다.
        </p>
        <p>
          곱셈은 3번(ac, bd, (a+b)(c+d))만 수행하고,
          나머지는 덧셈과 뺄셈으로 해결한다.
          <br />
          덧셈이 2회 더 늘어나지만, 곱셈 1회를 절약하는 것이 훨씬 이득이다.
        </p>
      </div>
    </section>
  );
}
