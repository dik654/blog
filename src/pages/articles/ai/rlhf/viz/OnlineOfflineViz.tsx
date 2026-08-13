import type { ReactNode } from "react";

const rows = [
  ["Policy sample", "매 iteration 새 응답", "고정 dataset"],
  ["Reward signal", "Reward model + KL", "Pair·binary loss"],
  ["장점", "현재 policy의 support 탐색", "단순한 학습·재현"],
  ["주요 위험", "Reward hacking·분산 runtime", "Dataset support·shortcut"],
] as const;

export default function OnlineOfflineViz() {
  return (
    <figure data-viz="online-offline" className="not-prose my-8 overflow-hidden rounded-xl border border-border/70 bg-card">
      <figcaption className="border-b border-border/60 px-4 py-4 sm:px-6">
        <p className="text-sm font-bold">Online PPO와 offline preference optimization의 경계</p>
      </figcaption>
      <div className="overflow-x-auto p-4 sm:p-6">
        <div className="grid min-w-[34rem] grid-cols-[9rem_1fr_1fr] overflow-hidden rounded-lg border border-border/70 text-sm">
          <Cell head>비교축</Cell><Cell head>PPO-RLHF</Cell><Cell head>DPO · ORPO · KTO</Cell>
          {rows.flatMap((row) => row.map((cell, index) => <Cell key={`${row[0]}-${index}`} label={index === 0}>{cell}</Cell>))}
        </div>
      </div>
    </figure>
  );
}

function Cell({ children, head = false, label = false }: { children: ReactNode; head?: boolean; label?: boolean }) {
  return <div className={`border-b border-r border-border/60 p-3 last:border-r-0 ${head ? "bg-muted/35 font-bold" : label ? "bg-muted/20 font-semibold" : "bg-background text-muted-foreground"}`}>{children}</div>;
}
