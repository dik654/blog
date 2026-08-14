import { useEffect, useState } from "react";

export type NetworkFlowMode = "fundamentals" | "interconnect" | "rdma" | "collective";
type Step = { code: string; title: string; detail: string; kind: "memory" | "switch" | "link" | "receipt" };

const FLOWS: Record<NetworkFlowMode, { caption: string; steps: Step[] }> = {
  fundamentals: { caption: "누가 무엇을 보내는지에서 시작해, 유효 속도와 Ethernet failure state까지 한 단계씩 조립합니다", steps: [
    { code: "DEMAND", title: "Traffic matrix", detail: "source·destination·크기·동시성", kind: "memory" },
    { code: "USEFUL", title: "Payload goodput", detail: "완료한 유효 byte를 시간으로 측정", kind: "receipt" },
    { code: "LINK", title: "Ethernet chain", detail: "lane·PHY·FEC·media 호환을 확인", kind: "link" },
    { code: "FAIL", title: "Fabric state", detail: "uplink 손실·queue·tail을 다시 측정", kind: "switch" },
  ] },
  interconnect: { caption: "GPU buffer에서 peer 또는 HCA까지 실제 path를 한 구간씩 엽니다", steps: [
    { code: "VRAM", title: "GPU memory", detail: "전송할 buffer와 stream dependency", kind: "memory" },
    { code: "LOCAL", title: "NVLink · PCIe", detail: "지원 peer와 transaction link", kind: "link" },
    { code: "TOPO", title: "Switch · root", detail: "NUMA·ACS·IOMMU가 바꾸는 path", kind: "switch" },
    { code: "PEER", title: "Peer GPU · HCA", detail: "실제 pair bandwidth와 latency 측정", kind: "receipt" },
  ] },
  rdma: { caption: "Host control에서 NIC DMA와 completion까지 ownership을 이동시킵니다", steps: [
    { code: "MR", title: "Memory registration", detail: "range·access·key·lifetime", kind: "memory" },
    { code: "WQ", title: "Work request", detail: "operation·address·length를 queue", kind: "receipt" },
    { code: "DMA", title: "NIC data path", detail: "packet·route·retry를 수행", kind: "link" },
    { code: "CQ", title: "Completion", detail: "성공·오류·recovery를 host에 전달", kind: "switch" },
  ] },
  collective: { caption: "Rank buffer가 node-local과 node-external fabric을 거쳐 함께 끝나는 흐름입니다", steps: [
    { code: "RANK", title: "Rank contract", detail: "operation·count·datatype·order", kind: "memory" },
    { code: "LOCAL", title: "NVLink · PCIe", detail: "node 안 reduce·copy path", kind: "switch" },
    { code: "FABRIC", title: "HCA · network", detail: "node 밖 route·queue·failure", kind: "link" },
    { code: "DONE", title: "All ranks complete", detail: "time·algbw·busbw·counter receipt", kind: "receipt" },
  ] },
};

function Glyph({ step, on }: { step: Step; on: boolean }) {
  const color = on ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground";
  if (step.kind === "memory") return <div className={`relative h-20 w-24 rounded-xl border ${color}`}><span className="absolute inset-x-3 top-3 h-3 rounded-full border border-current" /><span className="absolute inset-x-3 top-8 h-3 rounded-full border border-current" /><span className="absolute inset-x-3 top-[3.25rem] h-3 rounded-full border border-current" /></div>;
  if (step.kind === "switch") return <div className={`relative h-20 w-24 rounded-xl border ${color}`}><span className="absolute left-4 top-4 h-3 w-3 rounded-full border border-current" /><span className="absolute right-4 top-4 h-3 w-3 rounded-full border border-current" /><span className="absolute bottom-4 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-current" /><span className="absolute left-6 right-6 top-1/2 h-px bg-current" /></div>;
  if (step.kind === "receipt") return <div className={`relative h-20 w-20 rounded-lg border ${color}`}><span className="absolute inset-x-4 top-5 h-px bg-current" /><span className="absolute inset-x-4 top-9 h-px bg-current" /><span className="absolute inset-x-4 top-12 h-px bg-current" /></div>;
  return <div className={`relative h-16 w-28 rounded-full border ${color}`}><span className="absolute left-4 right-4 top-1/2 h-px bg-current" /><span className="absolute right-3 top-[calc(50%-4px)] h-2 w-2 rotate-45 border-r border-t border-current" /></div>;
}

export default function NetworkLearningFlowViz({ mode }: { mode: NetworkFlowMode }) {
  const flow = FLOWS[mode]; const [active, setActive] = useState(0); const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!playing) return; const timer=window.setInterval(()=>setActive(v=>(v+1)%flow.steps.length),2200); return()=>window.clearInterval(timer); }, [flow.steps.length, playing]);
  const move=(delta:number)=>{setPlaying(false);setActive(v=>(v+delta+flow.steps.length)%flow.steps.length);};
  return <figure data-viz="network-learning-flow" tabIndex={0} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key===" "||e.key==="Enter"){e.preventDefault();move(1);} if(e.key==="ArrowLeft"){e.preventDefault();move(-1);}}} className="not-prose my-8 overflow-hidden rounded-2xl border border-border bg-card">
    <figcaption className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-black tracking-[0.15em] text-primary">NETWORK PATH · 4 CUTS</p><p className="mt-2 text-sm font-semibold">{flow.caption}</p><p className="mt-1 text-xs text-muted-foreground">← → · Space로 이동하거나 자동 재생합니다.</p></div><button type="button" aria-pressed={playing} onClick={()=>setPlaying(v=>!v)} className="w-fit rounded-full border border-border px-3 py-1.5 text-xs font-bold">{playing?"일시정지":"흐름 재생"}</button></figcaption>
    <div data-viz-canvas className="p-5 sm:p-7"><div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center md:gap-3">{flow.steps.map((step,index)=><div className="contents" key={step.title}><button type="button" onClick={()=>{setPlaying(false);setActive(index);}} aria-current={index===active?"step":undefined} className={`flex min-w-0 items-center gap-4 rounded-xl border p-4 text-left md:flex-col md:border-transparent md:p-2 md:text-center ${index===active?"border-primary/50 bg-primary/5":"border-border/70 bg-background/50 md:bg-transparent"}`}><Glyph step={step} on={index<=active}/><span className="min-w-0"><span className="block text-[10px] font-black text-primary">0{index+1} · {step.code}</span><span className="mt-1 block text-sm font-bold">{step.title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{step.detail}</span></span></button>{index<flow.steps.length-1?<div className="hidden items-center md:flex" aria-hidden="true"><span className={`h-px w-8 ${index<active?"bg-primary":"bg-border"}`}/><span className="-ml-1 h-2 w-2 rotate-45 border-r border-t border-current text-muted-foreground"/></div>:null}</div>)}</div>
      <div className="mt-6 flex items-center gap-4 border-t border-border pt-5"><div className="flex gap-2">{flow.steps.map((step,index)=><button key={step.title} type="button" onClick={()=>{setPlaying(false);setActive(index);}} aria-label={`${index+1}단계 ${step.title}`} className={`h-2.5 rounded-full border ${index===active?"w-8 border-primary bg-primary":"w-2.5 border-border bg-background"}`}/>)}</div><p aria-live="polite" className="text-sm leading-6"><strong>{active+1}. {flow.steps[active].title}</strong> — {flow.steps[active].detail}</p></div>
    </div></figure>;
}
