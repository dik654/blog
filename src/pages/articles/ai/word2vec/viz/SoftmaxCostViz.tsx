import VizFrame from "@/components/viz/VizFrame";

const routes = [
  ["Full softmax", "V개 output score", "정확한 normalized likelihood", "O(V)"],
  ["Hierarchical softmax", "tree path의 binary decisions", "tree-defined word probability", "O(log V)"],
  ["Negative sampling", "1 positive + k noise pairs", "binary discrimination objective", "O(k)"],
];

export default function SoftmaxCostViz() {
  return (
    <VizFrame eyebrow="Vocabulary cost" title="세 방법은 같은 softmax를 단순히 빠르게 계산하는 것이 아닙니다" description="Hierarchical softmax는 확률 parameterization을 바꾸고, negative sampling은 학습 objective 자체를 binary classification으로 바꿉니다.">
      <div className="divide-y divide-border/60 rounded-lg border border-border/70 bg-background">
        {routes.map(([name,work,meaning,cost])=><div key={name} className="grid gap-2 p-4 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.2fr)_4rem] sm:items-center"><p className="text-sm font-bold text-foreground">{name}</p><p className="text-xs leading-5 text-primary">{work}</p><p className="text-xs leading-5 text-muted-foreground">{meaning}</p><p className="font-mono text-xs font-bold sm:text-right">{cost}</p></div>)}
      </div>
    </VizFrame>
  );
}
