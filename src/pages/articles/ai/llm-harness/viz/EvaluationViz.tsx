import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Artifact", "요구한 결과물이 존재하고 내용이 맞는가", "test · schema · diff"],
  ["Trajectory", "허용된 근거와 tool 경로를 사용했는가", "trace · tool receipt"],
  ["Side effect", "외부 상태가 의도한 만큼만 바뀌었는가", "state query · invariant"],
  ["Operational", "비용·latency·retry가 budget 안인가", "token · wall time · SLA"],
] as const;

export default function EvaluationViz() {
  return (
    <VizFrame
      eyebrow="Evaluation stack"
      title="성공은 답변 하나가 아니라 결과물·과정·외부 상태·운영 비용의 교집합입니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {layers.map(([name, question, oracle]) => (
          <div key={name} className="min-w-0 border-t border-border/80 pt-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {question}
            </p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {oracle}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
