import StructuredOutput from "./prompt-engineering/StructuredOutput";

export default function PromptStructuredOutputArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">Record boundary first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          JSON 문자열에서 시작해 신뢰 가능한 record까지 네 문을 통과한다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          Structured output의 정체는 consumer contract입니다. Parse, schema, domain validation을 한 단계씩 정의하고 실패하면
          bounded repair와 typed fallback으로 끝냅니다. field 이름을 많이 나열하는 기능이 아닙니다.
        </p>
      </section>
      <StructuredOutput />
    </article>
  );
}
