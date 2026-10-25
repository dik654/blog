import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "인계",
    title: "검색 단계가 질문 경로와 근거 후보를 함께 넘깁니다.",
    note: "앞 글의 출력은 답변이 아니라 추적 가능한 검색 기록입니다. 원 질문, 복원된 질문, 후보 ID와 충분성 판정이 있어야 뒤에서 누락 지점을 다시 확인할 수 있습니다.",
    rows: [
      ["요청", "q-732", "XR-17B 로그인 유지"],
      ["필요한 답", "설정 위치", "보안 영향"],
      ["근거", "d-17", "d-04"],
    ],
    receipt: ["trace: search-8f32", "stop: evidence_sufficient"],
  },
  {
    short: "선택",
    title: "문맥 예산 안에 질문을 직접 뒷받침하는 근거만 남깁니다.",
    note: "전체 4,096토큰에서 시스템·대화 1,024토큰과 출력 예약 1,024토큰을 빼면 근거 예산은 2,048토큰입니다. 이 사례에서는 관련 근거 두 건 1,200토큰만 선택합니다.",
    rows: [
      ["d-17 · 620", "설정 위치", "선택"],
      ["d-04 · 580", "보안 영향", "선택"],
      ["d-22 · d-31", "일반 안내", "제외"],
    ],
    receipt: ["evidence budget: 2,048", "selected: 1,200 tokens"],
  },
  {
    short: "조립",
    title: "출처 경계를 보존한 채 질문 순서에 맞춰 직렬화합니다.",
    note: "조립은 단순 이어 붙이기가 아닙니다. 문서 ID와 구분자를 남기고, 먼저 물은 설정 방법을 앞에, 이어서 보안 영향을 뒤에 둡니다. 위치 정책은 모델과 길이에 맞춰 별도로 검증해야 합니다.",
    rows: [
      ["[d-17]", "설정 › 보안", "유지 기간 변경"],
      ["[d-04]", "공용 기기", "기간 연장 주의"],
      ["prompt", "질문 → 근거", "출처 ID 유지"],
    ],
    receipt: ["context: 1,200 tokens", "sources: d-17, d-04"],
  },
  {
    short: "생성",
    title: "답을 주장 단위로 나누면 근거를 쓴 부분과 지어낸 부분이 갈립니다.",
    note: "첫 두 주장은 d-17·d-04가 각각 지지합니다. ‘다시는 로그인할 필요가 없다’는 세 번째 주장은 선택된 근거 어디에도 없으므로 미지지 주장으로 남깁니다.",
    rows: [
      ["주장 1", "설정에서 기간 변경", "d-17"],
      ["주장 2", "공용 기기는 주의", "d-04"],
      ["주장 3", "다시 로그인 불필요", "근거 없음"],
    ],
    receipt: ["supported claims: 2", "unsupported claims: 1"],
  },
  {
    short: "측정",
    title: "검색 결과와 생성 답변을 서로 다른 지표로 측정합니다.",
    note: "최종 문맥은 관련 근거 2건을 모두 담아 context recall 2/2, context precision 1.0입니다. 답변은 3개 주장 중 2개만 지지돼 faithfulness 2/3입니다. Answer relevance는 이 예에서 측정하지 않습니다.",
    rows: [
      ["Context recall", "2 / 2", "1.00"],
      ["Context precision", "[1, 1]", "1.00"],
      ["Faithfulness", "2 / 3", "0.67"],
    ],
    receipt: ["answer relevance: 미측정", "judge result ≠ 원인 증명"],
  },
  {
    short: "귀속",
    title: "지표 하나가 아니라 단계별 기록으로 첫 실패를 찾습니다.",
    note: "필요 문서는 corpus에 있었고, 후보와 최종 문맥에도 남았습니다. 그다음 답변에서만 미지지 주장이 생겼으므로 첫 실패는 생성 단계입니다. 같은 낮은 점수라도 앞단 기록이 다르면 원인은 달라집니다.",
    rows: [
      ["후보", "d-17 · d-04", "통과"],
      ["최종 문맥", "두 근거 포함", "통과"],
      ["답변 지지", "주장 3 미지지", "첫 실패"],
    ],
    receipt: ["owner: generation", "case: q-732 / claim-3"],
  },
] as const;

function StageRail({ active }: { active: number }) {
  return (
    <ol className="grid grid-cols-3 gap-px bg-border p-px lg:grid-cols-6">
      {SCENES.map((scene, index) => {
        const current = index === active;
        const reached = index <= active;
        return (
          <li
            key={scene.short}
            className={`min-w-0 px-2 py-1 text-center text-[10px] font-bold leading-4 sm:py-2 sm:text-[11px] ${
              current
                ? "bg-primary text-primary-foreground"
                : reached
                  ? "bg-primary/10 text-primary"
                  : "bg-background text-muted-foreground"
            }`}
          >
            <span className="mr-1 font-mono text-[8px] opacity-70">
              {String(index + 1).padStart(2, "0")}
            </span>
            {scene.short}
          </li>
        );
      })}
    </ol>
  );
}

function SceneTable({ active }: { active: number }) {
  return (
    <div className="mt-2 overflow-hidden border border-border sm:mt-3">
      {SCENES[active].rows.map((row) => (
        <div
          key={`${active}-${row[0]}`}
          className="grid min-h-9 grid-cols-[minmax(0,.8fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] items-center gap-px border-b border-border/70 bg-border/70 text-[10px] leading-4 last:border-b-0 sm:text-xs"
        >
          {row.map((cell, cellIndex) => (
            <span
              key={`${row[0]}-${cell}`}
              className={`flex h-full min-w-0 items-center break-words bg-background px-2 py-2 sm:px-3 ${
                cellIndex === 0
                  ? "font-mono font-bold text-foreground"
                  : cell === "첫 실패" || cell === "근거 없음"
                    ? "font-bold text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function RagContextAssemblyAndEvaluationViz() {
  const labels = SCENES.map((scene) => `${scene.short}: ${scene.title}`);
  const notes = SCENES.map((scene) => scene.note);
  const controls = useAnimatedScenes(SCENES.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? SCENES.length - 1 : controls.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="요청 한 건 · 설명용 상태 변화"
      title="q-732의 근거 두 건이 문맥이 되고, 답변의 미지지 주장 하나가 드러납니다"
      description="검색이 끝난 지점부터 근거 선택, 문맥 조립, 주장 검증과 첫 실패 귀속까지 같은 요청 ID를 따라갑니다."
      note="문서 내용과 토큰 수는 흐름을 설명하기 위한 가정입니다. 지표 계산은 화면에 표시한 relevance·claim 판정에만 적용되며 대상 시스템의 실측 결과가 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="rag-context-assembly-evaluation"
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex min-w-0 flex-col border-y border-border/70 bg-background px-4 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 sm:py-3 lg:px-6 lg:py-5"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col">
          <StageRail active={active} />
          <div className="my-auto py-1 sm:py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-1 sm:pb-2">
              <p className="font-mono text-[10px] font-bold text-foreground sm:text-xs">
                tenant-a · q-732 · search-8f32
              </p>
              <p className="text-[10px] font-black text-primary">
                장면 {String(active + 1).padStart(2, "0")}
              </p>
            </div>
            <h3 className="mt-2 min-h-8 break-keep text-sm font-bold leading-5 sm:mt-3 sm:min-h-10 sm:text-lg sm:leading-7">
              {scene.title}
            </h3>
            <SceneTable active={active} />
            <div className="mt-2 grid grid-cols-2 gap-px bg-border p-px sm:mt-3">
              {scene.receipt.map((item) => (
                <p
                  key={item}
                  className="min-w-0 break-words bg-background px-2 py-2 font-mono text-[9px] font-semibold leading-4 text-foreground sm:px-3 sm:text-[11px]"
                >
                  {item}
                </p>
              ))}
            </div>
            <p className="mt-2 min-h-10 border-l border-primary/50 pl-3 text-[11px] leading-5 text-muted-foreground sm:mt-3 sm:pl-4 sm:text-xs lg:text-sm lg:leading-6">
              {scene.note}
            </p>
          </div>
        </div>
        <AnimatedSceneControls
          {...controls}
          active={active}
          labels={labels}
          controlLabels={SCENES.map((sceneItem) => sceneItem.short)}
          className="sm:!min-h-0 sm:!pt-0 sm:[&_[data-viz-desktop-controls]]:hidden sm:[&_[data-viz-mobile-controls]]:flex sm:[&>p]:hidden lg:!pt-3 lg:[&_[data-viz-desktop-controls]]:flex lg:[&_[data-viz-mobile-controls]]:hidden lg:[&>p]:block"
        />
        <StaticSceneList labels={labels} notes={notes} />
      </div>
    </VizFrame>
  );
}
