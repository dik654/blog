import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const stages = [
  { label: "원문", name: "Raw text", rule: "사용자 입력을 그대로 받음", value: "Ａ각!" },
  { label: "정규화", name: "Normalize", rule: "NFKC로 full-width A를 접음", value: "A각!" },
  { label: "경계", name: "Pre-tokenize", rule: "구두점을 별도 탐색 단위로 분리", value: "[A] [각] [!]" },
  { label: "분할", name: "Vocabulary lookup", rule: "고정 vocabulary에서 ID를 조회", value: "A:10 · 각:20 · !:30" },
  { label: "완성", name: "Post-process", rule: "BOS·EOS special token을 삽입", value: "[1, 10, 20, 30, 2]" },
] as const;

export default function TokenPipelineViz() {
  const controls = useAnimatedScenes(stages.length, 4200, { loop: false });
  const active = stages[controls.active];

  return (
    <VizFrame
      eyebrow="하나의 입력을 끝까지 추적"
      title="‘Ａ각!’이 model input ID [1,10,20,30,2]가 되는 과정"
      description="단계를 넘기면 같은 문자열이 정규화·경계·vocabulary·special-token 계약을 차례로 통과합니다."
      note="ID와 규칙은 계산 경로를 보여 주기 위한 고정 예시입니다. 실제 배포에서는 tokenizer와 checkpoint revision을 함께 고정합니다."
    >
      <div
        id={controls.playbackId}
        data-viz="token-pipeline"
        data-viz-canvas
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="grid gap-px bg-border p-px sm:grid-cols-5">
          {stages.map((stage, index) => {
            const state = index < controls.active ? "완료" : index === controls.active ? "현재" : "대기";
            return (
              <button
                type="button"
                key={stage.name}
                onClick={() => controls.setActive(index)}
                aria-pressed={index === controls.active}
                className={`${index === controls.active ? "block" : "hidden"} min-w-0 bg-background px-3 py-4 text-left sm:block ${index === controls.active ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="font-mono text-[9px]">0{index + 1} · {state}</span>
                <strong className="mt-1 block break-keep text-xs text-foreground">{stage.label}</strong>
                <span className="mt-2 block break-all font-mono text-[10px] leading-4">{stage.value}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 border-y border-border/70 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold text-primary">{String(controls.active + 1).padStart(2, "0")} · {active.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{active.rule}</p>
          </div>
          <output className="min-w-0 break-all border-l-2 border-primary/45 pl-4 font-mono text-base font-bold leading-7 text-foreground">
            {active.value}
          </output>
        </div>

        <AnimatedSceneControls labels={stages.map((stage) => stage.label)} {...controls} playLabel="과정 재생" />
      </div>
    </VizFrame>
  );
}
