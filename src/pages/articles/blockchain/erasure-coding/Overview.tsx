import ErasureOverviewViz from './viz/ErasureOverviewViz';

export default function Overview() {
  return (
    <section id="overview">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">
        개요 &mdash; 이레이저 코딩
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          n개 조각 중 임의의 k개만으로 원본 복원 &mdash; 분산 저장, DA, 네트워크 전송의 핵심.
        </p>
      </div>
      <div className="not-prose"><ErasureOverviewViz /></div>
    </section>
  );
}
