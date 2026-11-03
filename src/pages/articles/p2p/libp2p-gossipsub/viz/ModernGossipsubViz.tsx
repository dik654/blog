import { useState } from "react";

const pathStages = [
  { title: "announcement", note: "CID·version·서명만 담고 file bytes는 넣지 않습니다." },
  { title: "message ID", note: "기본 source+sequence ID로 local duplicate를 막습니다." },
  { title: "initial publish", note: "기본 flood publish는 eligible subscriber에 full message를 enqueue합니다." },
  { title: "IHAVE", note: "Heartbeat가 mesh 밖 peer에 최근 message ID를 알립니다." },
  { title: "IWANT", note: "Bob은 없는 ID만 요청하고 cache가 남아 있으면 full message를 받습니다." },
  { title: "fetch + verify", note: "별도 protocol로 file을 받고 CID를 다시 계산합니다." },
] as const;

export function GossipPathViz() {
  const [active, setActive] = useState(0);
  const highlightedEdge = active < 5 ? active : 4;
  return (
    <figure data-viz="gossipsub-dual-path" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-6">
      <figcaption>
        <p className="text-sm font-bold">Announcement 한 건이 Bob의 검증된 file로 이어지는 길</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Message 전파와 content fetch를 한 성공으로 합치지 않고 여섯 단계로 나눕니다.</p>
      </figcaption>
      <div role="group" aria-label="GossipSub announcement 단계" className="mt-4 grid min-w-0 grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
        {pathStages.map((stage, index) => (
          <button key={stage.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-10 min-w-0 rounded-md border px-1.5 text-[10px] font-bold sm:text-[11px] ${active === index ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
            {index + 1}. {stage.title}
          </button>
        ))}
      </div>
      <svg data-viz-canvas viewBox="0 0 780 300" role="img" aria-label="Alice publish에서 Bob file 검증까지의 이중 경로" className="mt-4 block h-auto w-full">
        <defs>
          <marker id="gossip-path-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
            <path d="M0 0 L8 4 L0 8 Z" className="fill-muted-foreground" />
          </marker>
        </defs>
        {[0, 1, 2, 3].map((edge) => (
          <path key={edge} d={`M ${146 + edge * 156} 100 H ${164 + edge * 156}`} className={edge === highlightedEdge ? "fill-none stroke-primary" : "fill-none stroke-muted-foreground/50"} strokeWidth="1.25" markerEnd="url(#gossip-path-arrow)" />
        ))}
        <path d="M 702 142 C 702 210 590 220 550 220" className={active === 5 ? "fill-none stroke-primary" : "fill-none stroke-muted-foreground/50"} strokeWidth="1.25" markerEnd="url(#gossip-path-arrow)" />
        {[
          { x: 18, label: "Alice", sub: "announcement" },
          { x: 174, label: "Local", sub: "ID + cache" },
          { x: 330, label: "Peers", sub: "full message" },
          { x: 486, label: "Heartbeat", sub: "IHAVE IDs" },
          { x: 642, label: "Bob", sub: "IWANT → message" },
        ].map((node, index) => (
          <g key={node.label}>
            <rect x={node.x} y="60" width="128" height="82" rx="12" className={active === index ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} strokeWidth="1.25" />
            <text x={node.x + 64} y="91" textAnchor="middle" className="fill-foreground text-[13px] font-bold">{node.label}</text>
            <text x={node.x + 64} y="116" textAnchor="middle" className="fill-muted-foreground text-[10px]">{node.sub}</text>
          </g>
        ))}
        <rect x="266" y="194" width="284" height="64" rx="12" className={active === 5 ? "fill-emerald-500/10 stroke-emerald-500" : "fill-background stroke-border"} strokeWidth="1.25" />
        <text x="408" y="219" textAnchor="middle" className="fill-foreground text-[12px] font-bold">Bitswap / QUIC stream</text>
        <text x="408" y="240" textAnchor="middle" className="fill-muted-foreground text-[10px]">file bytes fetch → CID recompute</text>
        <rect x="90" y="272" width="600" height="24" rx="8" className="fill-background stroke-border" />
        <text x="390" y="288" textAnchor="middle" className="fill-foreground text-[10px]">{pathStages[active].note}</text>
      </svg>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">1~5는 announcement 전파입니다. 6번만 실제 payroll bytes와 content integrity를 다룹니다.</p>
    </figure>
  );
}

const scoreStages = [
  { label: "topic", value: "12 → 10", note: "cap 적용" },
  { label: "app", value: "+2", note: "업무 정책" },
  { label: "IP", value: "−3", note: "주소 밀집" },
  { label: "behavior", value: "−1", note: "행동 감점" },
  { label: "slow", value: "−1", note: "소비 지연" },
  { label: "total", value: "7", note: "threshold 비교" },
] as const;

export function ScoreViz() {
  const [active, setActive] = useState(0);
  const totals = [10, 12, 9, 8, 7, 7];
  return (
    <figure data-viz="gossipsub-score" className="not-prose my-8 min-w-0 overflow-hidden rounded-xl border border-border/70 bg-muted/15 p-3 sm:p-6">
      <figcaption>
        <p className="text-sm font-bold">Local score 장부: 항을 더한 뒤 threshold가 행동을 정합니다</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">아래 숫자는 계산 설명용입니다. Library default score가 아닙니다.</p>
      </figcaption>
      <div role="group" aria-label="Peer score 계산 단계" className="mt-4 grid min-w-0 grid-cols-3 gap-1.5 sm:grid-cols-6">
        {scoreStages.map((stage, index) => (
          <button key={stage.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={`min-h-10 min-w-0 rounded-md border px-1 text-[10px] font-bold sm:text-[11px] ${active === index ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground"}`}>
            {index + 1}. {stage.label}
          </button>
        ))}
      </div>
      <svg data-viz-canvas viewBox="0 0 780 280" role="img" aria-label="Topic cap부터 total score 7까지의 누적 계산" className="mt-4 block h-auto w-full">
        <path d="M 72 220 H 730" className="fill-none stroke-border" strokeWidth="1.25" />
        {scoreStages.map((stage, index) => {
          const x = 76 + index * 112;
          const height = Math.max(24, totals[index] * 11);
          const y = 220 - height;
          return (
            <g key={stage.label}>
              <rect x={x} y={y} width="76" height={height} rx="8" className={active === index ? "fill-primary/25 stroke-primary" : index === 5 ? "fill-emerald-500/15 stroke-emerald-500" : "fill-muted stroke-border"} strokeWidth="1.25" />
              <text x={x + 38} y={y + 24} textAnchor="middle" className="fill-foreground text-[13px] font-bold">{stage.value}</text>
              <text x={x + 38} y="242" textAnchor="middle" className="fill-foreground text-[11px] font-semibold">{stage.label}</text>
              <text x={x + 38} y="260" textAnchor="middle" className="fill-muted-foreground text-[9px]">{stage.note}</text>
            </g>
          );
        })}
        <rect x="210" y="24" width="360" height="42" rx="10" className="fill-background stroke-border" />
        <text x="390" y="42" textAnchor="middle" className="fill-primary text-[11px] font-bold">현재 누적 score · {totals[active]}</text>
        <text x="390" y="57" textAnchor="middle" className="fill-muted-foreground text-[9px]">{scoreStages[active].note} 뒤의 값 · 최종 action은 configured threshold와 비교</text>
      </svg>
    </figure>
  );
}
