import BlendingViz from './viz/BlendingViz';

export default function Blending() {
  return (
    <section id="blending" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blending &amp; 다양성 확보</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Blending</strong> — Stacking의 간소화 버전<br />
          전체 데이터를 train(70%) + holdout(30%)로 나누고, holdout 예측으로 메타 모델을 학습<br />
          OOF 루프가 없어 구현이 단순하지만, holdout만큼 학습 데이터가 줄어든다
        </p>
        <p>
          아래 Viz에서 <strong>Stacking vs Blending 차이 → 4단계 워크플로우 → 다양성 4축 → 상관계수 기반 측정</strong>까지 순서대로 확인한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <BlendingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">다양성 4축 요약</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { title: '다른 모델', desc: 'GBM + NN + LR → 알고리즘 자체가 다른 편향을 가짐' },
            { title: '다른 피처', desc: '피처 세트 A + 세트 B → 같은 문제를 다른 관점에서 바라봄' },
            { title: '다른 시드', desc: '같은 모델이라도 초기화/샘플링이 다르면 수렴점이 달라짐' },
            { title: '다른 fold', desc: '5-fold vs 10-fold → 학습에 사용되는 샘플 집합이 달라짐' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-bold text-foreground text-xs">{item.title}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-950/30 border-l-4 border-green-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">다양성 확보 우선순위</p>
        <p className="text-sm">
          <strong>가장 큰 다양성</strong>: 다른 모델 + 다른 피처 (상관 ~0.65)<br />
          <strong>중간 다양성</strong>: 다른 모델 + 같은 피처 (상관 ~0.75)<br />
          <strong>작은 다양성</strong>: 같은 모델 + 다른 시드 (상관 ~0.95)<br />
          실전: GBM 3개 + NN 2개 + LR 1개, 각각 다른 피처 세트 조합 추천
        </p>
      </div>
    </section>
  );
}
