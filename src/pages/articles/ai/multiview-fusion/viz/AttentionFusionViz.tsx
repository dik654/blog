import VizFrame from "@/components/viz/VizFrame";

const tokenRows = [
  ["content", "patch에서 무엇이 보였는가", "E(xᵥ,ₙ)"],
  ["space", "view 안의 어느 위치인가", "pₙ"],
  ["view", "어느 camera·sensor인가", "qᵥ"],
  ["pose · time", "다른 view와 좌표·시각이 어떻게 이어지는가", "r(cᵥ)"],
  ["mask", "현재 token을 실제로 사용할 수 있는가", "attention mask"],
];

export default function AttentionFusionViz() {
  return (
    <VizFrame eyebrow="Cross-view token ledger" title="Attention에 들어가기 전 token의 의미와 visibility를 분리합니다" description="Token metadata는 correspondence의 단서이며, 정확한 3D 정렬을 자동으로 보장하는 표식은 아닙니다.">
      <div className="min-w-0 border-y border-border">
        {tokenRows.map(([part, role, representation]) => (
          <div key={part} className="grid min-w-0 gap-2 border-b border-border py-4 text-sm last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)_8rem] sm:gap-6">
            <strong>{part}</strong><span className="text-muted-foreground">{role}</span><code className="break-words text-xs text-indigo-800 dark:text-indigo-200">{representation}</code>
          </div>
        ))}
      </div>
      <div className="mt-7 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
        <div><p className="text-xs font-semibold text-muted-foreground">Late pooling</p><p className="mt-2 text-sm">view마다 1 token</p></div>
        <div><p className="text-xs font-semibold text-muted-foreground">Joint attention</p><p className="mt-2 text-sm">모든 spatial token 쌍</p></div>
        <div><p className="text-xs font-semibold text-muted-foreground">절충</p><p className="mt-2 text-sm">bottleneck·local match·cross-attention</p></div>
      </div>
    </VizFrame>
  );
}
