import VizFrame from "@/components/viz/VizFrame";

const steps = [
  ["Discover", "Host가 현재 caller에게 보이는 primitive 목록을 확인"],
  ["Propose", "Model이 context를 바탕으로 tool call을 제안"],
  ["Authorize", "Host가 policy·사용자 동의·인자를 검사"],
  ["Execute", "Server가 caller 권한과 schema를 다시 검사해 실행"],
  ["Observe", "Typed result와 effect receipt가 다음 판단으로 돌아감"],
] as const;

export default function OverviewDetailViz() {
  return (
    <VizFrame
      eyebrow="한 요청의 경로"
      title="발견에서 observation까지, MCP가 맡는 구간을 따라갑니다"
      description="Model의 제안과 runtime의 승인을 분리해야 protocol 호환이 곧 실행 권한으로 바뀌지 않습니다."
    >
      <ol className="divide-y divide-border/70">
        {steps.map(([label, body], index) => (
          <li key={label} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[2.5rem_7rem_1fr] sm:items-baseline">
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <strong className="text-sm text-foreground">{label}</strong>
            <span className="text-sm leading-6 text-muted-foreground">{body}</span>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
