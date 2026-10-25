import VizFrame from "@/components/viz/VizFrame";

const METRICS = [
  {
    name: "Faithfulness",
    source: "RAGAS 2023",
    input: "답변 + 문맥",
    question: "답변의 각 주장을 문맥이 지지하는가?",
    caseValue: "2 / 3 = 0.67",
  },
  {
    name: "Answer relevance",
    source: "RAGAS 2023",
    input: "질문 + 답변",
    question: "답변이 원래 질문을 직접 다루는가?",
    caseValue: "이번 사례 미측정",
  },
  {
    name: "Context precision",
    source: "Ragas v0.4.3 문서",
    input: "순위가 있는 문맥",
    question: "관련 근거가 앞쪽에 배치됐는가?",
    caseValue: "[1, 1] → 1.00",
  },
  {
    name: "Context recall",
    source: "Ragas v0.4.3 문서",
    input: "참조 답 + 문맥",
    question: "참조 답에 필요한 주장을 모두 찾았는가?",
    caseValue: "2 / 2 = 1.00",
  },
] as const;

export function RagMetricsMapViz() {
  return (
    <VizFrame
      eyebrow="평가 입력 지도"
      title="네 지표는 같은 답을 보지만 서로 다른 질문에 답합니다"
      description="원 논문이 제안한 reference-free 지표와 후속 라이브러리 문서의 문맥 지표를 출처와 입력 기준으로 분리합니다."
      note="RAGAS 2023의 Table 1은 faithfulness·answer relevance·context relevance를 보고합니다. Context precision·recall은 현재 Ragas 라이브러리 문서의 별도 지표이며 context recall은 reference가 필요합니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div data-viz-canvas className="border-y border-border/70">
        <div className="hidden grid-cols-[1.05fr_.9fr_1.55fr_1fr] gap-px bg-border text-[10px] font-bold text-muted-foreground sm:grid">
          {['지표', '근거', '묻는 질문', 'q-732 결과'].map((label) => (
            <span key={label} className="bg-background px-3 py-2">
              {label}
            </span>
          ))}
        </div>
        {METRICS.map((metric) => (
          <div
            key={metric.name}
            className="grid gap-px border-b border-border/70 bg-border last:border-b-0 sm:grid-cols-[1.05fr_.9fr_1.55fr_1fr]"
          >
            {[
              ["지표", metric.name],
              ["입력", `${metric.source}\n${metric.input}`],
              ["질문", metric.question],
              ["결과", metric.caseValue],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`min-w-0 whitespace-pre-line bg-background px-3 py-3 text-xs leading-5 ${
                  index === 0 || index === 3
                    ? "font-bold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span className="mr-2 text-[9px] font-bold text-muted-foreground sm:hidden">
                  {label}
                </span>
                <span className="break-keep">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}

const EXPERIMENTS = [
  {
    paper: "Lewis et al. · Natural Questions",
    baseline: "검색 끔 · EM 36.6",
    changed: "RAG-Sequence · EM 44.5",
    gap: "+7.9%p",
    meaning: "검색을 붙였을 때 이 실험에서 생긴 차이",
  },
  {
    paper: "CRUX · DUC",
    baseline: "DR+RankFirst · Cov(y) 44.6",
    changed: "Oracle retrieval · Cov(y) 64.6",
    gap: "+20.0%p",
    meaning: "이 검색·재정렬 방법과 oracle 사이의 여유",
  },
] as const;

export function RagExperimentBoundsViz() {
  return (
    <VizFrame
      eyebrow="실험 두 종류"
      title="검색을 빼는 실험과 완벽한 검색을 넣는 실험은 서로 다른 경계를 잽니다"
      description="Ablation은 현재 RAG가 더한 값을, oracle 비교는 검색기가 아직 회복하지 못한 여유를 보여 줍니다."
      note="두 행은 데이터셋과 지표가 다르므로 서로 직접 비교할 수 없습니다. 모두 논문 저자가 보고한 결과이며 이 블로그 환경에서 다시 측정한 값이 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div data-viz-canvas className="border-y border-border/70 px-4 py-4 sm:px-6 sm:py-6">
        {EXPERIMENTS.map((experiment, index) => (
          <section
            key={experiment.paper}
            className="border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold">{experiment.paper}</h3>
              <span className="font-mono text-sm font-black text-primary">
                {experiment.gap}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-2 text-center text-xs leading-5">
              <div className="min-w-0 border border-border px-3 py-3 font-semibold">
                {experiment.baseline}
              </div>
              <span aria-hidden className="text-primary">
                →
              </span>
              <div className="min-w-0 border border-primary/45 px-3 py-3 font-semibold">
                {experiment.changed}
              </div>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {index === 0 ? "Ablation: " : "Oracle 비교: "}
              {experiment.meaning}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
