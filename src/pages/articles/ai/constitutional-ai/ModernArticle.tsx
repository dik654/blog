import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ConstitutionalMethod from "../alignment-methods/ConstitutionalAI";
import AlignmentPipelineViz from "../alignment-methods/viz/AlignmentPipelineViz";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">원칙 하나를 초안 하나에 적용하는 장면부터</p>
          <h2 className="text-3xl font-bold tracking-tight">Constitutional AI는 “AI가 판단한다”보다 판단 기준이 어디서 왔는지를 먼저 드러냅니다</h2>
        </header>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8"><strong>Constitution</strong>은 모델 응답을 critique·revise·judge할 때 적용하는 자연어 원칙 목록입니다. 예를 들어 “확실하지 않은 사실을 꾸미지 말 것”은 초안의 위반을 찾는 질문과 수정 방향을 동시에 제공합니다.</p>
          <p className="leading-8">그 다음에야 여러 원칙을 조합합니다. 원칙 A와 B가 충돌할 때 어느 것을 먼저 적용할지, 예외는 무엇인지, AI evaluator의 판단을 사람이 어떤 표본에서 재검사할지를 명시해야 합니다. 원칙 목록만 만들었다고 일관된 안전 정책이 자동으로 생기지는 않습니다.</p>
        </div>
        <AlignmentPipelineViz mode="cai" />
        <ContentBoundary article="constitutional-ai" />
      </section>

      <section id="constitution" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>원칙의 형태를 먼저 보고 pipeline을 조합합니다</h2></div>
        <TermBreakdown
          title="Constitution 한 항목의 네 부분"
          items={[
            { term: "Trigger", description: "어떤 응답 상황에서 이 원칙을 검사할지 정합니다.", example: "의학적 확신을 표현한 문장이 있으면 근거·불확실성을 검사합니다.", boundary: "너무 넓은 trigger는 정상 답변까지 과잉 거절하게 만듭니다." },
            { term: "Principle", description: "허용하거나 금지할 behavior를 자연어로 적습니다.", example: "검증되지 않은 진단을 확정적으로 말하지 않습니다.", boundary: "추상적인 ‘좋게 답하라’는 재현 가능한 판정 기준이 아닙니다." },
            { term: "Priority", description: "두 원칙이 충돌할 때 적용 순서를 기록합니다.", example: "즉각적인 위해 방지가 완전성보다 우선할 수 있습니다.", boundary: "숫자 하나가 모든 문맥의 충돌을 자동 해결하지 않습니다." },
            { term: "Audit example", description: "허용·위반·경계 사례를 함께 둬 evaluator를 calibration합니다.", example: "정상 경고, 과잉 거절, 위험 지시의 세 slice를 분리합니다.", boundary: "Evaluator와 policy가 같은 model family면 shared blind spot을 별도 점검합니다." },
          ]}
        />
      </section>

      <ConstitutionalMethod />

      <section id="evaluation" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h2>RLAIF의 자동화 범위와 사람의 책임을 분리합니다</h2>
          <p className="leading-8">AI feedback은 모든 label을 사람이 직접 만드는 비용을 줄일 수 있습니다. 그러나 constitution 작성, principle conflict, judge calibration, red-team case와 최종 release 판단은 별도 책임입니다. Policy와 judge가 같은 말투를 선호해 점수만 함께 오르는 실패도 검사합니다.</p>
        </div>
        <div id="paper-rlaif" className="scroll-mt-20">
          <CitationBlock source="Bai et al. · Constitutional AI" citeKey={2} type="paper" href="https://arxiv.org/abs/2212.08073">
            <p><strong>문제:</strong> Harmlessness feedback을 원칙에 연결하고 대규모 사람 label 의존을 줄입니다.</p>
            <p><strong>핵심 기여:</strong> Self-critique·revision의 supervised phase와 AI preference를 쓰는 RL phase를 제시합니다.</p>
            <p><strong>전제:</strong> 원칙이 충분히 구체적이고 evaluator가 그 원칙을 일관되게 적용합니다.</p>
            <p><strong>근거 범위:</strong> 논문의 constitution, model, prompt와 평가 조건입니다.</p>
            <p><strong>비주장:</strong> Human oversight나 원칙 충돌 문제가 사라진다는 결론은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>
  );
}
