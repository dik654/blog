import OptimizerViz from './viz/OptimizerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">경사 하강법 & 옵티마이저 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>경사 하강법(Gradient Descent)</strong> — 손실 함수의 최솟값을 찾기 위해
          그래디언트(기울기) 반대 방향으로 파라미터를 이동하는 최적화 알고리즘
        </p>
        <p>
          SGD → Momentum → Adam → AdamW 순서로 발전<br />
          각 옵티마이저는 이전의 한계를 해결하며 등장
        </p>
        <h3>발전 흐름</h3>
        <p>
          SGD — 고정 학습률, 진동·안장점 문제<br />
          Momentum — 관성 추가로 진동 감소<br />
          Adam — 파라미터별 적응적 학습률<br />
          AdamW — weight decay를 Adam과 분리
        </p>
      </div>
      <div className="not-prose mt-8">
        <OptimizerViz />
      </div>
    </section>
  );
}
