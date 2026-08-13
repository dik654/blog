import VizFrame from "@/components/viz/VizFrame";

const levels = [
  ["Well-formed", "태그 짝·root·중첩·escaping", "<age>old</age>도 통과할 수 있음"],
  ["Schema-valid", "element·type·cardinality", "age가 integer인지 검사"],
  ["Semantically valid", "업무 규칙·실재 id·근거 일치", "age 범위와 source를 대조"],
] as const;

export default function ParsingDetailViz() {
  return (
    <VizFrame
      eyebrow="Validity levels"
      title="파싱 성공·schema 통과·의미가 맞음은 서로 다른 판정입니다"
      description="production parser는 가장 앞의 문법 검사만 담당하고, 이후 단계는 별도 schema와 domain logic이 맡습니다."
    >
      <div className="grid gap-7 md:grid-cols-3">
        {levels.map(([level, checks, limit], index) => (
          <section key={level} className="min-w-0 border-t border-border/80 pt-4">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="text-sm font-bold">{level}</h4>
              <span className="font-mono text-[11px] text-muted-foreground">0{index + 1}</span>
            </div>
            <p className="mt-3 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              확인 · {checks}
            </p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              경계 · {limit}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
