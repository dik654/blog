import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const stages = [
  { label: "현재 작업", input: "결제 migration · payment-17 실패", check: "새 session이 다음 행동을 고르는 데 필요한가?", output: "schema 수정이라는 next action과 미해결 test를 working state에 남김", note: "목표만 남기고 payment-17을 빼면 새 session은 같은 결정을 복원하지 못할 수 있습니다." },
  { label: "장기 기억", input: "사용자는 한국어 설명을 선호함", check: "여러 session에 쓸 가치·보존 동의·expiry가 있는가?", output: "source와 delete path가 있는 preference만 long-term memory에 저장", note: "이번 migration의 실패 상태와 사용자 선호는 보관 수명이 다릅니다. 한 배열에 같은 만료 규칙으로 넣지 않습니다." },
  { label: "원문 보관", input: "backup artifact://bk-42 · 긴 tool log", check: "요약 뒤에도 원문과 backup을 다시 열어야 하는가?", output: "artifact URI·digest·access scope를 checkpoint에서 참조", note: "압축은 원문 참조를 남기지만 forgetting은 복원 대상을 지웁니다. 두 연산을 같은 삭제로 취급하지 않습니다." },
  { label: "다시 시작", input: "필수 key 6개 중 4개가 복원된 새 context", check: "goal·payment-17·backup·next action이 모두 있는가?", output: "4/6이면 계속 실행하지 않고 원문을 열어 state를 보충", note: "Recall이 높아도 다음 행동이 틀릴 수 있습니다. Resume 평가는 실제 행동 성공까지 함께 봅니다." },
];

export default function MemoryTraceViz() {
  const controls = useAnimatedScenes(stages.length, 6200);
  const stage = stages[controls.active];
  return (
    <figure data-viz="memory-trace" className="my-8 border-y border-border py-5 sm:py-6" aria-label="결제 migration 기록의 수명에 따른 저장과 복원 과정">
      <figcaption className="mb-4 break-keep text-base font-semibold">payment-17 실패를 새 session이 복원하는 네 단계 · 가정 사례</figcaption>
      <div
        id={controls.playbackId}
        data-viz-canvas
        data-viz-scene="memory-resume-trace-viz"
        data-story-index={controls.active}
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="flex h-[min(32rem,calc(100svh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto px-1 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-2"
        aria-live="polite"
      >
        <div data-viz-live-only className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">장면 {String(controls.active + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 break-keep text-lg font-bold leading-7">{stage.label}</h3>
          <ol className="mt-4 space-y-2 text-sm leading-6">
            {[["현재 기록", stage.input], ["확인할 조건", stage.check], ["다음 저장·동작", stage.output]].map(([label, value], i) => (
              <li key={label}>
                {i > 0 && <div className="mb-2 pl-4 text-muted-foreground" aria-hidden="true">↓</div>}
                <div className="min-h-16 border-l border-primary/55 pl-4">
                  <span className="block font-semibold">{label}</span>
                  <span className="break-keep text-muted-foreground">{value}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:text-sm">{stage.note}</p>
        </div>
        <AnimatedSceneControls labels={stages.map((item) => item.label)} {...controls} />
        <ol className="static-reading-only mt-4 space-y-4 text-sm leading-6">
          {stages.map((item, index) => (
            <li key={item.label}>
              <strong>{String(index + 1).padStart(2, "0")} · {item.label}</strong>
              <span className="mt-1 block text-muted-foreground">현재 기록: {item.input}</span>
              <span className="block text-muted-foreground">확인할 조건: {item.check}</span>
              <span className="block text-muted-foreground">다음 저장·동작: {item.output}</span>
              <span className="mt-1 block text-muted-foreground">{item.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
