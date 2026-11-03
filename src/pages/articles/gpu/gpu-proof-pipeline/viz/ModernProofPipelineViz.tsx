import { useState } from "react";

const CUTS = [
  { code: "ORDER", label: "무엇이 먼저인가" },
  { code: "GEN", label: "같은 시도인가" },
  { code: "LIVE", label: "언제 버려도 되나" },
  { code: "PATH", label: "전체 몇 ms인가" },
] as const;

function Arrow({ label }: { label?: string }) {
  return <div className="flex min-h-7 shrink-0 items-center justify-center gap-1 text-[11px] text-muted-foreground"><span>{label}</span><span className="hidden sm:inline">→</span><span className="sm:hidden">↓</span></div>;
}

function Node({ title, detail, active = false }: { title: string; detail: string; active?: boolean }) {
  return <div className={`min-w-0 rounded-xl border p-4 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}><strong className="block break-words text-sm">{title}</strong><span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{detail}</span></div>;
}

function OrderScene() {
  const stages = [
    ["Witness", "입력에서 값 생성"],
    ["NTT", "polynomial 표현 변환"],
    ["MSM", "commitment 생성"],
    ["Transcript", "다음 challenge 확정"],
    ["Opening", "challenge 의존 작업"],
    ["Verify", "독립 검증 receipt"],
  ];
  return <><p className="text-sm font-bold leading-6">Commitment가 transcript에 들어가야 다음 challenge가 정해집니다.</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">{stages.slice(0, 3).map(([title, detail], i) => <div className="contents" key={title}><Node title={title} detail={detail} active={i === 2} />{i < 2 ? <Arrow label="buffer" /> : null}</div>)}</div><div className="my-2 flex justify-center"><Arrow label="commitment를 흡수" /></div><div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">{stages.slice(3).map(([title, detail], i) => <div className="contents" key={title}><Node title={title} detail={detail} active={i === 0} />{i < 2 ? <Arrow label={i === 0 ? "challenge" : "proof"} /> : null}</div>)}</div></>;
}

function GenerationScene() {
  return <><p className="text-sm font-bold leading-6">완료 표시만으로는 부족합니다. Data와 challenge가 같은 proof attempt여야 합니다.</p><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><Node title="NTT receipt" detail="done=true · generation 42" active /><Arrow label="비교" /><Node title="Transcript" detail="challenge β · generation 41" /></div><div className="mt-4 rounded-xl border border-rose-400/50 bg-rose-500/5 p-4"><strong className="text-sm text-rose-700 dark:text-rose-300">ready = false</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">Generation 42 data에 41의 challenge를 붙이지 않습니다. Buffer를 폐기하고 같은 attempt의 선행 stage부터 복구합니다.</p></div></>;
}

function LivenessScene() {
  const rows = [
    { name: "A · 8 GB", start: 0, span: 5, tone: "bg-violet-500/25 border-violet-400/60" },
    { name: "B · 6 GB", start: 3, span: 5, tone: "bg-sky-500/25 border-sky-400/60" },
    { name: "C · 4 GB", start: 6, span: 3, tone: "bg-amber-500/25 border-amber-400/60" },
  ];
  return <><p className="text-sm font-bold leading-6">Buffer는 producer가 만든 순간부터 마지막 consumer가 끝날 때까지 살아 있습니다.</p><div className="mt-4 grid grid-cols-[4.5rem_1fr] items-end gap-3"><span className="text-[10px] font-bold text-muted-foreground">시간 τ</span><div className="grid grid-cols-9 text-center text-[10px] text-muted-foreground">{Array.from({length: 9}, (_, i) => <span key={i}>{i}</span>)}</div></div><div className="mt-2 space-y-3">{rows.map(row => <div key={row.name} className="grid grid-cols-[4.5rem_1fr] items-center gap-3"><span className="text-xs font-bold">{row.name}</span><div className="grid h-9 grid-cols-9 gap-0.5 rounded-lg bg-muted p-1">{Array.from({length: 9}, (_, i) => <span key={i} className={`rounded-sm border ${i >= row.start && i < row.start + row.span ? row.tone : "border-transparent"}`} />)}</div></div>)}</div><div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4"><strong className="text-sm">τ=3~5: A 8 GB + B 6 GB = peak 14 GB</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">전체 18 GB를 항상 잡는 것도, 가장 큰 buffer 8 GB만 잡는 것도 아닙니다.</p></div></>;
}

function CriticalPathScene() {
  return <><p className="text-sm font-bold leading-6">독립 branch는 겹치지만 합류점은 더 늦은 branch를 기다립니다.</p><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_1.3fr_auto_1fr] sm:items-center"><Node title="A · 4 ms" detail="공통 선행 작업" active /><Arrow label="분기" /><div className="grid gap-2"><Node title="B · 6 ms" detail="긴 branch · critical" active /><Node title="C · 3 ms" detail="짧은 branch · 먼저 대기" /></div><Arrow label="join" /><Node title="D · 2 ms" detail="둘 다 끝난 뒤 실행" active /></div><div className="mt-4 rounded-xl border border-primary/40 bg-primary/5 p-4"><strong className="text-sm">4 + max(6, 3) + 2 = 12 ms</strong><p className="mt-1 text-xs leading-5 text-muted-foreground">단순 합 15 ms도 아니고, 가장 긴 stage 하나인 6 ms도 아닙니다.</p></div></>;
}

const SCENES = [OrderScene, GenerationScene, LivenessScene, CriticalPathScene];

export function ProofPipelineDagViz() {
  const [active, setActive] = useState(0);
  const Scene = SCENES[active];
  const move = (delta: number) => setActive((value) => (value + delta + CUTS.length) % CUTS.length);

  return (
    <figure data-viz="proof-pipeline-dag" tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === " " || event.key === "Enter") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }} className="overflow-hidden rounded-2xl border border-border bg-card" aria-labelledby="proof-pipeline-viz-title">
      <figcaption className="border-b border-border p-5 sm:p-6" id="proof-pipeline-viz-title"><p className="text-xs font-black tracking-[0.15em] text-primary">ONE PROOF ATTEMPT · 4 CUTS</p><p className="mt-2 text-lg font-bold">증명은 kernel 목록이 아니라 dependency DAG입니다</p><p className="mt-1 text-sm leading-6 text-muted-foreground">한 attempt를 순서 → generation → buffer 생존 → critical path로 잘라 봅니다. ← → 키로 장면을 이동할 수 있습니다.</p></figcaption>
      <div className="grid grid-cols-4 gap-1 border-b border-border bg-muted/30 p-2 sm:gap-2 sm:p-3" role="tablist" aria-label="proof pipeline 장면">
        {CUTS.map((cut, index) => <button key={cut.code} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`min-w-0 rounded-lg px-1 py-2 text-center ${active === index ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}><span className="block text-[10px] font-black">{index + 1} · {cut.code}</span><span className="mt-1 hidden text-xs font-bold sm:block">{cut.label}</span></button>)}
      </div>
      <div data-viz-canvas className="p-5 sm:p-6"><Scene /><div className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">고정 receipt:</strong> circuit · SRS · transcript · backend SHA · input seed · synchronization boundary · verifier result</div></div>
    </figure>
  );
}
