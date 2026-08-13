import VizFrame from "@/components/viz/VizFrame";

const selection = [
  ["Representative", "운영 분포의 흔한 사례"], ["Boundary", "class가 갈리는 최소 차이"],
  ["Hard negative", "비슷하지만 다른 label"], ["Abstention", "근거 부족·범위 밖 사례"],
] as const;

export function DesignViz() {
  return (
    <VizFrame eyebrow="Demonstration set" title="예시는 개수보다 decision boundary를 얼마나 덮는지가 중요합니다" description="실제 request와 같은 input/output serialization을 사용하고 민감 정보는 제거합니다.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{selection.map(([name, role], index) => <section key={name} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><h4 className="mt-2 text-sm font-bold">{name}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">{role}</p></section>)}</div>
    </VizFrame>
  );
}

const tests = [
  ["Baseline", "Zero-shot quality·token·latency"], ["Subset", "Example group별 marginal gain"],
  ["Permutation", "Order별 prediction variance"], ["Slice", "Class·boundary·minority accuracy"],
] as const;

export function ICLViz() {
  return (
    <VizFrame eyebrow="Sensitivity test" title="ICL behavior는 subset·order·label balance를 흔들어 확인합니다" description="한 ordering의 최고 점수보다 permutation 전반의 안정성이 production에 더 중요할 수 있습니다.">
      <div className="divide-y divide-border/70">{tests.map(([test, metric]) => <section key={test} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr] sm:items-baseline"><h4 className="text-sm font-bold">{test}</h4><p className="text-xs leading-5 text-muted-foreground">{metric}</p></section>)}</div>
    </VizFrame>
  );
}
