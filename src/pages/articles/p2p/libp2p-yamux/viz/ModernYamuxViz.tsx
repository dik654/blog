import { useState } from "react";

const stages = [
  { short: "TCP", title: "연결 하나", detail: "Alice↔Bob ordered bytes" },
  { short: "Noise", title: "인증·암호화", detail: "실제 PeerId + secure I/O" },
  { short: "Yamux", title: "번호표 부여", detail: "stream 1 · stream 3" },
  { short: "Protocol", title: "용도 합의", detail: "payroll · receipt" },
  { short: "Verify", title: "내용 검증", detail: "range · bytes · CID" },
] as const;

export function YamuxStackViz() {
  const [active, setActive] = useState(0);
  return (
    <figure data-viz="yamux-stack" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-6">
      <figcaption>
        <p className="text-sm font-bold">한 payroll 요청이 연결 안에서 자기 줄을 얻는 과정</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">각 단계를 누르면 그 계층이 새로 보장하는 것만 강조됩니다.</p>
      </figcaption>
      <div role="group" aria-label="Yamux 계층 단계" className="mt-4 grid grid-cols-5 gap-1.5">
        {stages.map((stage, index) => (
          <button key={stage.short} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-10 min-w-0 rounded-md border px-1 text-[10px] font-bold sm:text-xs ${active === index ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
            {index + 1}. {stage.short}
          </button>
        ))}
      </div>
      <svg data-viz-canvas viewBox="0 0 760 250" role="img" aria-label="TCP에서 검증까지 이어지는 다섯 단계" className="mt-4 block h-auto w-full">
        <defs>
          <marker id="yamux-stack-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        {stages.slice(0, -1).map((_, index) => (
          <path key={index} d={`M ${142 + index * 150} 104 H ${162 + index * 150}`} className="fill-none stroke-muted-foreground" strokeWidth="1.25" markerEnd="url(#yamux-stack-arrow)" />
        ))}
        {stages.map((stage, index) => {
          const x = 12 + index * 150;
          const selected = active === index;
          return (
            <g key={stage.short}>
              <rect x={x} y="62" width="130" height="84" rx="12" className={selected ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} strokeWidth="1.25" />
              <text x={x + 65} y="91" textAnchor="middle" className={selected ? "fill-primary text-[14px] font-bold" : "fill-foreground text-[14px] font-bold"}>{stage.short}</text>
              <text x={x + 65} y="116" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">{stage.title}</text>
              <text x={x + 65} y="135" textAnchor="middle" className="fill-muted-foreground text-[10px]">{stage.detail}</text>
            </g>
          );
        })}
        <rect x="80" y="180" width="600" height="48" rx="10" className="fill-background stroke-border" />
        <text x="380" y="200" textAnchor="middle" className="fill-primary text-[12px] font-bold">현재 단계가 새로 보장하는 것</text>
        <text x="380" y="219" textAnchor="middle" className="fill-foreground text-[11px]">{stages[active].title} · {stages[active].detail}</text>
      </svg>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">Yamux가 소유하는 구간은 3번입니다. 앞의 인증과 뒤의 protocol·content 검증을 대신하지 않습니다.</p>
    </figure>
  );
}

const flowStages = [
  { title: "200 KiB 도착", note: "stream 1의 창은 56 KiB만 남습니다." },
  { title: "72 KiB 읽음", note: "update 후보 72 KiB는 절반 문턱보다 작습니다." },
  { title: "64 KiB 더 읽음", note: "누적 136 KiB를 소비해 update를 보냅니다." },
  { title: "stream 3 진행", note: "자기 credit가 있어 작은 receipt는 계속 갑니다." },
  { title: "socket 정체", note: "공유 TCP가 막히면 두 stream 모두 기다립니다." },
] as const;

export function YamuxBackpressureViz() {
  const [active, setActive] = useState(0);
  const s1Widths = [78, 62, 38, 38, 38];
  const s3Widths = [18, 26, 34, 70, 70];
  return (
    <figure data-viz="yamux-backpressure" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-6">
      <figcaption>
        <p className="text-sm font-bold">한 stream의 backpressure와 연결 전체 정체는 다릅니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">stream 1이 느려도 stream 3은 갈 수 있습니다. 마지막 단계에서만 shared socket이 둘을 함께 멈춥니다.</p>
      </figcaption>
      <div role="group" aria-label="Yamux backpressure 단계" className="mt-4 grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-5">
        {flowStages.map((stage, index) => (
          <button key={stage.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-10 min-w-0 rounded-md border px-1.5 text-[10px] font-bold sm:text-[11px] ${active === index ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
            {index + 1}. {stage.title}
          </button>
        ))}
      </div>
      <svg data-viz-canvas viewBox="0 0 760 330" role="img" aria-label="두 Yamux stream과 공유 TCP socket의 진행 상태" className="mt-4 block h-auto w-full">
        <defs>
          <marker id="yamux-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        <path d="M 168 89 H 232" className="fill-none stroke-muted-foreground" strokeWidth="1.25" markerEnd="url(#yamux-flow-arrow)" />
        <path d="M 168 189 H 232" className="fill-none stroke-muted-foreground" strokeWidth="1.25" markerEnd="url(#yamux-flow-arrow)" />
        <path d="M 522 89 H 586" className="fill-none stroke-muted-foreground" strokeWidth="1.25" markerEnd="url(#yamux-flow-arrow)" />
        <path d="M 522 189 H 586" className="fill-none stroke-muted-foreground" strokeWidth="1.25" markerEnd="url(#yamux-flow-arrow)" />
        <rect x="18" y="48" width="150" height="82" rx="12" className="fill-background stroke-emerald-500/60" strokeWidth="1.25" />
        <text x="93" y="73" textAnchor="middle" className="fill-foreground text-[13px] font-bold">Alice · stream 1</text>
        <rect x="42" y="87" width="102" height="14" rx="7" className="fill-muted stroke-border" />
        <rect x="42" y="87" width={s1Widths[active]} height="14" rx="7" className="fill-emerald-500/70" />
        <text x="93" y="119" textAnchor="middle" className="fill-muted-foreground text-[10px]">payroll DATA</text>
        <rect x="18" y="148" width="150" height="82" rx="12" className="fill-background stroke-sky-500/60" strokeWidth="1.25" />
        <text x="93" y="173" textAnchor="middle" className="fill-foreground text-[13px] font-bold">Alice · stream 3</text>
        <rect x="42" y="187" width="102" height="14" rx="7" className="fill-muted stroke-border" />
        <rect x="42" y="187" width={s3Widths[active]} height="14" rx="7" className="fill-sky-500/70" />
        <text x="93" y="219" textAnchor="middle" className="fill-muted-foreground text-[10px]">receipt DATA</text>
        <rect x="238" y="42" width="284" height="194" rx="16" className="fill-background stroke-primary/50" strokeWidth="1.25" />
        <text x="380" y="70" textAnchor="middle" className="fill-primary text-[14px] font-bold">Yamux · stream별 장부</text>
        <rect x="264" y="88" width="232" height="54" rx="10" className="fill-emerald-500/10 stroke-emerald-500/50" />
        <text x="380" y="111" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">stream 1 · own window / buffer</text>
        <text x="380" y="131" textAnchor="middle" className="fill-muted-foreground text-[10px]">느린 read는 이 stream의 credit만 줄임</text>
        <rect x="264" y="158" width="232" height="54" rx="10" className="fill-sky-500/10 stroke-sky-500/50" />
        <text x="380" y="181" textAnchor="middle" className="fill-foreground text-[12px] font-semibold">stream 3 · own window / buffer</text>
        <text x="380" y="201" textAnchor="middle" className="fill-muted-foreground text-[10px]">자기 credit가 있으면 sibling과 독립 진행</text>
        <rect x="592" y="48" width="150" height="182" rx="14" className={active === 4 ? "fill-red-500/10 stroke-red-500" : "fill-background stroke-border"} strokeWidth="1.25" />
        <text x="667" y="78" textAnchor="middle" className="fill-foreground text-[13px] font-bold">공유 Noise/TCP</text>
        <rect x="620" y="104" width="94" height="8" rx="4" className={active === 4 ? "fill-red-500" : "fill-emerald-500"} />
        <rect x="620" y="141" width="94" height="8" rx="4" className={active === 4 ? "fill-red-500" : "fill-sky-500"} />
        <text x="667" y="178" textAnchor="middle" className="fill-muted-foreground text-[10px]">같은 ordered byte wire</text>
        <text x="667" y="198" textAnchor="middle" className={active === 4 ? "fill-red-600 text-[11px] font-bold" : "fill-muted-foreground text-[11px] font-bold"}>{active === 4 ? "socket blocked" : "connection polling"}</text>
        <rect x="100" y="266" width="560" height="46" rx="10" className="fill-background stroke-border" />
        <text x="380" y="285" textAnchor="middle" className="fill-primary text-[11px] font-bold">{flowStages[active].title}</text>
        <text x="380" y="302" textAnchor="middle" className="fill-foreground text-[10px]">{flowStages[active].note}</text>
      </svg>
    </figure>
  );
}
