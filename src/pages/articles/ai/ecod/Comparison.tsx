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
          golden rows의 순위 변화를 기록한다. Candidate reference·package·batch policy를 versioning하고
          같은 rows의 base/candidate 순위와 review budget을 paired 비교한 뒤 canary로 올린다. Reviewer
          precision이나 alert-rate hard limit가 무너지면 이전 ECDF artifact와 threshold로 rollback한다.
        </p>
      </div>

      <div id="paper-unsupervised-outlier-evaluation" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Unsupervised detector 평가</p>
        <p className="mt-2 text-sm font-semibold">On the Evaluation of Unsupervised Outlier Detection</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Campos 등은 benchmark의 outlier definition·class distribution·dataset 변형과 metric 선택이
          unsupervised detector 순위를 크게 바꿀 수 있는 문제를 분석했습니다. 이 연구는 특정
          detector가 항상 우월하다는 결론이 아니라, ground truth와 생성 과정을 확인하고 여러
          dataset·metric에서 비교해야 한다는 평가 경계를 제공합니다. Label이 전혀 없는 production
          population의 성능을 자동으로 인증해 주는 방법으로 읽으면 안 됩니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1007/s10618-015-0444-8" target="_blank" rel="noreferrer">원 논문의 benchmark·metric sensitivity 보기</a>
      </div>
    </section>
  );
}
