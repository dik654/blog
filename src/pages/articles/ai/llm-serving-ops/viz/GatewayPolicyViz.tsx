import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Authenticate", "tenant · quota · budget"],
  ["Normalize", "schema · capabilities"],
  ["Filter", "context · tools · region"],
  ["Route", "health · load · cost"],
  ["Record", "attempt · reason · usage"],
] as const;

export default function GatewayPolicyViz() {
  return (
    <VizFrame
      eyebrow="Gateway policy"
      title="먼저 호환되지 않는 backend를 제외하고, 남은 후보에서 route를 고릅니다"
      description="Fallback은 단순한 모델명 교체가 아니라 같은 capability·privacy·latency 계약을 만족하는 후보 사이의 전환이어야 합니다."
    >
      <ol className="grid gap-5 md:grid-cols-5">
        {stages.map(([title, body], index) => (
          <li key={title} className="min-w-0">
            <p className="font-mono text-xs text-primary">0{index + 1}</p>
            <p className="mt-2 text-sm font-bold text-foreground">{title}</p>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">
              {body}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
