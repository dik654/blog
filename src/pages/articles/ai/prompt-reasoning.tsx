import ChainOfThought from "./prompt-engineering/ChainOfThought";

export default function PromptReasoningArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">Reasoning boundary first</p>
        <h2 className="text-3xl font-bold tracking-tight">
          중간 reasoning, 최종 answer, 외부 판정을 먼저 분리한다
        </h2>
        <p className="text-lg leading-8 text-foreground/90">
          이 글은 Chain-of-Thought 기법 목록부터 시작하지 않습니다. 한 path가
          무엇인지, 여러 path에서 answer를 어떻게 세는지, 마지막 판정은 왜
          model 밖의 verifier가 맡아야 하는지를 순서대로 쌓습니다.
        </p>
      </section>
      <ChainOfThought />
    </article>
  );
}
