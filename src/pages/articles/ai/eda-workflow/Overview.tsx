import { CitationBlock } from "@/components/ui/citation";
import ContentBoundary from "@/components/articles/content-boundary";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        EDA는 그래프를 많이 그리는 단계가 아니라 데이터 가정을 검증하는 단계다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          데이터를 처음 받으면 행 수와 평균부터 보기보다 한 행이 무엇을
          뜻하는지, target이 언제 생성됐는지, 같은 대상이 여러 행에
          반복되는지부터 확인해야 합니다. 이 정의가 틀리면 이후 분포와
          상관관계도 잘못 해석됩니다.
        </p>
        <p>
          EDA는 schema와 품질, target·split, 단변량 분포, 피처 관계, 결측 패턴을
          차례로 확인하고 모델링 가설로 연결합니다. 시각화는 결론이 아니라
          이상값과 구조를 찾기 위한 도구입니다.
        </p>
        <p>
          고정 예제로 배송 1,000건을 살펴보겠습니다. 한 행은 주문 한 건이고
          target은 배송 완료 뒤 계산한 지연 시간이며, 같은 고객의 반복 주문과
          날짜를 보존해 split합니다. 센서 값 100건이 비었다면 전체 결측률은
          10%지만, 특정 장비 200건 중 80건이 비었다면 그 slice의 결측률은
          40%입니다. 전체 평균 하나가 숨기는 구조를 이렇게 단계마다 다시
          모집단과 slice에 연결합니다.
        </p>
      </div>
      <ContentBoundary article="eda-workflow" />
      <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Unit", "한 행·한 ID·한 시점의 의미"],
          ["Quality", "중복·결측·범위·label 오류"],
          ["Boundary", "group·time·source 기반 split"],
          ["Hypothesis", "검증할 관계와 다음 실험"],
        ].map(([title, text]) => (
          <div key={title} className="rounded-xl border bg-card p-4">
            <strong>{title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {text}
            </p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          뒤에서는 분포, 상관관계, 결측 패턴, 가설과 시각화로 이어집니다. 각
          발견에는 데이터 slice와 재현 가능한 집계 코드를 남겨 모델 성능 변화와
          다시 연결할 수 있어야 합니다.
        </p>
      </div>

      <div id="paper-nist-eda" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">근거 읽기 · NIST/SEMATECH EDA handbook</p>
        <CitationBlock source="NIST/SEMATECH e-Handbook — Exploratory Data Analysis" citeKey={1} type="paper" href="https://www.itl.nist.gov/div898/handbook/eda/eda.htm">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Data에 맞는 model을 고르기 전에 structure·outlier·가정과 적합성을 체계적으로 살펴야 합니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Graphical·quantitative technique를 사용해 distribution, model assumptions와 anomaly를 탐색하는 공개 handbook을 제공합니다.</p>
            <p><strong>전제·조건:</strong> Handbook의 통계 model·measurement 맥락이며 각 기법의 sample·independence 가정을 별도로 확인해야 합니다.</p>
            <p><strong>근거 범위:</strong> EDA를 chart collection이 아니라 가정과 data-generating process를 조사하는 단계로 보는 근거입니다.</p>
            <p><strong>비주장:</strong> Handbook의 plot 하나가 causal conclusion, production split 적합성이나 preprocessing 우위를 보장한다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div id="paper-sklearn-pitfalls" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 읽기 · scikit-learn common pitfalls</p>
        <CitationBlock source="scikit-learn — Common pitfalls and recommended practices" citeKey={2} type="paper" href="https://scikit-learn.org/stable/common_pitfalls.html">
          <div className="space-y-2 font-sans text-sm leading-6">
            <p><strong>문제:</strong> Preprocessing을 split 밖에서 fit하거나 train·test에 다르게 적용하면 leakage와 inconsistent transform이 생깁니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Pipeline과 train-only fitting을 사용해 transform 경계를 유지하는 공식 예제를 제공합니다.</p>
            <p><strong>전제·조건:</strong> 확인한 scikit-learn release의 estimator·Pipeline API와 예제 data 조건입니다.</p>
            <p><strong>근거 범위:</strong> Imputer·scaler·feature selection statistic을 training fold에서만 추정하는 경계를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Pipeline 사용만으로 entity·time leakage와 target availability 문제가 자동으로 해결된다는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>
    </section>
  );
}
