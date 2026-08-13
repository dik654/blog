import VizFrame from "@/components/viz/VizFrame";

const probes = [
  [
    "startupProbe",
    "초기화가 끝났는가?",
    "성공 전에는 readiness와 liveness를 시작하지 않음",
  ],
  [
    "readinessProbe",
    "지금 새 traffic을 받아도 되는가?",
    "실패하면 Service endpoint에서 제외",
  ],
  [
    "livenessProbe",
    "restart만이 복구 방법인가?",
    "실패 임계치 후 container restart",
  ],
] as const;

export default function ProbeContractViz() {
  return (
    <VizFrame
      eyebrow="Probe semantics"
      title="세 probe는 질문도 실패했을 때의 동작도 다릅니다"
    >
      <div className="grid gap-5 md:grid-cols-3">
        {probes.map(([name, question, action]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <code className="break-all text-xs font-bold text-primary">
              {name}
            </code>
            <p className="mt-3 text-sm font-bold leading-6 text-foreground">
              {question}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {action}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
