import VizFrame from "@/components/viz/VizFrame";

const vocabulary = [
  ["Task", "<task> · <instructions>", "모델이 수행할 작업과 제약"],
  ["Evidence", "<document> · <context>", "인용·분석할 입력 데이터"],
  ["Demonstration", "<examples> · <example>", "같은 직렬화로 보여 주는 사례"],
  ["Consumer", "<output_format> · <answer>", "결과를 받을 쪽의 형식 계약"],
] as const;

export default function BasicTagsDetailViz() {
  return (
    <VizFrame
      eyebrow="Semantic vocabulary"
      title="태그 이름은 표준 명령어가 아니라 팀이 정하는 의미 vocabulary입니다"
      description="같은 역할에는 같은 이름을 쓰고, 이름만 보고도 데이터와 지시를 구분할 수 있게 설계합니다."
    >
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {vocabulary.map(([role, tags, meaning]) => (
          <section key={role} className="min-w-0 border-t border-border/80 pt-4">
            <h4 className="text-sm font-bold">{role}</h4>
            <code className="mt-3 block min-w-0 text-xs font-semibold leading-5 text-primary [overflow-wrap:anywhere]">
              {tags}
            </code>
            <p className="mt-3 text-xs leading-5 text-muted-foreground [overflow-wrap:anywhere]">
              {meaning}
            </p>
          </section>
        ))}
      </div>
    </VizFrame>
  );
}
