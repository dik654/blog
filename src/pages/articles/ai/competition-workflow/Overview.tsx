import TimelineViz from './viz/TimelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">대회 접근 프레임워크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kaggle, Dacon 등 ML 대회에서 상위권에 드는 팀은 <strong>공통된 시간 배분 패턴</strong>을 따른다<br />
          4주 기준: EDA(1일) → 베이스라인(1일) → 실험 반복(2주) → 앙상블/마감(마지막 주)<br />
          핵심 원칙 — 실험 반복에 70%의 시간을 투자하고, 마지막 주에 앙상블로 점수를 끌어올린다
        </p>
        <p>
          초보자가 가장 많이 하는 실수: 첫 주부터 복잡한 모델을 시도하거나, 마감 직전에 급하게 앙상블을 구성하는 것<br />
          체계적인 워크플로우가 있으면 — 시간 낭비를 줄이고, 각 단계에서 최대 효과를 뽑을 수 있다
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed m-0">
            이 아티클은 4주 대회를 기준으로 하지만, 2주 / 3개월 대회에도 비율은 동일하게 적용된다.
            핵심은 <strong>단계별 목표</strong>를 명확히 하고, 각 단계에서 다음 단계로 넘어가는 기준을 미리 정하는 것.
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <TimelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          요약 1: <strong>EDA → 베이스라인 → 실험 → 앙상블</strong> 순서를 깨지 않는다<br />
          요약 2: 실험 반복 단계에서 <strong>한 번에 하나만 변경</strong> — 효과 추적이 생명<br />
          요약 3: CV-LB 상관관계가 확보되지 않으면 모든 실험이 <strong>도박</strong>이 된다
        </p>
      </div>
    </section>
  );
}
