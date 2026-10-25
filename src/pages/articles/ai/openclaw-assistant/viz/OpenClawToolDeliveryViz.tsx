import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  { label: "Tool 제안", owner: "Model/runtime", question: "무엇을 해 달라고 요청했나?", result: "exec · arguments", note: "Model이 tool call을 만들었어도 실제 효과는 아직 일어나지 않았습니다." },
  { label: "허용 판정", owner: "Tool policy", question: "이 tool을 호출해도 되는가?", result: "allow 또는 deny", note: "deny가 이기며 sandbox나 elevated가 금지된 tool을 다시 허용하지 않습니다." },
  { label: "실행 위치", owner: "Sandbox policy", question: "허용된 tool을 어디서 실행할까?", result: "sandbox 또는 host/node", note: "Sandbox는 tool 실행 위치를 바꿉니다. Gateway 프로세스 자체는 host에 남습니다." },
  { label: "효과 증거", owner: "Tool executor", question: "실제로 무엇이 바뀌었나?", result: "tool result 또는 error", note: "Tool 결과만으로 외부 시스템의 변경까지 증명되지 않을 수 있습니다. 외부 효과는 해당 시스템의 조회 결과나 별도 멱등성 키로 확인해야 합니다." },
  { label: "답장 전달", owner: "OpenClaw delivery", question: "원래 대화에 도착했나?", result: "terminalReceipt", note: "sourceReplyDelivered: true가 있으면 최종 답장이 외부 source 대화에 도착했음을 확인할 수 있습니다." },
] as const;

export default function OpenClawToolDeliveryViz() {
  const scenes = useAnimatedScenes(STAGES.length, 5200, { loop: false });
  const active = STAGES[scenes.active];
  return (
    <VizFrame
      eyebrow="제안 · 권한 · 실행 · 전달"
      title="모델의 tool call과 실제 효과, 최종 답장은 서로 다른 상태입니다"
      description="도구 이름 하나를 따라가며 호출 허용, 실행 위치, 효과 증거, 채널 전달 증거를 순서대로 구분합니다."
      note="외부 API가 응답을 잃어 결과가 모호하면 무조건 다시 실행하지 않습니다. 기존 효과를 조회하거나 제한된 재시도·사람 검토로 끝냅니다."
      canvasClassName="p-2 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="openclaw-tool-delivery" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="OpenClaw tool 판정과 답장 전달 장면" onKeyDown={scenes.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div data-viz-live-only>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {STAGES.map((stage, index) => (
              <button key={stage.label} type="button" onClick={() => scenes.setActive(index)} aria-pressed={scenes.active === index} className={`min-w-0 border px-1 py-2 sm:px-3 sm:py-4 ${index === scenes.active ? "border-primary bg-primary/10" : index < scenes.active ? "border-foreground/35 bg-muted/45" : "border-border bg-background"}`}>
                <span className="block font-mono text-[9px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span className="mt-1 block break-keep text-center text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{stage.label}</span>
              </button>
            ))}
          </div>
          <section className="mt-3 grid gap-3 border-y border-border py-4 sm:grid-cols-[9rem_minmax(0,1fr)_12rem] sm:items-center">
            <div><p className="text-[10px] font-black text-primary">결정 주체</p><p className="mt-1 text-sm font-bold">{active.owner}</p></div>
            <div><p className="text-[10px] font-bold text-muted-foreground">확인할 질문</p><p className="mt-1 break-keep text-sm leading-6">{active.question}</p></div>
            <div className="border-l border-border pl-3"><p className="text-[10px] font-bold text-muted-foreground">남는 상태</p><p className="mt-1 break-words font-mono text-[11px] leading-5">{active.result}</p></div>
          </section>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{active.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={STAGES.map((stage) => stage.label)} playLabel="판정 경로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {STAGES.map((stage, index) => <li key={stage.label}><strong>{index + 1}. {stage.label} · {stage.owner}</strong><span className="mt-1 block text-muted-foreground">{stage.question} {stage.note} 남는 상태: {stage.result}.</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
