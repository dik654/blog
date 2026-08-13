import VizFrame from "@/components/viz/VizFrame";

const layers = [
  ["Instruction", "System policy · task objective", "Model이 따라야 할 요청"],
  ["Evidence", "User input · retrieved document", "인용·분석할 untrusted data"],
  ["Output", "Schema · abstention · error", "Consumer와의 결과 계약"],
  ["Runtime", "Permission · validator · evaluator", "Prompt 밖에서 실제로 강제"],
] as const;

export function PrinciplesViz() {
  return (
    <VizFrame eyebrow="Message boundaries" title="Instruction·evidence·output·runtime을 같은 문장 덩어리로 섞지 않습니다" description="Delimiter는 의미 경계를 드러내지만 runtime authorization을 대체하지 않습니다.">
      <div className="divide-y divide-border/70">
        {layers.map(([label, example, role]) => <section key={label} className="grid min-w-0 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr_1fr] sm:items-baseline"><h4 className="text-sm font-bold">{label}</h4><p className="text-xs leading-5 text-primary">{example}</p><p className="text-xs leading-5 text-muted-foreground">{role}</p></section>)}
      </div>
    </VizFrame>
  );
}

const stack = [
  ["Model", "지식·reasoning·instruction following 능력"], ["Context", "현재 request에 실제로 들어온 evidence와 example"],
  ["Prompt", "Objective·boundary·output contract"], ["Decoder", "Temperature·top-p·constrained generation"],
  ["Validator", "Schema·test·rubric·human review"],
] as const;

export function HistoryViz() {
  return (
    <VizFrame eyebrow="System stack" title="Prompt 하나가 아니라 다섯 층의 조합이 실제 behavior를 만듭니다" description="한 층의 문제를 prompt 문장만 늘려 해결하면 원인이 가려집니다.">
      <ol className="grid gap-6 md:grid-cols-5">
        {stack.map(([name, role], index) => <li key={name} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><h4 className="mt-2 text-sm font-bold">{name}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">{role}</p></li>)}
      </ol>
    </VizFrame>
  );
}
