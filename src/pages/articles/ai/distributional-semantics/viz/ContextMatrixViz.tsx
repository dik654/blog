import VizFrame from "@/components/viz/VizFrame";

const contexts = [
  ["Linear window", "±k nearby tokens", "local syntagmatic usage"],
  ["Directional", "left/right separated", "word order"],
  ["Dependency", "relation + governor", "syntactic function"],
  ["Document", "term × document", "topic association"],
] as const;

export default function ContextMatrixViz() {
  return (
    <VizFrame
      eyebrow="Context definition"
      title="행렬의 column을 무엇으로 정의하느냐가 vector space의 관계를 바꿉니다"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {contexts.map(([name, feature, tendency]) => (
          <div key={name} className="min-w-0 border-l border-border/80 pl-4">
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">
              {feature}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {tendency}
            </p>
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
