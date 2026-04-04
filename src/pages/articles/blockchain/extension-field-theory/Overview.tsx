import ExtOverviewViz from './viz/ExtOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          기존 체에서 해가 없는 다항식의 근을 추가하여 더 큰 체를 구성.
          <br />
          BN254 페어링에서 G2는 Fp2, 결과 GT는 Fp12 위에서 동작.
        </p>
      </div>
      <div className="not-prose"><ExtOverviewViz /></div>
    </section>
  );
}
