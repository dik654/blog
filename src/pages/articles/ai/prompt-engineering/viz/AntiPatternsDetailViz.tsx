import VizFrame from "@/components/viz/VizFrame";

const owners = [
  ["Prompt", "Objective·boundary·output가 모호함"], ["Context", "근거 누락·stale·untrusted data 혼합"],
  ["Decoder", "Syntax·sampling instability"], ["Runtime", "Permission·effect·secret·egress"],
  ["Model/training", "지속적인 capability·language·domain gap"],
] as const;

export function AntiPatternListViz() {
  return (
    <VizFrame eyebrow="Root-cause routing" title="관측한 실패를 실제로 바꿀 수 있는 owner에게 보냅니다" description="한 failure가 여러 owner를 가질 때는 ablation으로 우선 원인을 분리합니다.">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{owners.map(([owner, failure], index) => <section key={owner} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><h4 className="mt-2 text-sm font-bold">{owner}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">{failure}</p></section>)}</div>
    </VizFrame>
  );
}

const loop = [
  ["Capture", "Failure input·output·trace 저장"], ["Classify", "Quality·format·evidence·policy·cost"],
  ["Change", "한 owner·한 변수만 수정"], ["Compare", "Paired eval + slice + budget"],
  ["Ship", "Canary · monitor · rollback"],
] as const;

export function TroubleshootViz() {
  return (
    <VizFrame eyebrow="Regression loop" title="한 번의 성공 대신 실패를 재현하고 변경 효과를 추적합니다" description="Prompt hash와 model·template·tool schema·decoding version을 같은 receipt에 남깁니다.">
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{loop.map(([name, action], index) => <li key={name} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><h4 className="mt-2 text-sm font-bold">{name}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">{action}</p></li>)}</ol>
    </VizFrame>
  );
}
