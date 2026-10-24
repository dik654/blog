import FewShot from "./prompt-engineering/FewShot";
import { FewShotContextViz } from "./prompt-engineering/viz/FewShotContextViz";
import {
  PromptRequestPathLocator,
  PromptRequestPathMapReturn,
} from "./shared/PromptRequestPathLocator";

export default function PromptFewShotArticle() {
  return (
    <article className="space-y-14">
      <PromptRequestPathLocator current="few-shot" />
      <section id="overview" data-teach-level="big-picture" className="scroll-mt-20 space-y-4">
        <p className="text-sm font-semibold text-primary">예시 한 개부터</p>
        <h2 className="text-3xl font-bold tracking-tight">
          예시 한 개의 형태를 이해한 뒤 selection·order·비용을 붙인다
        </h2>
        <div className="not-prose my-8"><FewShotContextViz /></div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8 text-foreground/90">
            예시는 현재 요청 안에서만 작동하는 조건입니다. 모델 가중치를 바꾸는 학습 데이터가 아닙니다. 예시 한 개의 형태를 먼저 고정한 뒤 여러 예시의 구성과 순서,
            요청마다 반복되는 문맥 비용을 살펴봅니다.
          </p>
        </div>
      </section>
      <FewShot />
      <PromptRequestPathMapReturn current="few-shot" />
    </article>
  );
}
