import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  { label: "실행 접수", owner: "Gateway", input: "sessionKey · message", output: "runId · acceptedAt", body: "요청을 검증하고 session metadata를 남긴 뒤 runId를 즉시 반환합니다." },
  { label: "Model 해석", owner: "Agent command", input: "agent config · auth", output: "provider/model", body: "Provider는 인증·catalog·transport를, model은 이번 turn의 추론 대상을 뜻합니다." },
  { label: "Runtime 선택", owner: "Runtime policy", input: "provider/model · policy", output: "runtime harness", body: "Model 또는 provider 범위의 정책과 등록된 harness를 보고 실제 loop 구현을 고릅니다." },
  { label: "Loop 실행", owner: "Selected runtime", input: "prompt · skills · tools", output: "assistant/tool events", body: "Runtime이 모델 출력과 native tool call을 진행합니다. Channel delivery 소유권은 가져가지 않습니다." },
  { label: "완료 확인", owner: "Gateway wait", input: "same runId", output: "ok · error · timeout", body: "agent.wait는 같은 runId의 최종 결과를 기다립니다. 대기 timeout은 실행 취소가 아닙니다." },
] as const;

export default function OpenClawRuntimeViz() {
  const scenes = useAnimatedScenes(STAGES.length, 5000, { loop: false });
  return (
    <VizFrame
      eyebrow="접수 시계 · 실행 시계"
      title="runId는 즉시 생기지만 완료 증거는 나중에 생깁니다"
      description="Provider, model, runtime을 한 이름으로 묶지 않고, 접수와 실행 완료도 서로 다른 시점으로 봅니다."
      note="agent.wait가 timeout을 반환하면 같은 runId로 다시 기다릴 수 있습니다. Runtime 실행 예산 초과나 명시적 취소와는 다른 상태입니다."
      canvasClassName="p-2 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="openclaw-runtime" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="OpenClaw 실행 접수와 runtime 완료 단계" onKeyDown={scenes.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div data-viz-live-only>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {STAGES.map((stage, index) => (
              <button key={stage.label} type="button" onClick={() => scenes.setActive(index)} aria-pressed={scenes.active === index} className={`min-w-0 border px-1 py-2 text-center sm:px-3 sm:py-4 ${scenes.active === index ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/35 bg-muted/45" : "border-border bg-background"}`}>
                <span className="font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 block break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{stage.label}</span>
              </button>
            ))}
          </div>
          <section className="mt-3 grid gap-3 border border-primary/50 bg-primary/5 p-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:p-5">
            <div>
              <p className="text-[10px] font-black text-primary">{STAGES[scenes.active].owner}</p>
              <h4 className="mt-2 text-base font-bold">{STAGES[scenes.active].label}</h4>
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-7">{STAGES[scenes.active].body}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-[10px] leading-5">
                <div><dt className="font-bold text-muted-foreground">입력</dt><dd className="break-words font-mono">{STAGES[scenes.active].input}</dd></div>
                <div><dt className="font-bold text-muted-foreground">출력</dt><dd className="break-words font-mono">{STAGES[scenes.active].output}</dd></div>
              </dl>
            </div>
          </section>
        </div>
        <AnimatedSceneControls {...scenes} labels={STAGES.map((stage) => stage.label)} playLabel="실행 경로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {STAGES.map((stage, index) => <li key={stage.label}><strong>{index + 1}. {stage.label} · {stage.owner}</strong><span className="mt-1 block text-muted-foreground">{stage.body} 입력: {stage.input}. 출력: {stage.output}.</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
