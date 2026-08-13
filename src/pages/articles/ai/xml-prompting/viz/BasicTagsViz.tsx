import VizFrame from "@/components/viz/VizFrame";

const syntax = [
  ["One root", "<request> … </request>", "문서 전체를 하나의 root로 감쌉니다."],
  ["Balanced tags", "<task>요약</task>", "시작 태그와 종료 태그를 짝지습니다."],
  ["Valid nesting", "<docs><doc>…</doc></docs>", "나중에 연 태그부터 먼저 닫습니다."],
  ["Escaping", "A &amp; B · x &lt; 10", "데이터 속 <, >, &를 markup과 구분합니다."],
] as const;

export default function BasicTagsViz() {
  return (
    <VizFrame
      eyebrow="XML syntax"
      title="파서가 구조를 복원하려면 네 가지 문법 조건이 먼저 맞아야 합니다"
      description="태그 이름의 의미를 정하기 전에 root·짝·중첩·escaping으로 well-formed XML을 만듭니다."
    >
      <ol className="grid gap-6 md:grid-cols-4">
        {syntax.map(([name, example, rule], index) => (
          <li key={name} className="min-w-0 border-t border-border/80 pt-4">
            <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            <h4 className="mt-2 text-sm font-bold">{name}</h4>
            <code className="mt-3 block min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {example}
            </code>
            <p className="mt-3 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {rule}
            </p>
          </li>
        ))}
      </ol>
    </VizFrame>
  );
}
