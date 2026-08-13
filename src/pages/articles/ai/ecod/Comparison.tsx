import EvaluationBoundaryViz from "./viz/EvaluationBoundaryViz";

const methods = [
  ["ECOD", "feature별 marginal tail", "Global tail anomaly와 빠른 contribution 확인", "feature 조합·local anomaly·중복 signal"],
  ["Isolation Forest", "random split의 isolation depth", "비선형 axis-aligned interaction", "tree 수·subsample·설명 방식"],
  ["LOF", "neighbor 대비 local density", "밀도가 다른 cluster의 local anomaly", "k·distance metric·prediction mode"],
  ["Autoencoder", "representation의 reconstruction residual", "충분한 data에서 복잡한 nonlinear manifold", "정상 data 재구성 가정·학습 안정성"],
] as const;

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">ECOD가 틀리는 모양을 먼저 그리고 detector와 평가를 고른다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ECOD는 적어도 한 feature의 tail에 anomaly가 드러날 때 자연스럽다. 반대로 개별
          marginal에서는 평범하지만 조합만 비정상인 row, 정상 cluster 안의 local sparse point,
          시간 순서가 깨진 사건은 놓칠 수 있다. 원 논문의 case study도 outlier가 모든 차원에서
          정상점 사이에 섞이거나 중앙에 숨은 dataset에서 성능이 떨어졌다고 보고한다.
        </p>
        <p>
          Independence approximation 때문에 correlation이 강한 열이나 같은 값을 다른 단위로 복제한
          열을 함께 넣으면 같은 evidence를 여러 번 더할 수도 있다. Feature contribution은 조사할 열을
          찾는 단서이지 causal attribution이 아니며, 의심되는 interaction은 scatter·conditional rule과
          다른 detector로 확인한다.
        </p>
      </div>

      <figure data-viz="detector-choice" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card">
        <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">Anomaly hypothesis가 바뀌면 읽어야 할 signal도 바뀝니다</p></figcaption>
        <div className="grid gap-px bg-border/60 md:grid-cols-2">
          {methods.map(([name, signal, fit, limit]) => (
            <div key={name} className="min-w-0 bg-background p-5">
              <p className="text-sm font-bold text-primary">{name}</p>
              <dl className="mt-4 grid gap-3 text-xs leading-5">
                <div><dt className="font-bold text-foreground">Signal</dt><dd className="mt-1 text-muted-foreground">{signal}</dd></div>
                <div><dt className="font-bold text-foreground">잘 맞는 가설</dt><dd className="mt-1 text-muted-foreground">{fit}</dd></div>
                <div><dt className="font-bold text-foreground">별도 확인</dt><dd className="mt-1 text-muted-foreground">{limit}</dd></div>
              </dl>
            </div>
          ))}
        </div>
      </figure>

      <EvaluationBoundaryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Label이 있으면 ranking과 action policy를 따로 평가한다</h3>
        <p>
          연속 score는 ROC-AUC와 average precision(PR-AUC 계열)으로 비교하고, threshold를
          정한 뒤 precision·recall·precision@k와 실제 조사 시간을 본다. Anomaly prevalence가
          낮은 데이터에서는 ROC만으로 false alert 부담을 읽기 어려우므로 PR 결과와 base rate를
          함께 기록한다. 같은 split, feature, random seed와 compute budget에서 ECOD·Isolation
          Forest·LOF 같은 서로 다른 가설을 비교해야 한다.
        </p>
        <h3>Label이 없으면 성공을 증명하는 것이 아니라 실패 범위를 좁힌다</h3>
        <p>
          Domain reviewer가 model 이름을 가린 상태에서 상위 row를 평가하고, 기간·지역·사용자군별
          alert rate와 feature contribution을 비교한다. Synthetic anomaly는 특정 실패 모양에 대한
          unit test로는 쓸 수 있지만 실제 anomaly를 대표한다는 보장은 없다. 이후 발생한 incident,
          chargeback, 장비 점검처럼 지연된 label이 생기면 고정된 holdout 기간에서 다시 평가한다.
        </p>
        <h3>운영에서는 drift가 score 의미를 바꾼다</h3>
        <p>
          ECDF는 reference population의 rank이므로 계절 변화·정책 변경·센서 교체가 생기면 정상
          row도 tail로 이동한다. Raw feature distribution, missing rate, tie rate, score quantile,
          alert rate와 reviewer precision을 함께 monitoring하고, 재학습 시에는 이전 model과 같은
          golden rows의 순위 변화를 기록한다.
        </p>
      </div>
    </section>
  );
}
