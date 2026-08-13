import ContentBoundary from "@/components/articles/content-boundary";
import { EUREKA_EVIDENCE } from "@/content/sionic-eureka";
import OverviewViz from "./viz/OverviewViz";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        EUREKA: 평균 점수보다 조건이 바뀌어도 버티는 검색
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EUREKA는{" "}
          <strong>
            Extremely Universal Robust Embedding for Knowledge Access
          </strong>
          의 약자로, 언어·도메인·쿼리 형태·문서 길이가 달라져도 관련 지식에 닿는
          검색 임베딩을 목표로 하는 SionicAI 프로젝트다. 여기서 universal은 모든
          문제를 해결했다는 선언이 아니라, 변화를 학습·평가 축으로 명시하겠다는
          방향이다.
        </p>
        <ContentBoundary article="sionic-eureka" />

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          여섯 단계, 여섯 artifact
        </h3>
        <p className="leading-7">
          파이프라인은 한 장의 그림으로 끝나지 않는다. 각 단계가 다음 단계에
          넘기는 artifact를 고정해야 새 코퍼스, teacher, loss를 추가해도 나머지
          흐름을 따로 검증할 수 있다.
        </p>
        <div className="not-prose my-6">
          <PipelineViz />
        </div>

        <p className="rounded-xl border-l-4 border-amber-400 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>현재 공개 경계:</strong> {EUREKA_EVIDENCE.unreleasedDetails}이
          값들은 후속 공개 때 manifest에서 갱신하며, 지금은 임의로 보간하지
          않는다.
        </p>
      </div>
    </section>
  );
}
