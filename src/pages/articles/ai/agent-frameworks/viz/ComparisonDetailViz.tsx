import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["기준선", "부족한 책임", "후보 대조", "장애 실험", "채택·롤백"] as const;

const DETAILS = [
  {
    signal: "[M] 아직 미측정",
    title: "Direct SDK로 A-104를 먼저 끝냅니다",
    question: "직접 만든 loop·state DB·작업 키만으로 승인 대기와 장애 재개를 설명할 수 있습니까?",
    result: "가장 작은 동작 기준선을 남깁니다.",
  },
  {
    signal: "[A] 요구사항",
    title: "반복 구현되는 책임만 표시합니다",
    question: "Checkpoint, interrupt, replay, trace 중 실제로 어느 책임이 코드 곳곳에 흩어졌습니까?",
    result: "후보가 가져가야 할 상태를 먼저 확정합니다.",
  },
  {
    signal: "[O] 공식 문서",
    title: "기능 이름이 아니라 의미를 대조합니다",
    question: "각 후보의 persistence가 memory인지 durable state인지, 재개 때 무엇이 다시 실행되는지 확인했습니까?",
    result: "확인한 version과 미확인 칸을 함께 남깁니다.",
  },
  {
    signal: "[M] 격리 실험",
    title: "같은 지점에서 worker를 종료합니다",
    question: "환불 API 성공 직후 종료했을 때 중복 환불 없이 기존 영수증을 찾아 완료할 수 있습니까?",
    result: "복구율·중복 효과·추적 가능성을 짝지어 비교합니다.",
  },
  {
    signal: "[A] 결정",
    title: "이득과 이관 경로를 함께 승인합니다",
    question: "직접 구현보다 복구가 나아졌고, 기존 checkpoint를 읽거나 되돌릴 방법도 검증됐습니까?",
    result: "아니면 기준선을 유지하고 후보를 보류합니다.",
  },
] as const;

function SelectionPath({ active }: { active: number }) {
  return (
    <div role="img" aria-label={`Agent Runtime 선택 장면 ${active + 1}: ${DETAILS[active].title}`}>
      <ol className="grid grid-cols-5 gap-px bg-border p-px" aria-hidden="true">
        {SCENES.map((scene, index) => (
          <li
            key={scene}
            className={`min-w-0 px-1.5 py-2 text-center text-[9px] font-bold leading-4 sm:px-3 sm:text-[11px] ${index === active ? "bg-primary text-primary-foreground" : index < active ? "bg-muted text-foreground" : "bg-background text-muted-foreground"}`}
          >
            <span className="block font-mono text-[8px] opacity-70">{String(index + 1).padStart(2, "0")}</span>
            <span className="break-keep">{scene}</span>
          </li>
        ))}
      </ol>

      <section className="mt-5 min-w-0 border-y border-border py-5">
        <p className="text-[10px] font-black tracking-[0.12em] text-primary">{DETAILS[active].signal}</p>
        <h4 className="mt-2 break-keep text-lg font-black leading-7 sm:text-xl">{DETAILS[active].title}</h4>
        <p className="mt-4 break-keep text-sm leading-6 text-muted-foreground">{DETAILS[active].question}</p>
        <p className="mt-4 border-l-2 border-primary pl-3 break-keep text-sm font-bold leading-6">{DETAILS[active].result}</p>
      </section>
    </div>
  );
}

export default function ComparisonDetailViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  return (
    <VizFrame
      eyebrow="A-104 · 선택 실험"
      title="같은 환불을 끝까지 실행한 뒤 Runtime 후보를 바꿉니다"
      description="제품 이름을 먼저 고르지 않습니다. 기준선에서 부족한 책임을 찾고, 같은 장애를 주입해 복구 결과를 비교합니다."
      note="[O]는 공식 문서로 확인한 기능, [M]은 대상 환경의 측정, [A]는 분석과 결정입니다. 측정 전 결과는 미측정으로 남깁니다."
      canvasClassName="p-3 sm:p-7"
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        data-viz-scene="agent-runtime-selection-viz"
        data-story-index={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="직접 구현 기준선에서 Agent Runtime 채택과 롤백까지 비교하는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-0 min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(35rem,calc(100svh-9rem))] sm:min-h-[30rem]"
      >
        <div data-viz-live-only className="flex flex-1 flex-col justify-center">
          <SelectionPath active={scenes.active} />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} playLabel="선택 과정을 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {DETAILS.map((detail, index) => (
            <li key={detail.title}>
              <strong>{index + 1}. {SCENES[index]} · {detail.title}</strong>
              <span className="mt-1 block text-muted-foreground">{detail.question} {detail.result}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
