import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "코퍼스 경계",
  "정답 그래프",
  "후보 선별",
  "Teacher 기록",
  "Student 학습",
  "Slice 평가",
] as const;

const NOTES = [
  "문서 원천과 계보를 먼저 기록하고 benchmark와 겹치는 문서 가족을 학습 풀에서 분리합니다.",
  "질문 하나에 답이 되는 문서가 여러 개라면 1:N edge를 그대로 남겨 유효한 정답을 negative로 만들지 않습니다.",
  "Positive score에서 margin을 뺀 query별 경계로 false negative 가능성이 큰 후보를 제외합니다.",
  "Teacher 전체 vector 대신 고정 candidate에 대한 scalar score를 저장해 label을 재현합니다.",
  "같은 candidate support 위에서 teacher와 student의 순위 분포 차이를 줄입니다.",
  "평균 NDCG와 언어·도메인·길이·근거 위치·positive 수 slice를 함께 남깁니다.",
] as const;

const ARTIFACTS = [
  {
    name: "corpus-manifest.jsonl",
    mark: "[A]",
    rows: [
      ["document", "doc-104"],
      ["source lineage", "policy.example/v3"],
      ["benchmark overlap", "격리"],
      ["next", "정제한 문서 풀"],
    ],
  },
  {
    name: "relevance-graph.parquet",
    mark: "[A]",
    rows: [
      ["query", "q-ko-017"],
      ["positive edges", "doc-104 · doc-219"],
      ["answer position", "뒤쪽 · 중간"],
      ["next", "query + positive set"],
    ],
  },
  {
    name: "mining-snapshot.json",
    mark: "[O]",
    rows: [
      ["known positive", "score 0.86"],
      ["margin", "m = 0.05 (설명용)"],
      ["0.82 candidate", "제외 · 너무 가까움"],
      ["0.76 candidate", "negative 후보"],
    ],
  },
  {
    name: "teacher-scores.parquet",
    mark: "[?]",
    rows: [
      ["candidate support", "positive 1 + negative 15"],
      ["saved value", "후보별 scalar logit"],
      ["teacher identity", "미공개"],
      ["combination rule", "미공개"],
    ],
  },
  {
    name: "student-run.yaml",
    mark: "[M]",
    rows: [
      ["target", "teacher candidate 분포"],
      ["loss", "KL, τ = 0.05"],
      ["teacher forward", "학습 중 없음"],
      ["comparison", "같은 candidate·student"],
    ],
  },
  {
    name: "robustness-report.json",
    mark: "[A]",
    rows: [
      ["overall", "NDCG@10"],
      ["slices", "언어 · 도메인 · 길이"],
      ["position", "앞 · 중간 · 뒤"],
      ["final benchmark", "미공개 [?]"],
    ],
  },
] as const;

export default function PipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = scenes.reducedMotion ? SCENES.length - 1 : scenes.active;
  const artifact = ARTIFACTS[active];

  return (
    <VizFrame
      eyebrow="실무 파이프라인"
      title="여섯 artifact가 한 요청을 잇습니다"
      description="query q-ko-017이 단계마다 어떤 기록으로 바뀌는지 따라갑니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-id="eureka-artifact-pipeline"
        tabIndex={0}
        role="group"
        aria-label="EUREKA 데이터와 증류 artifact 흐름"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary [&_[data-viz-desktop-controls]>button]:!min-w-0 [&_[data-viz-desktop-controls]>button]:!w-auto [&_[data-viz-desktop-controls]>button]:flex-1"
      >
        <div data-viz-live-only className="grid gap-4 lg:min-h-[29rem] lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.78fr)] lg:items-center lg:gap-6">
          <ol className="grid grid-cols-3 gap-px border border-border bg-border sm:hidden" aria-label="여섯 단계 진행 상태">
            {SCENES.map((label, index) => {
              const state = index < active ? "저장됨" : index === active ? "현재" : "대기";
              return (
                <li
                  key={label}
                  aria-current={index === active ? "step" : undefined}
                  className={`min-h-14 bg-background px-2 py-1.5 transition-colors ${
                    index === active ? "border-t-2 border-primary pt-1.5" : "border-t-2 border-transparent pt-1.5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-mono text-[10px] font-black ${index <= active ? "text-primary" : "text-muted-foreground/45"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={`text-[9px] font-bold ${index === active ? "text-primary" : "text-muted-foreground"}`}>
                      {state}
                    </span>
                  </div>
                  <strong className="mt-1 block break-keep text-xs leading-4">{label}</strong>
                </li>
              );
            })}
          </ol>

          <ol className="hidden gap-px border border-border bg-border sm:grid" aria-label="여섯 단계 진행 상태">
            {SCENES.map((label, index) => {
              const state = index < active ? "저장됨" : index === active ? "현재" : "대기";
              return (
                <li
                  key={label}
                  aria-current={index === active ? "step" : undefined}
                  className={`grid min-h-[4.25rem] grid-cols-[3rem_minmax(0,1fr)_3.5rem] items-center gap-3 bg-background px-3 py-2 transition-colors ${
                    index === active ? "border-l-2 border-primary" : "border-l-2 border-transparent"
                  }`}
                >
                  <span className={`font-mono text-xs font-black ${index <= active ? "text-primary" : "text-muted-foreground/45"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <strong className="block break-keep text-sm">{label}</strong>
                  </div>
                  <span className={`text-right text-[10px] font-bold ${index === active ? "text-primary" : "text-muted-foreground"}`}>
                    {state}
                  </span>
                </li>
              );
            })}
          </ol>

          <section className="border-y border-border py-4 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6" aria-label={`${SCENES[active]}에서 저장하는 artifact`}>
            <p className="text-[10px] font-black text-primary">SCENE {String(active + 1).padStart(2, "0")} · {artifact.mark}</p>
            <h4 className="mt-2 break-all font-mono text-sm font-bold">{artifact.name}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{NOTES[active]}</p>
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {artifact.rows.map(([key, value]) => (
                <div key={key} className="grid grid-cols-[6.25rem_minmax(0,1fr)] gap-2 py-2 sm:grid-cols-[7rem_minmax(0,1fr)] sm:py-3">
                  <dt className="text-[11px] font-bold text-muted-foreground">{key}</dt>
                  <dd className="break-words font-mono text-xs leading-5 text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 hidden border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:block">
              다음 단계는 화면에 보이는 artifact만 입력으로 받습니다. 숨은 수동 판단이 생기면 같은 결과를 재현할 수 없습니다.
            </p>
          </section>
        </div>
        <AnimatedSceneControls {...scenes} active={active} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
