import { useState } from "react";

const CUTS = [
  ["DAG", "값은 어디서 오나"],
  ["SPAN", "얼마나 겹치나"],
  ["BYTES", "무엇을 보관하나"],
  ["GATE", "몇 개가 맞았나"],
] as const;

function Arrow({ label }: { label?: string }) {
  return <div className="flex min-h-7 items-center justify-center gap-1 text-[11px] text-muted-foreground"><span>{label}</span><span className="hidden sm:inline">→</span><span className="sm:hidden">↓</span></div>;
}

function Node({ level, title, detail, active = false }: { level: string; title: string; detail: string; active?: boolean }) {
  return <div className={`min-w-0 rounded-xl border p-4 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}><span className="text-[10px] font-black text-primary">{level}</span><strong className="mt-1 block break-words text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{detail}</span></div>;
}

function DagScene() {
  return <><p className="text-sm font-bold leading-6">입력 x=3에서 중간값을 만들고, 둘 다 준비된 뒤에만 out을 계산합니다.</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center"><Node level="L0" title="x = 3 · constant = 5" detail="선행 producer가 없는 입력" /><Arrow label="독립 계산" /><div className="grid gap-2"><Node level="L1" title="a = x² = 9" detail="x만 읽음" active /><Node level="L1" title="b = x + 5 = 8" detail="x와 상수 5를 읽음" active /></div><Arrow label="둘을 기다림" /><Node level="L2" title="out = a · b = 72" detail="a와 b가 모두 완료돼야 실행" /></div><p className="mt-4 rounded-xl border border-border bg-muted/20 p-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Constraint와의 차이:</strong> 이 DAG는 72를 만드는 순서이고, constraint는 만들어진 값들이 관계를 만족하는지 검사합니다.</p></>;
}

function SpanScene() {
  return <><p className="text-sm font-bold leading-6">별도 8-operation workload를 worker 4개로 나눠도 긴 dependency chain은 사라지지 않습니다.</p><div className="mt-5 space-y-4"><div><div className="flex justify-between text-xs font-bold"><span>Work를 나눈 하한</span><span>W/P = 8/4 = 2 step</span></div><div className="mt-2 h-7 overflow-hidden rounded-full bg-muted"><div className="h-full w-2/3 rounded-full bg-sky-500/30" /></div></div><div><div className="flex justify-between text-xs font-bold"><span>가장 긴 의존 사슬</span><span>D = 3 step</span></div><div className="mt-2 h-7 overflow-hidden rounded-full bg-muted"><div className="h-full w-full rounded-full bg-violet-500/30" /></div></div></div><div className="mt-5 rounded-xl border border-primary/40 bg-primary/5 p-4"><strong className="text-sm">T₄ ≥ max(2, 3) = 3 step</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">3 step은 이상적 하한입니다. Launch·transfer·memory stall을 넣은 실제 실행 시간은 더 길 수 있습니다.</p></div></>;
}

function BytesScene() {
  const parts = [
    ["signals", "320 B", "37%", "bg-violet-400"],
    ["instructions", "96 B", "11%", "bg-sky-400"],
    ["constants", "64 B", "7%", "bg-emerald-400"],
    ["scratch", "128 B", "15%", "bg-amber-400"],
    ["runtime", "256 B", "30%", "bg-rose-400"],
  ];
  return <><p className="text-sm font-bold leading-6">Frontier k에서 동시에 살아 있는 allocation만 실제 device byte로 더합니다.</p><div className="mt-5 flex h-9 overflow-hidden rounded-lg border border-border" aria-label="864 byte memory breakdown">{parts.map(([name, , width, tone]) => <span key={name} className={`${tone}`} style={{width}} title={name} />)}</div><div className="mt-4 grid gap-2 sm:grid-cols-2">{parts.map(([name, bytes, , tone]) => <div key={name} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-xs"><span className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${tone}`} />{name}</span><strong>{bytes}</strong></div>)}</div><div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4"><strong className="text-sm">320 + 96 + 64 + 128 + 256 = 864 B</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">Signal 320 B는 32 B × live signal 10개입니다. Serialized file size가 아니라 aligned allocation을 셉니다.</p></div></>;
}

function GateScene() {
  return <><p className="text-sm font-bold leading-6">빠르게 계산한 수가 아니라 최종 verifier까지 통과한 수를 셉니다.</p><div className="mt-5 overflow-hidden rounded-xl border border-border"><div className="flex h-12"><div className="flex w-[98%] items-center justify-center bg-emerald-500/20 text-xs font-bold">98 verified</div><div className="w-[2%] min-w-2 bg-rose-500/35" aria-label="2 failed" /></div><div className="flex justify-between border-t border-border bg-background px-4 py-3 text-xs"><span>입력 100개 · 실패 2개</span><strong>wall time 0.5 s</strong></div></div><div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4"><strong className="text-sm">98 verified ÷ 0.5 s = 196 witness/s</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">실패·retry·CPU fallback 시간은 wall time에서 숨기지 않습니다.</p></div></>;
}

const SCENES = [DagScene, SpanScene, BytesScene, GateScene];

export function WitnessFrontierViz() {
  const [active, setActive] = useState(0);
  const Scene = SCENES[active];
  const move = (delta: number) => setActive((value) => (value + delta + CUTS.length) % CUTS.length);

  return (
    <figure data-viz="witness-frontier" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }} className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card">
      <figcaption className="border-b border-border p-5 sm:p-6">
        <p className="text-xs font-black tracking-[0.15em] text-primary">x=3 · ONE WITNESS TRACE</p>
        <p className="mt-2 text-lg font-bold">값을 만드는 순서부터 검증된 처리량까지</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">DAG → 병렬 하한 → live bytes → release gate를 차례로 엽니다. ← → 키로 장면을 이동할 수 있습니다.</p>
      </figcaption>
      <div className="grid grid-cols-4 gap-1 border-b border-border bg-muted/30 p-2 sm:gap-2 sm:p-3" role="tablist" aria-label="witness generation 장면">
        {CUTS.map(([code, label], index) => <button key={code} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`min-w-0 rounded-lg px-1 py-2 text-center ${active === index ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}><span className="block text-[10px] font-black">{index + 1} · {code}</span><span className="mt-1 hidden text-xs font-bold sm:block">{label}</span></button>)}
      </div>
      <div data-viz-canvas className="p-5 sm:p-6">
        <Scene />
        <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">공통 receipt:</strong> circuit SHA · input generation · field representation · scheduler/backend SHA · verifier result</p>
      </div>
    </figure>
  );
}
