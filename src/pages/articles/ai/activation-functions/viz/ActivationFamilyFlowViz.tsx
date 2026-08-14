import { useEffect, useState } from "react";

export type ActivationFlowMode = "foundations" | "rectifiers" | "gates";
type Shape = "threshold" | "curve" | "hinge" | "branch" | "multiply" | "signal";
type Step = { code: string; title: string; detail: string; shape: Shape };

const FLOWS: Record<ActivationFlowMode, { caption: string; steps: Step[] }> = {
  foundations: {
    caption: "숫자 하나가 activation을 지나며 출력 의미와 backward slope를 함께 얻는 과정입니다",
    steps: [
      { code: "Z", title: "Pre-activation", detail: "Affine layer가 만든 제한 없는 score", shape: "signal" },
      { code: "MAP", title: "Response curve", detail: "입력 구간마다 다른 nonlinear mapping", shape: "curve" },
      { code: "A", title: "Forward value", detail: "다음 layer가 읽는 activation", shape: "threshold" },
      { code: "SLOPE", title: "Local derivative", detail: "Backward signal에 곱할 기울기", shape: "hinge" },
    ],
  },
  rectifiers: {
    caption: "ReLU의 꺾인 경로에서 dead unit을 찾고 음수 경로와 signal 조건을 차례로 보강합니다",
    steps: [
      { code: "CUT", title: "ReLU hinge", detail: "음수는 0, 양수는 그대로 통과", shape: "hinge" },
      { code: "DEAD", title: "Dying state", detail: "모든 batch에서 음수면 slope도 0", shape: "threshold" },
      { code: "LEAK", title: "Negative path", detail: "작은 고정·학습 slope를 남김", shape: "curve" },
      { code: "DIST", title: "Signal recipe", detail: "SELU·초기화·dropout 조건을 결합", shape: "signal" },
    ],
  },
  gates: {
    caption: "같은 scalar의 부드러운 self-gate에서 서로 다른 gate·value projection을 가진 FFN으로 확장합니다",
    steps: [
      { code: "X", title: "Input feature", detail: "부호와 크기를 가진 value", shape: "signal" },
      { code: "GATE", title: "Smooth gate", detail: "Φ(x) 또는 σ(x)로 통과량 결정", shape: "curve" },
      { code: "SPLIT", title: "Two projections", detail: "Wg와 Wv가 gate·value를 따로 생성", shape: "branch" },
      { code: "MIX", title: "Gated FFN", detail: "element-wise 곱 뒤 output projection", shape: "multiply" },
    ],
  },
};

function ShapeGlyph({ shape, active }: { shape: Shape; active: boolean }) {
  const tone = active ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground";
  if (shape === "curve") return <div className={`relative h-20 w-24 rounded-xl border ${tone}`}><span className="absolute bottom-5 left-4 h-px w-16 -rotate-12 bg-current"/><span className="absolute bottom-5 left-10 h-10 w-px -rotate-[32deg] bg-current"/></div>;
  if (shape === "hinge") return <div className={`relative h-20 w-24 rounded-xl border ${tone}`}><span className="absolute bottom-6 left-4 h-px w-8 bg-current"/><span className="absolute bottom-6 left-12 h-px w-9 -rotate-45 origin-left bg-current"/><span className="absolute bottom-[1.35rem] left-[2.85rem] h-2 w-2 rounded-full border border-current bg-background"/></div>;
  if (shape === "branch") return <div className={`relative h-20 w-24 rounded-xl border ${tone}`}><span className="absolute left-4 top-1/2 h-px w-7 bg-current"/><span className="absolute left-10 top-5 h-px w-9 -rotate-[25deg] bg-current"/><span className="absolute left-10 bottom-5 h-px w-9 rotate-[25deg] bg-current"/><span className="absolute right-3 top-4 h-3 w-3 rounded-full border border-current"/><span className="absolute bottom-4 right-3 h-3 w-3 rounded-full border border-current"/></div>;
  if (shape === "multiply") return <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border ${tone}`}><span className="text-3xl font-light">×</span></div>;
  if (shape === "threshold") return <div className={`relative h-20 w-24 rounded-xl border ${tone}`}><span className="absolute bottom-5 left-4 h-px w-8 bg-current"/><span className="absolute bottom-5 left-12 h-10 w-px bg-current"/><span className="absolute left-12 top-5 h-px w-8 bg-current"/></div>;
  return <div className={`relative h-16 w-28 rounded-full border ${tone}`}><span className="absolute left-4 right-4 top-1/2 h-px bg-current"/><span className="absolute right-3 top-[calc(50%-4px)] h-2 w-2 rotate-45 border-r border-t border-current"/></div>;
}

export default function ActivationFamilyFlowViz({ mode }: { mode: ActivationFlowMode }) {
  const flow = FLOWS[mode];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % flow.steps.length), 2200);
    return () => window.clearInterval(timer);
  }, [flow.steps.length, playing]);
  const move = (delta: number) => { setPlaying(false); setActive(value => (value + delta + flow.steps.length) % flow.steps.length); };
  return <figure data-viz="activation-family-flow" tabIndex={0} onKeyDown={event => { if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }} className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card">
    <figcaption className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black tracking-[0.15em] text-primary">ACTIVATION PATH · 4 CUTS</p><p className="mt-2 text-sm font-semibold leading-6">{flow.caption}</p><p className="mt-1 text-xs text-muted-foreground">← → · Space로 한 단계씩 보거나 자동 재생합니다.</p></div><button type="button" aria-pressed={playing} onClick={() => setPlaying(value => !value)} className="w-fit rounded-full border border-border px-3 py-1.5 text-xs font-bold">{playing ? "일시정지" : "흐름 재생"}</button></figcaption>
    <div data-viz-canvas className="p-5 sm:p-7"><div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center md:gap-3">{flow.steps.map((step, index) => <div className="contents" key={step.code}><button type="button" aria-current={index === active ? "step" : undefined} onClick={() => { setPlaying(false); setActive(index); }} className={`flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left md:flex-col md:border-transparent md:p-2 md:text-center ${index === active ? "border-primary/50 bg-primary/5" : "border-border/70 bg-background/50 md:bg-transparent"}`}><ShapeGlyph shape={step.shape} active={index <= active}/><span className="min-w-0"><span className="block text-[10px] font-black text-primary">0{index + 1} · {step.code}</span><span className="mt-1 block text-sm font-bold">{step.title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{step.detail}</span></span></button>{index < flow.steps.length - 1 ? <div className="hidden items-center md:flex" aria-hidden="true"><span className={`h-px w-8 ${index < active ? "bg-primary" : "bg-border"}`}/><span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-current text-muted-foreground"/></div> : null}</div>)}</div>
      <div className="mt-6 flex items-center gap-4 border-t border-border pt-5"><div className="flex gap-2">{flow.steps.map((step, index) => <button key={step.code} type="button" aria-label={`${index + 1}단계 ${step.title}`} onClick={() => { setPlaying(false); setActive(index); }} className={`h-2.5 rounded-full border ${index === active ? "w-8 border-primary bg-primary" : "w-2.5 border-border bg-background"}`}/>)}</div><p aria-live="polite" className="text-sm leading-6"><strong>{active + 1}. {flow.steps[active].title}</strong> — {flow.steps[active].detail}</p></div>
    </div>
  </figure>;
}
