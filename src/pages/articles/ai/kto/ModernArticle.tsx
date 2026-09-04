import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import KTOObjective from "../alignment-methods/KTO";
import AlignmentPipelineViz from "../alignment-methods/viz/AlignmentPipelineViz";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">한 response에 붙은 좋아요 하나부터</p><h2 className="text-3xl font-bold tracking-tight">KTO는 pair를 억지로 만들지 않고 binary feedback을 기준점 양쪽에서 학습합니다</h2></header>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8"><strong>Binary feedback</strong>은 response 하나에 desirable 또는 undesirable label을 붙인 기록입니다. 같은 prompt의 두 답이 동시에 있어야 하는 pairwise preference와 형태가 다릅니다.</p>
          <p className="leading-8">KTO는 현재 policy가 reference보다 그 response를 얼마나 더 선호하는지 log-ratio로 계산합니다. Batch에서 추정한 KL을 <strong>reference point</strong>로 두고, desirable은 그 기준보다 위로, undesirable은 아래로 이동하도록 utility 방향을 나눕니다.</p>
        </div>
        <AlignmentPipelineViz mode="kto" />
        <ContentBoundary article="kto" />
      </section>

      <section id="binary-feedback" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>좋아요·싫어요 log가 곧 품질 label은 아닙니다</h2></div>
        <TermBreakdown title="Binary log를 학습 data로 바꾸기 전에 분리할 항목"
          items={[
            { term: "Exposure", description: "사용자가 실제로 response를 보았는지 기록합니다.", example: "스크롤 전에 이탈했다면 무응답을 dislike로 바꾸지 않습니다.", boundary: "노출되지 않은 example은 선호 판정이 아닙니다." },
            { term: "Desirable", description: "사용자가 긍정적으로 평가한 response입니다.", example: "문제 해결 뒤 명시적 thumbs-up을 누른 event입니다.", boundary: "사용자별 click 성향과 만족도를 같은 것으로 두지 않습니다." },
            { term: "Undesirable", description: "명시적으로 부정 평가된 response입니다.", example: "틀린 명령을 제시해 thumbs-down이 붙은 event입니다.", boundary: "Timeout·network error를 response 품질 label로 섞지 않습니다." },
            { term: "Class weight", description: "좋아요와 싫어요 수가 크게 다를 때 loss 기여를 조절합니다.", example: "90:10 log에서 raw count와 balanced result를 함께 보고합니다.", boundary: "가중치가 label noise나 exposure bias를 고치지는 않습니다." },
          ]} />
      </section>

      <KTOObjective />

      <section id="evaluation" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Pair 수집 비용을 줄여도 logging contract는 더 엄격해집니다</h2><p className="leading-8">
            Feedback propensity와 class balance는 user·surface·position별로 기록하고 reference revision과 KL estimate는
            time split에서 고정합니다. Offline utility가 좋아진 뒤에도 pairwise human audit과 사실성, over-refusal과 capability
            regression은 별도 holdout에서 다시 확인합니다.
          </p></div>
        <div id="paper-kto-implementation" className="scroll-mt-20"><CitationBlock source="Ethayarajh et al. · KTO" citeKey={2} type="paper" href="https://arxiv.org/abs/2402.01306"><p><strong>문제:</strong> 같은 prompt의 pair보다 독립 like/dislike가 많은 현실의 feedback을 사용합니다.</p><p><strong>핵심 기여:</strong> Policy/reference log-ratio를 KL reference point 양쪽의 비대칭 utility로 학습합니다.</p><p><strong>전제:</strong> Binary label 품질, reference policy와 안정적인 KL 추정이 필요합니다.</p><p><strong>근거 범위:</strong> 논문의 1B–30B model·dataset·class imbalance 조건입니다.</p><p><strong>비주장:</strong> Binary feedback이 pairwise preference보다 항상 더 깨끗하거나 우월하다는 뜻은 아닙니다.</p></CitationBlock></div>
      </section>
    </article>
  );
}
