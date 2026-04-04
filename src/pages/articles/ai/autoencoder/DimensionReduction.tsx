import DimReduceViz from './viz/DimReduceViz';

export default function DimensionReduction() {
  return (
    <section id="dimension-reduction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">차원 축소의 의미</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 잠재 공간이 핵심인가</h3>
        <p>
          Bottleneck이 정보를 강제로 압축한다.<br />
          노이즈(잡음)는 패턴이 없으므로 압축 과정에서 자연스럽게 탈락.<br />
          핵심 구조만 잠재 벡터에 남는다.
        </p>

        <h3>PCA vs 오토인코더</h3>
        <p>
          <strong>PCA(주성분 분석)</strong> — 선형 변환으로 차원 축소. 데이터의 분산이 최대인 방향을 찾음.<br />
          <strong>오토인코더</strong> — 비선형 활성화 함수 덕분에 곡면, 매니폴드(Manifold) 위의 구조도 학습 가능.<br />
          선형 활성화만 쓰면 오토인코더 = PCA와 동일한 결과.
        </p>

        <h3>직관적 이해</h3>
        <p>
          PCA: 종이 위 점들을 직선에 투영 (직선만 가능).<br />
          오토인코더: 점들을 곡선에 투영 (복잡한 곡면도 가능).
        </p>
      </div>
      <div className="not-prose mt-8">
        <DimReduceViz />
      </div>
    </section>
  );
}
