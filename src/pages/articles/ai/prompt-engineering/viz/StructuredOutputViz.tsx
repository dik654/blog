import VizFrame from "@/components/viz/VizFrame";

const gates = [
  ["Parse", "Valid JSON/XML인가?", "Syntax"], ["Schema", "Field·type·enum이 맞는가?", "Structure"],
  ["Domain", "ID·range·state가 실제로 유효한가?", "Semantics"], ["Policy", "사용·실행해도 되는가?", "Authorization"],
] as const;

export default function StructuredOutputViz() {
  return (
    <VizFrame eyebrow="Validation pipeline" title="파싱 가능한 출력에서 업무에 사용할 수 있는 결과까지 네 gate를 통과합니다" description="앞 단계의 통과가 뒤 단계의 truth·permission을 보장하지 않습니다.">
      <ol className="grid gap-6 md:grid-cols-4">{gates.map(([name, question, layer], index) => <li key={name} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span><h4 className="mt-2 text-sm font-bold">{name}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">{question}</p><p className="mt-3 text-xs font-semibold text-primary">{layer}</p></li>)}</ol>
    </VizFrame>
  );
}
