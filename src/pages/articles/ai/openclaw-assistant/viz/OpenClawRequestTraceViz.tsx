import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const STAGES = [
  { label: "채널 메시지", owner: "Telegram adapter", state: "메시지 · sender · source route", short: "보고서 초안을 요청합니다." },
  { label: "접근 판정", owner: "Channel policy", state: "accepted inbound", short: "Pairing과 allowlist를 통과한 요청만 남습니다." },
  { label: "Agent 선택", owner: "Binding", state: "agentId · workspace", short: "이미 허용된 메시지를 담당 Agent에 연결합니다." },
  { label: "대화 선택", owner: "Session scope", state: "sessionKey · transcript", short: "채널과 발신자에 맞는 대화 기록을 읽습니다." },
  { label: "실행 접수", owner: "Gateway RPC", state: "runId · acceptedAt", short: "접수 결과를 즉시 돌려주고 실행은 이어집니다." },
  { label: "Turn 실행", owner: "Agent runtime", state: "model · tool events", short: "선택된 runtime이 모델과 도구 반복을 진행합니다." },
  { label: "효과 판정", owner: "Policy · sandbox", state: "allow/deny · 실행 위치 · result/error", short: "허용 여부와 실행 위치를 따로 결정합니다." },
  { label: "최종 상태", owner: "Gateway", state: "runId · terminal outcome", short: "같은 runId에 완료·오류·대기 만료를 연결합니다." },
  { label: "원래 대화", owner: "Channel delivery", state: "sourceReplyDelivered", short: "보존한 Telegram 대화로 답장을 전달합니다." },
] as const;

const POINTS = [
  [18, 20], [258, 20], [498, 20],
  [498, 145], [258, 145], [18, 145],
  [18, 270], [258, 270], [498, 270],
] as const;

const SEGMENTS = [
  "M210 60H258", "M450 60H498", "M594 100V145",
  "M498 185H450", "M258 185H210", "M114 225V270",
  "M210 310H258", "M450 310H498",
] as const;

function DesktopMap({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 708 370" className="hidden h-auto w-full sm:block" role="img" aria-label="Telegram 요청이 Gateway와 Agent runtime을 지나 같은 대화로 돌아오는 경로">
      <defs>
        <marker id="openclaw-trace-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8Z" fill="currentColor" />
        </marker>
      </defs>
      <rect x="244" y="8" width="366" height="230" rx="10" className="fill-background/40 stroke-border" strokeDasharray="5 5" />
      <text x="426" y="350" textAnchor="middle" className="fill-muted-foreground text-[9px]">실선은 처리 순서입니다 · 선택된 단계만 강조합니다</text>
      <text x="426" y="15" textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">라우팅 · 대화 상태 · 실행 접수</text>
      {SEGMENTS.map((path, index) => (
        <path
          key={path}
          d={path}
          fill="none"
          markerEnd="url(#openclaw-trace-arrow)"
          className={index < active ? "stroke-primary" : "stroke-border"}
          strokeWidth={index < active ? 1.5 : 1}
        />
      ))}
      {STAGES.map((stage, index) => {
        const [x, y] = POINTS[index];
        const selected = index === active;
        const passed = index < active;
        return (
          <g key={stage.label}>
            <rect
              x={x}
              y={y}
              width="192"
              height="80"
              rx="7"
              className={selected ? "fill-primary/10 stroke-primary" : passed ? "fill-muted/55 stroke-foreground/35" : "fill-background stroke-border"}
              strokeWidth={selected ? 1.5 : 1}
            />
            <text x={x + 12} y={y + 19} className="fill-primary text-[8px] font-black">{String(index + 1).padStart(2, "0")} · {stage.owner}</text>
            <text x={x + 12} y={y + 41} className="fill-foreground text-[11px] font-bold">{stage.label}</text>
            <text x={x + 12} y={y + 62} className="fill-muted-foreground text-[8.5px]">{stage.state}</text>
          </g>
        );
      })}
    </svg>
  );
}

function MobileMap({ active }: { active: number }) {
  const current = STAGES[active];
  return (
    <div className="sm:hidden">
      <ol className="grid grid-cols-3 gap-1" aria-label="OpenClaw 요청 처리의 전체 순서">
        {STAGES.map((stage, index) => (
          <li
            key={stage.label}
            aria-current={index === active ? "step" : undefined}
            className={`flex min-h-14 min-w-0 flex-col justify-center border px-1.5 py-1.5 ${
              index === active
                ? "border-primary bg-primary/10"
                : index < active
                  ? "border-foreground/35 bg-muted/45"
                  : "border-border bg-background"
            }`}
          >
            <span className="font-mono text-[8px] font-black text-primary">{String(index + 1).padStart(2, "0")}</span>
            <strong className="mt-0.5 break-keep text-[9px] leading-4">{stage.label}</strong>
          </li>
        ))}
      </ol>
      <div className="mt-2 border-l-2 border-primary/55 bg-background px-3 py-2.5">
        <p className="break-keep text-[11px] font-bold">{current.owner}</p>
        <p className="mt-1 break-words font-mono text-[9px] leading-4 text-muted-foreground">{current.state}</p>
      </div>
    </div>
  );
}

export default function OpenClawRequestTraceViz() {
  const scenes = useAnimatedScenes(STAGES.length, 4600, { loop: false });
  const current = STAGES[scenes.active];
  return (
    <VizFrame
      eyebrow="한 요청 · 하나의 runId"
      title="메시지 경로와 실행 경로를 같은 그림에서 끝까지 따라갑니다"
      description="Telegram의 보고서 요청이 허용된 뒤 Agent와 session을 찾고, 실행 접수에서 받은 runId가 최종 상태와 외부 답장 증거까지 이어집니다."
      note="runId는 실행을 추적하는 실제 필드명입니다. sessionKey는 어느 대화 상태를 읽을지 고르는 주소이며 사용자 인증 수단이 아닙니다."
      canvasClassName="p-2 sm:p-6"
    >
      <div id={scenes.playbackId} data-viz-canvas data-viz-scene="openclaw-request-trace" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="OpenClaw 요청 한 건의 처리 장면" onKeyDown={scenes.onKeyDown} className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div data-viz-live-only>
          <p className="px-1 text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")} · {current.label}</p>
          <div className="mt-3 border-y border-border py-3">
            <DesktopMap active={scenes.active} />
            <MobileMap active={scenes.active} />
          </div>
          <p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            <strong className="text-foreground">{current.owner}</strong>가 {current.short} 이 단계의 관찰 가능한 출력은 <code>{current.state}</code>입니다.
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={STAGES.map((stage) => stage.label)} playLabel="요청 경로 재생" />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {STAGES.map((stage, index) => (
            <li key={stage.label}><strong>{index + 1}. {stage.label} · {stage.owner}</strong><span className="mt-1 block text-muted-foreground">{stage.short} 출력: {stage.state}</span></li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
