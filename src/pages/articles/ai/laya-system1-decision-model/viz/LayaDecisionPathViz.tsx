import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  {
    label: "질문 정의",
    owner: "호출자",
    state: "상태 + choice·score·noul",
    result: "같은 문의에 답의 모양이 다른 질문 세 개를 붙입니다.",
  },
  {
    label: "Checkpoint 선택",
    owner: "Router",
    state: "model=english · reason=language",
    result: "명시적 설정과 언어 단서를 차례로 확인해 실행할 checkpoint를 기록합니다.",
  },
  {
    label: "시퀀스 구성",
    owner: "입력 구성 코드",
    state: "질문 3개 → 입력 행 3개",
    result: "각 질문의 선택지 앞에 marker를 두고 같은 문의를 붙여 한 batch를 만듭니다.",
  },
  {
    label: "Marker 점수",
    owner: "Encoder + decision head",
    state: "billing 3.1 · technical 0.4 · other −0.6",
    result: "선택지 marker의 hidden vector만 읽어 질문별 logit을 만듭니다. 숫자는 설명용 가정입니다.",
  },
  {
    label: "확률과 답",
    owner: "보정·decode",
    state: "billing 0.916 · urgency 1.84 · churn 0.73",
    result: "질문 안에서 softmax하고 temperature를 적용해 typed answer와 확률을 돌려줍니다.",
  },
] as const;

const X = [16, 160, 304, 448, 592] as const;

function DesktopPath({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 736 210" className="hidden h-auto w-full md:block" role="img" aria-label="문의 하나가 Laya의 확률 답으로 바뀌는 다섯 단계">
      <defs>
        <marker id="laya-decision-path-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill="currentColor" />
        </marker>
      </defs>
      <text x="16" y="16" className="fill-muted-foreground text-[8px] font-bold">같은 청구 문의를 다섯 단계에서 추적</text>
      {X.slice(0, -1).map((x, index) => (
        <path
          key={x}
          d={`M${x + 124} 92H${X[index + 1] - 8}`}
          fill="none"
          markerEnd="url(#laya-decision-path-arrow)"
          className={index < active ? "stroke-primary" : "stroke-border"}
          strokeWidth={index < active ? 1.5 : 1}
        />
      ))}
      {STAGES.map((stage, index) => {
        const selected = index === active;
        const passed = index < active;
        return (
          <g key={stage.label}>
            <rect
              x={X[index]}
              y="46"
              width="124"
              height="92"
              rx="7"
              className={selected ? "fill-primary/10 stroke-primary" : passed ? "fill-muted/55 stroke-foreground/35" : "fill-background stroke-border"}
              strokeWidth={selected ? 1.5 : 1}
            />
            <text x={X[index] + 10} y="66" className="fill-primary text-[7.5px] font-black">{String(index + 1).padStart(2, "0")} · {stage.owner}</text>
            <text x={X[index] + 10} y="88" className="fill-foreground text-[10px] font-bold">{stage.label}</text>
            <foreignObject x={X[index] + 10} y="98" width="104" height="34">
              <div className="break-words font-mono text-[7.5px] leading-[11px] text-muted-foreground">{stage.state}</div>
            </foreignObject>
          </g>
        );
      })}
      <g transform={`translate(${X[active] + 29} 151)`}>
        <rect width="66" height="20" rx="10" className="fill-primary" />
        <text x="33" y="13.5" textAnchor="middle" className="fill-primary-foreground text-[7px] font-black">현재 단계</text>
      </g>
      <text x="368" y="198" textAnchor="middle" className="fill-muted-foreground text-[8px]">실선은 한 번의 요청 처리 순서입니다 · 단계마다 소유자와 출력 상태가 달라집니다</text>
    </svg>
  );
}
function MobilePath({ active }: { active: number }) {
  const current = STAGES[active];
  return (
    <div className="md:hidden">
      <ol className="space-y-1.5" aria-label="Laya 결정의 전체 순서">
        {STAGES.map((stage, index) => (
          <li
            key={stage.label}
            aria-current={index === active ? "step" : undefined}
            className={`grid min-h-12 min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2 border px-2.5 py-2 ${index === active ? "border-primary bg-primary/10" : index < active ? "border-foreground/35 bg-muted/45" : "border-border bg-background"}`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current font-mono text-[10px] font-black text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold leading-4 text-muted-foreground">{stage.owner}</span>
              <strong className="block break-keep text-[12px] leading-5 text-foreground">{stage.label}</strong>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 border-l-2 border-primary/55 bg-background px-3 py-2.5">
        <p className="text-[11px] font-bold">{current.owner}</p>
        <p className="mt-1 break-words font-mono text-[9px] leading-4 text-muted-foreground">{current.state}</p>
      </div>
    </div>
  );
}
export default function LayaDecisionPathViz() {
  const scenes = useAnimatedScenes(STAGES.length, 5000, { loop: false });
  const current = STAGES[scenes.active];

  return (
    <VizFrame
      eyebrow="청구 문의 하나 · 질문 세 개"
      title="상태와 질문이 보정된 확률 답으로 바뀌는 전체 경로"
      description="청구 문의 하나에 세 질문을 붙입니다. Router의 checkpoint 선택과 모델 안의 선택지 점수 계산은 서로 다른 결정입니다."
      note="확률 값은 메커니즘을 계산하기 위한 가정이며 실제 checkpoint 측정값이 아닙니다."
      canvasClassName="p-2 sm:p-6"
    >
        <div id={scenes.playbackId} data-viz-canvas data-viz-scene="laya-decision-path" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="청구 문의 하나의 Laya 처리 장면" onKeyDown={scenes.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div data-viz-live-only>
          <p className="px-1 text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")} · {current.label}</p>
          <div className="mt-3 border-y border-border py-3">
            <DesktopPath active={scenes.active} />
            <MobilePath active={scenes.active} />
          </div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            <strong className="text-foreground">{current.owner}</strong>가 {current.result} 이때 남기는 값은 <code>{current.state}</code>입니다.
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={STAGES.map((stage) => stage.label)} playLabel="결정 경로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {STAGES.map((stage, index) => (
            <li key={stage.label}><strong>{index + 1}. {stage.label} · {stage.owner}</strong><span className="mt-1 block text-muted-foreground">{stage.result} 출력: {stage.state}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
