import ContentBoundary from "@/components/articles/content-boundary";
import { EUREKA_EVIDENCE } from "@/content/sionic-eureka";
import EmbeddingPathLocator from "../sentence-embeddings/EmbeddingPathLocator";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <EmbeddingPathLocator current="eureka-pipeline" />
      <h2 className="mb-6 text-2xl font-bold">
        평균 점수 하나로는 견고한 검색 임베딩을 만들 수 없습니다
      </h2>
      <div className="not-prose mb-8">
        <PipelineViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm leading-6 text-muted-foreground">
          그림의 0.86·0.05·0.82·0.76은 positive-aware mining의 경계를
          설명하려고 넣은 값 <strong>[A]</strong>입니다. 내부 teacher와 최종
          benchmark의 미공개 값은 채우지 않았습니다.
        </p>
        <p className="leading-7">
          EUREKA는 SionicAI에서 설계 중인{" "}
          <strong>
            Extremely Universal Robust Embedding for Knowledge Access
          </strong>
          입니다. 언어·도메인·쿼리 형태·문서 길이가 달라져도 관련 지식에 닿는
          검색 임베딩을 목표로 합니다. 여기서 universal은 모든 문제를 해결했다는
          선언이 아닙니다. 배포 환경에서 달라질 조건을 학습과 평가의 같은 축으로
          기록하겠다는 설계 목표입니다 <strong>[A]</strong>.
        </p>
        <ContentBoundary article="sionic-eureka" />

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          Artifact chain
        </h3>
        <p className="leading-7">
          파이프라인은 한 장의 그림으로 끝나지 않습니다. 각 단계가 다음 단계에
          넘기는 artifact를 고정해야 새 코퍼스, teacher, loss를 추가해도 나머지
          흐름을 따로 검증합니다.
        </p>
        <div className="not-prose my-6 grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
          {[
            ["[O]", "논문·공개 자료"],
            ["[M]", "내부 측정 기록"],
            ["[A]", "설계 분석"],
            ["[?]", "미공개·미확인"],
          ].map(([mark, meaning]) => (
            <div key={mark} className="bg-background px-3 py-3">
              <strong>{mark}</strong>
              <span className="ml-2 text-muted-foreground">{meaning}</span>
            </div>
          ))}
        </div>

        <p className="rounded-xl border-l-4 border-amber-400 bg-amber-500/5 p-4 text-sm leading-6">
          <strong>현재 공개 경계:</strong> {EUREKA_EVIDENCE.unreleasedDetails} 이
          값들은 공개된 뒤 manifest에서 갱신하며, 지금은 임의로 채우지 않습니다.
        </p>
      </div>
    </section>
  );
}
