import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  {
    short: "복원",
    title: "대화 맥락으로 ‘그거’가 가리키는 대상을 복원합니다.",
    note: "질문을 꾸며 내는 단계가 아닙니다. 같은 대화의 직전 발화에서 XR-17B와 모바일 앱을 확인해 검색할 대상을 명시합니다.",
    rows: [
      ["요청", "q-732", "그거 자꾸 풀려"],
      ["직전 대화", "XR-17B", "모바일 앱"],
      ["복원 결과", "XR-17B 앱", "로그인 유지"],
    ],
    receipt: ["tenant: tenant-a", "context turn: 18"],
  },
  {
    short: "첫 검색",
    title: "복원 전 문장으로는 필요한 두 근거를 찾지 못합니다.",
    note: "‘그거’만으로 검색한 결과 d-22는 일반 로그인 안내입니다. 설정 위치와 보안 영향을 각각 뒷받침할 d-17·d-04는 후보에 없습니다.",
    rows: [
      ["검색어", "그거 자꾸 풀려", "그대로 사용"],
      ["후보", "d-22", "일반 로그인 안내"],
      ["필요 근거", "2건", "찾은 근거 0건"],
    ],
    receipt: ["iteration: 0", "coverage: 0 / 2"],
  },
  {
    short: "진단",
    title: "누락 원인을 보고 변환 방법을 고릅니다.",
    note: "대상이 생략됐으므로 먼저 문장을 다시 쓰고, 설정과 보안이라는 두 요구가 섞였으므로 질문을 둘로 나눕니다. HyDE나 step-back을 모두 실행하지는 않습니다.",
    rows: [
      ["대상 생략", "문장 다시 쓰기", "선택"],
      ["요구 2개", "질문 나누기", "선택"],
      ["의미 표본·원리", "HyDE·step-back", "이번에는 보류"],
    ],
    receipt: ["failure: ambiguity", "failure: two intents"],
  },
  {
    short: "재검색",
    title: "두 하위 질문이 서로 다른 근거를 회수합니다.",
    note: "질문 수가 늘었다고 자동으로 좋아지는 것은 아닙니다. 이 예에서는 설정 질의가 d-17을, 보안 질의가 d-04를 새로 찾아 합집합에 필요한 두 근거가 모두 남습니다.",
    rows: [
      ["q-732a", "세션 만료 설정", "d-17"],
      ["q-732b", "연장 시 보안 영향", "d-04"],
      ["합집합", "d-17 · d-04", "2건"],
    ],
    receipt: ["iteration: 1", "coverage: 2 / 2"],
  },
  {
    short: "종료",
    title: "근거가 충분하거나 반복 한도에 닿으면 루프를 멈춥니다.",
    note: "이 예에서는 두 요구가 모두 근거를 얻어 첫 재검색 뒤 종료합니다. 반복 한도에 닿아 멈췄다면 ‘충분함’이 아니라 ‘더 검색하지 않음’으로 기록해야 합니다.",
    rows: [
      ["설정 위치", "d-17", "지지됨"],
      ["보안 영향", "d-04", "지지됨"],
      ["종료 이유", "evidence_sufficient", "반복 1 / 최대 2"],
    ],
    receipt: ["judge: evidence-v3", "stop: sufficient"],
  },
  {
    short: "기록",
    title: "답뿐 아니라 질문이 바뀐 경로와 종료 이유를 남깁니다.",
    note: "나중에 오답을 조사하려면 원 질문, 복원에 쓴 대화, 변환된 질문, 후보 ID, 판정기 버전, 반복 횟수와 종료 이유가 함께 있어야 합니다.",
    rows: [
      ["질문 경로", "원문 → 복원 → 2개", "보존"],
      ["근거 경로", "d-22 → d-17·d-04", "보존"],
      ["판정 경로", "0/2 → 2/2", "보존"],
    ],
    receipt: ["trace: search-8f32", "output: d-17, d-04"],
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
              key={cell}
              className={`flex h-full min-w-0 items-center break-words bg-background px-2 py-2 sm:px-3 ${
                cellIndex === 0
                  ? "font-mono font-bold text-foreground"
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

export default function QueryTransformationAndAdaptiveRetrievalViz() {
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
      title="q-732는 모호한 한 문장에서 근거 두 건이 확인된 질문으로 바뀝니다"
      description="첫 검색 실패를 확인하고, 원인에 맞는 변환만 골라 재검색한 뒤, 근거가 충분해진 시점에 멈추는 과정을 따라갑니다."
      note="요청·문서 ID와 2회 반복 한도는 동작을 설명하기 위한 가정입니다. 0/2·2/2는 이 예시의 정답 근거를 사후에 아는 상태에서 계산한 값이며 운영 판정기의 실측 정확도가 아닙니다."
      className="my-8"
      canvasClassName="p-0 sm:p-0"
    >
      <div
        id={controls.playbackId}
        data-viz-id="query-transformation-adaptive-retrieval"
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex min-h-full min-w-0 flex-col border-y border-border/70 bg-background px-4 py-1 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 sm:py-3 lg:px-6 lg:py-5"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col">
          <StageRail active={active} />
          <div className="my-auto py-0 sm:py-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-1 sm:pb-2">
              <p className="font-mono text-[10px] font-bold text-foreground sm:text-xs">
                tenant-a · q-732 · “그거 자꾸 풀려”
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
