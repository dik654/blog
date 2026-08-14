import { useEffect, useMemo, useState } from "react";

type Mode = "core" | "primitives" | "transport" | "operations";

type Scene = {
  label: string;
  title: string;
  detail: string;
  shape: "host" | "port" | "message" | "gate" | "receipt";
};

const FLOWS: Record<
  Mode,
  { eyebrow: string; question: string; scenes: Scene[] }
> = {
  core: {
    eyebrow: "MCP core · 요청 한 건의 소유권",
    question: "사용자의 요청은 누가 판단하고, 누가 전달하고, 누가 실행할까요?",
    scenes: [
      { label: "HOST", title: "Host", detail: "사용자·model·승인 정책을 소유", shape: "host" },
      { label: "CLIENT", title: "Client", detail: "한 server와 MCP message를 교환", shape: "port" },
      { label: "RPC", title: "Request envelope", detail: "version·capability·요청을 함께 전달", shape: "message" },
      { label: "SERVER", title: "Server", detail: "좁은 domain 기능과 권한을 집행", shape: "gate" },
    ],
  },
  primitives: {
    eyebrow: "MCP primitives · 무엇을 어떻게 노출하는가",
    question: "기능을 모두 ‘함수’라 부르지 않고 control 방식으로 나누면 무엇이 보일까요?",
    scenes: [
      { label: "TOOL", title: "Tool", detail: "Model이 실행을 제안하는 동작", shape: "gate" },
      { label: "RESOURCE", title: "Resource", detail: "URI로 식별해 읽는 context", shape: "message" },
      { label: "PROMPT", title: "Prompt", detail: "사용자가 고르는 message template", shape: "host" },
      { label: "RESULT", title: "Typed result", detail: "완료·오류·추가 입력을 구분", shape: "receipt" },
    ],
  },
  transport: {
    eyebrow: "MCP transport · 같은 message, 다른 배포 경계",
    question: "Local subprocess와 remote service는 어디서 다른 책임을 만들까요?",
    scenes: [
      { label: "JSON-RPC", title: "MCP message", detail: "Transport와 분리된 요청 의미", shape: "message" },
      { label: "STDIO", title: "Local pipe", detail: "Host가 child process 수명을 소유", shape: "port" },
      { label: "HTTP", title: "Remote endpoint", detail: "TLS·OAuth·gateway 정책이 필요", shape: "host" },
      { label: "LIFETIME", title: "Stream lifetime", detail: "응답·취소·구독을 따로 관리", shape: "receipt" },
    ],
  },
  operations: {
    eyebrow: "MCP operations · 제안에서 검증된 effect까지",
    question: "Tool call이 timeout돼도 중복 effect 없이 안전하게 끝내려면 무엇이 필요할까요?",
    scenes: [
      { label: "PROPOSE", title: "Model proposal", detail: "실행 후보일 뿐 권한 증명이 아님", shape: "message" },
      { label: "AUTHORIZE", title: "Policy gate", detail: "Host와 server가 각각 다시 검사", shape: "gate" },
      { label: "EFFECT", title: "Domain effect", detail: "외부 system에 실제 변경 발생", shape: "host" },
      { label: "RECEIPT", title: "Effect receipt", detail: "Retry·audit·rollback 판단의 근거", shape: "receipt" },
    ],
  },
};

function SceneGlyph({ scene, active }: { scene: Scene; active: boolean }) {
  const color = active
    ? "border-primary bg-primary/10 text-primary"
    : "border-border bg-background text-muted-foreground";
  if (scene.shape === "host") {
    return <div className={`relative h-20 w-24 rounded-2xl border ${color}`}><span className="absolute inset-x-3 top-3 h-9 rounded-lg border border-current/45" /><span className="absolute inset-x-7 bottom-3 h-px bg-current" /></div>;
  }
  if (scene.shape === "port") {
    return <div className={`relative h-20 w-24 rounded-2xl border ${color}`}><span className="absolute left-4 top-5 h-10 w-10 rounded-full border border-current" /><span className="absolute right-4 top-8 h-4 w-7 border-y border-current" /></div>;
  }
  if (scene.shape === "gate") {
    return <div className={`grid h-20 w-20 rotate-45 place-items-center rounded-2xl border ${color}`}><span className="-rotate-45 text-[10px] font-black">CHECK</span></div>;
  }
  if (scene.shape === "receipt") {
    return <div className={`relative h-20 w-20 rounded-lg border ${color}`}><span className="absolute inset-x-4 top-5 h-px bg-current" /><span className="absolute inset-x-4 top-9 h-px bg-current" /><span className="absolute inset-x-4 top-12 h-px bg-current" /></div>;
  }
  return <div className={`relative h-16 w-28 rounded-full border ${color}`}><span className="absolute left-4 right-4 top-1/2 h-px bg-current" /><span className="absolute right-3 top-[calc(50%-4px)] h-2 w-2 rotate-45 border-r border-t border-current" /></div>;
}

export default function McpLearningFlowViz({ mode }: { mode: Mode }) {
  const flow = FLOWS[mode];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const count = flow.scenes.length;
  const hint = useMemo(() => "← → · Space로 이동하고, 재생 버튼으로 흐름을 자동 진행합니다.", []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % count), 2200);
    return () => window.clearInterval(timer);
  }, [count, playing]);

  function move(delta: number) {
    setPlaying(false);
    setActive((value) => (value + delta + count) % count);
  }

  return (
    <figure
      data-viz="mcp-learning-flow"
      className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") { event.preventDefault(); move(1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      }}
      aria-label={`${flow.eyebrow}. ${hint}`}
    >
      <figcaption className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="text-xs font-black tracking-[0.16em] text-primary">{flow.eyebrow}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">{flow.question}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <button type="button" onClick={() => setPlaying((value) => !value)} className="w-fit rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary" aria-pressed={playing}>
          {playing ? "일시정지" : "흐름 재생"}
        </button>
      </figcaption>

      <div data-viz-canvas className="p-5 sm:p-7">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center md:gap-3">
          {flow.scenes.map((scene, index) => (
            <div className="contents" key={scene.title}>
              <button type="button" onClick={() => { setPlaying(false); setActive(index); }} className={`flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left md:flex-col md:border-transparent md:p-2 md:text-center ${index === active ? "border-primary/50 bg-primary/5" : "border-border/70 bg-background/50 md:bg-transparent"}`} aria-current={index === active ? "step" : undefined}>
                <SceneGlyph scene={scene} active={index <= active} />
                <span className="min-w-0">
                  <span className="block text-[10px] font-black tracking-wider text-primary">0{index + 1} · {scene.label}</span>
                  <span className="mt-1 block text-sm font-bold text-foreground">{scene.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{scene.detail}</span>
                </span>
              </button>
              {index < count - 1 ? <div className="hidden items-center md:flex" aria-hidden="true"><span className={`h-px w-8 ${index < active ? "bg-primary" : "bg-border"}`} /><span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-current text-muted-foreground" /></div> : null}
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-3 border-t border-border pt-5 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="flex gap-2">{flow.scenes.map((scene, index) => <button key={scene.title} type="button" onClick={() => { setPlaying(false); setActive(index); }} className={`h-2.5 rounded-full border transition-[width,background-color] motion-reduce:transition-none ${index === active ? "w-8 border-primary bg-primary" : "w-2.5 border-border bg-background"}`} aria-label={`${index + 1}단계 ${scene.title}`} />)}</div>
          <p aria-live="polite" className="text-sm leading-6 text-foreground/80"><strong>{active + 1}. {flow.scenes[active].title}</strong> — {flow.scenes[active].detail}</p>
        </div>
      </div>
    </figure>
  );
}
