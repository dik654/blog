import RLApproach from "./qwen-korean-reasoning-posttraining/RLApproach";
import ContentBoundary from "@/components/articles/content-boundary";
import RLApproachViz from "./qwen-korean-reasoning-posttraining/viz/RLApproachViz";
import { QwenCandidateReturn, QwenPosttrainingLocator } from "./shared/QwenKoreanPathLocator";

export default function QwenKoreanReasoningPosttrainingArticle() {
  return (
    <article className="space-y-12">
      <QwenPosttrainingLocator />
      <div className="not-prose">
        <RLApproachViz />
      </div>
      <header id="overview" className="scroll-mt-20">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이 글은 Qwen의 표면 언어를 규칙으로 고치는 방법이 아니라,
            <strong>한국어 reasoning demonstration과 reward로 policy weight를
            업데이트하는 실험</strong>을 읽습니다. SFT warm start, group-relative
            advantage, deterministic checker와 frozen judge의 충돌, reward receipt를
            분리해 “한국어가 늘었다”와 “문제 해결 능력이 좋아졌다”를 섞지 않습니다.
          </p>
          <p>
            현상 taxonomy와 가장 작은 개입을 고르는 의사결정은
            <a href="/cs/ai/qwen-korean-consistency"> Qwen 한국어 일관성 글</a>에서
            먼저 확인합니다.
          </p>
          <p>
            이 글에서도 “9,600원을 세 사람이 나누고 ‘서울’을 중국어로 번역해 달라”는 질문을
            사용합니다. 다만 이는 논문 데이터의 실제 한 행이 아니라, SFT와 RL의 역할을 앞 글과
            같은 사례로 설명하기 위한 독자용 예시입니다.
          </p>
        </div>
        <ContentBoundary article="qwen-korean-reasoning-posttraining" />
      </header>
      <RLApproach />
      <QwenCandidateReturn kind="정책 재학습" />
    </article>
  );
}
