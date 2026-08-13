import VizFrame from "@/components/viz/VizFrame";

const gates = [
  ["Parse", "well-formed XML인가?", "syntax tree"],
  ["Structure", "required element·type이 맞는가?", "typed fields"],
  ["Domain", "id·range·citation이 실제로 유효한가?", "usable data"],
  ["Policy", "저장·실행·전송해도 되는가?", "authorized effect"],
] as const;

export default function ParsingViz() {
  return (
    <VizFrame
      eyebrow="Validation sequence"
      title="XML 문자열이 실제 업무 효과가 되기 전 네 gate를 순서대로 통과합니다"
      description="앞 단계가 성공해도 뒤 단계의 의미·권한까지 보장되지는 않습니다."
    >
      <ol className="grid gap-6 md:grid-cols-4">
        {gates.map(([name, question, output], index) => (
          <li key={name} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold">{name}</h4>
            <p className="mt-2 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {question}
            </p>
            <p className="mt-3 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              산출물 · {output}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
