import ChainOfThought from "./prompt-engineering/ChainOfThought";
import { ReasoningPathsViz } from "./prompt-engineering/viz/ReasoningPathsViz";
import {
  PromptRequestPathLocator,
  PromptRequestPathMapReturn,
} from "./shared/PromptRequestPathLocator";

export default function PromptReasoningArticle() {
  return (
    <article className="space-y-14">
      <PromptRequestPathLocator current="reasoning" />
      <section id="overview" data-teach-level="big-picture" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">풀이 경계부터</p>
        <h2 className="text-3xl font-bold tracking-tight">
          중간 풀이, 최종 답, 외부 판정을 먼저 분리한다
        </h2>
        <div className="not-prose my-8"><ReasoningPathsViz /></div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8 text-foreground/90">
            이 글은 Chain-of-Thought 기법 목록부터 시작하지 않습니다. 풀이 경로 하나가 무엇인지, 여러 경로에서 답을 어떻게 집계하는지, 마지막 판정을 왜 모델 밖의
            검증기가 맡아야 하는지 순서대로 설명합니다.
          </p>
        </div>
      </section>
      <ChainOfThought />
      <PromptRequestPathMapReturn current="reasoning" />
    </article>
  );
}
