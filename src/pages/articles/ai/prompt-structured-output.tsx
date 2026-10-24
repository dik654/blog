import StructuredOutput from "./prompt-engineering/StructuredOutput";
import { OutputValidationViz } from "./prompt-engineering/viz/OutputValidationViz";
import {
  PromptRequestPathLocator,
  PromptRequestPathMapReturn,
} from "./shared/PromptRequestPathLocator";

export default function PromptStructuredOutputArticle() {
  return (
    <article className="space-y-14">
      <PromptRequestPathLocator current="structured" />
      <section id="overview" data-teach-level="big-picture" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">검증 경계부터</p>
        <h2 className="text-3xl font-bold tracking-tight">
          JSON 문자열에서 시작해 신뢰 가능한 record까지 네 문을 통과한다
        </h2>
        <div className="not-prose my-8"><OutputValidationViz /></div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8 text-foreground/90">
            구조화 출력은 결과를 사용하는 쪽과 맺는 계약입니다. 문법 해석, 스키마, 업무 규칙을 한 단계씩 검증하고 실패하면
            정해진 횟수만 보정한 뒤 타입이 분명한 대체값으로 끝냅니다. 필드 이름을 많이 나열하는 기능이 아닙니다.
          </p>
        </div>
      </section>
      <StructuredOutput />
      <PromptRequestPathMapReturn current="structured" />
    </article>
  );
}
