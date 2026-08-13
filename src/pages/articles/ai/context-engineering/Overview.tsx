import ContextOverviewViz from "./viz/ContextOverviewViz";
import OverviewDetailViz from "./viz/OverviewDetailViz";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        컨텍스트 엔지니어링은 지금 필요한 정보를 골라 배치한다
      </h2>
      <div className="not-prose mb-8">
        <ContextOverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          에이전트가 한두 번의 질문을 넘어 긴 작업을 수행하기 시작하면, 좋은
          프롬프트만으로는 부족합니다. 시스템 지침, 대화 기록, RAG로 찾은 문서,
          도구 실행 결과와 메모리가 계속 쌓이기 때문입니다.{" "}
          <strong>컨텍스트 엔지니어링</strong>은 이 정보 가운데 지금 필요한 것을
          고르고, 모델이 활용하기 좋은 위치와 형태로 넣고, 오래된 내용은
          요약하거나 제거하는 작업을 함께 다룹니다.
        </p>
        <p>
          컨텍스트 윈도우가 커졌다고 해서 모든 기록을 그대로 넣는 것이 정답은
          아닙니다. 관련 없는 정보는 중요한 근거를 가리는 distractor가 될 수
          있고, 긴 문맥의 가운데 정보를 놓치는{" "}
          <strong>lost in the middle</strong>도 고려해야 합니다. 따라서 모델
          교체와 컨텍스트 개선은 대체 관계가 아니며, 먼저 실패 원인이 모델
          역량인지 정보 선택과 배치의 문제인지 구분해야 합니다.
        </p>
        <ContentBoundary article="context-engineering" />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">
          컨텍스트 구성 요소 + 원칙
        </h3>
        <div className="not-prose mb-6">
          <OverviewDetailViz />
        </div>
        <p className="leading-7">
          이후 절에서는 컨텍스트를 구성하는 요소를 나눈 뒤, 선택(selection),
          주입(injection), compaction, 격리라는 네 가지 관점에서 관리 방법을
          살펴봅니다. <strong>compaction</strong>은 오래된 대화와 도구 결과를
          작업에 필요한 상태로 압축하는 업계 용어이므로 그대로 사용합니다.
          중요한 것은 토큰을 많이 채우는 일이 아니라, 다음 판단에 필요한 근거를
          손실 없이 남기는 일입니다.
        </p>
        <div id="paper-anthropic-context-engineering" className="scroll-mt-24">
          <CitationBlock
            source="Anthropic — Effective context engineering for AI agents"
            citeKey={1}
            href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
          >
            Context를 sampling 시점에 들어가는 유한한 token 자원으로 보고,
            just-in-time retrieval·compaction·structured note·sub-agent를 선택하는
            기준을 설명합니다. Anthropic의 제품·고객 경험에서 나온 설계
            가이드이므로 모든 model과 workload의 보편 법칙은 아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
