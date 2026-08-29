import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: request 하나가 root span(0) → retrieval/generation/tool 자식 span으로
 * 중첩된 tree(1) → 그 span들의 duration이 시간축에서 이어진 latency breakdown(2) →
 * output token 수와 생성 구간 시간으로 계산한 token throughput(3)을 보여 준다.
 * 4 장면 모두 같은 4개 span(request·retrieval·generation·tool)을 기준으로 두고,
 * stage 높이는 3번 장면(latency bar + throughput 계산)의 콘텐츠 기준으로 고정한다.
 */
const SCENES = [
  "Request 도착 · root span 생성",
  "자식 span이 tree로 중첩",
  "Span duration이 latency breakdown을 이룸",
  "Output token ÷ 생성 시간 = throughput",
] as const;

const NOTES = [
  "요청이 도착하면 이 요청 전체를 감싸는 request span(루트)이 생성되고 trace id 하나가 부여됩니다. 아직 자식 span은 없습니다.",
  "처리 도중 retrieval → generation → tool → generation 순서로 자식 span이 붙습니다. 같은 trace id를 공유하면서 parent span id로 tree 위치가 정해집니다.",
  "각 span의 시작·종료 시각을 시간축에 놓으면 전체 latency가 어느 구간에 쓰였는지 보입니다. Queue·TTFT는 첫 generation span 이전에, 나머지는 이후에 쌓입니다.",
  "두 번째 generation span에서 output 96 token을 0.9초에 만들었다면 throughput은 초당 약 107 token입니다. 같은 계산을 generation span마다 따로 해야 합니다.",
] as const;

const SPANS = [
  { key: "retrieval", label: "Retrieval", ms: 80, border: "border-primary/45", bg: "bg-primary/5" },
  { key: "gen1", label: "Generation", ms: 220, border: "border-primary/70", bg: "bg-primary/10" },
  { key: "tool", label: "Tool", ms: 480, border: "border-primary/45", bg: "bg-primary/5" },
  { key: "gen2", label: "Generation", ms: 900, border: "border-primary/70", bg: "bg-primary/10" },
] as const;

const TOTAL_MS = SPANS.reduce((sum, s) => sum + s.ms, 0);

function RootSpanBox({ active }: { active: boolean }) {
  return (
    <div
      className={`mx-auto flex h-12 w-56 items-center justify-center border text-xs font-bold ${
        active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-muted/30 text-muted-foreground"
      }`}
    >
      Request span (root)
    </div>
  );
}

function TreeScene({ activeCount }: { activeCount: number }) {
  return (
    <div className="mt-6">
      <RootSpanBox active />
      <svg viewBox="0 0 400 32" className="mx-auto -mt-1 h-6 w-56" aria-hidden="true">
        <path d="M 200 0 L 200 16 M 40 16 L 360 16 M 40 16 L 40 30 M 146 16 L 146 30 M 253 16 L 253 30 M 360 16 L 360 30" fill="none" stroke="currentColor" strokeWidth={1.25} className="text-muted-foreground/50" />
      </svg>
      <div className="grid grid-cols-4 gap-1.5">
        {SPANS.map((span, index) => (
          <div
            key={span.key}
            className={`flex h-10 items-center justify-center border text-center text-[10px] font-bold leading-tight ${
              index < activeCount ? `${span.border} ${span.bg} text-foreground` : "border-border bg-muted/20 text-muted-foreground/40"
            }`}
          >
            {span.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function LatencyBar({ highlightLast }: { highlightLast: boolean }) {
  return (
    <div className="mt-6">
      <div className="flex h-9 w-full overflow-hidden border border-border/70">
        {SPANS.map((span, index) => {
          const widthPct = (span.ms / TOTAL_MS) * 100;
          const isLast = index === SPANS.length - 1;
          return (
            <div
              key={span.key}
              style={{ width: `${widthPct}%` }}
              className={`flex items-center justify-center border-r border-background/60 text-[10px] font-bold last:border-r-0 ${
                isLast && highlightLast ? "bg-primary/25 text-foreground" : `${span.bg} text-muted-foreground`
              }`}
            >
              {span.ms}ms
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
        <span>Retrieval</span>
        <span>Generation</span>
        <span>Tool</span>
        <span>Generation</span>
      </div>
      <p className="mt-2 text-center text-[10px] font-bold text-primary">
        전체 latency ≈ {TOTAL_MS}ms
      </p>
    </div>
  );
}

function ThroughputScene() {
  return (
    <div className="mt-6">
      <LatencyBar highlightLast />
      <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-2 border border-primary/50 bg-primary/5 px-4 py-3 text-center text-xs font-bold text-foreground">
        <span>96 token</span>
        <span className="text-primary">÷</span>
        <span>0.9s</span>
        <span className="text-primary">=</span>
        <span>≈107 tok/s</span>
      </div>
    </div>
  );
}

export default function LlmMonitoringObservabilityAndDriftViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="Trace tree · latency breakdown"
      title="한 request가 남긴 span tree가 latency breakdown과 token throughput의 원재료입니다"
      description="같은 4개 span(retrieval·generation·tool·generation)이 각 장면에서 tree 구조, 시간축 breakdown, throughput 계산으로 다시 쓰입니다."
      note="80/220/480/900ms와 96 token 같은 숫자는 절차를 보여 주기 위한 예시이며 특정 배포의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Request span 아래 retrieval·generation·tool span이 중첩되고, 그 duration이 latency breakdown과 token throughput 계산으로 이어지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>

          {scenes.active === 0 && (
            <div className="mt-6">
              <RootSpanBox active />
            </div>
          )}
          {scenes.active === 1 && <TreeScene activeCount={SPANS.length} />}
          {scenes.active === 2 && <LatencyBar highlightLast={false} />}
          {scenes.active === 3 && <ThroughputScene />}

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
