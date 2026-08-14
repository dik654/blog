import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ORPOObjective from "../alignment-methods/ORPO";
import AlignmentPipelineViz from "../alignment-methods/viz/AlignmentPipelineViz";

export default function ModernArticle() {
  return (
    <article className="space-y-16">
      <section id="overview" className="scroll-mt-20 space-y-7">
        <header className="space-y-3"><p className="text-sm font-semibold text-primary">Chosen을 따라가는 힘과 rejected에서 멀어지는 힘</p><h2 className="text-3xl font-bold tracking-tight">ORPO는 SFT와 preference를 없애지 않고 같은 training stage 안에서 조합합니다</h2></header>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8"><strong>SFT term</strong>은 chosen response의 token likelihood를 높입니다. 그러나 chosen만 모방하면 같은 prompt의 rejected response를 명시적으로 낮추지는 않습니다. ORPO는 여기에 <strong>odds-ratio preference term</strong>을 더해 두 response의 상대 간격을 벌립니다.</p>
          <p className="leading-8">“Monolithic”은 data 수집·검증까지 한 덩어리가 된다는 뜻이 아닙니다. 별도의 reference model을 사용하지 않고 chosen imitation과 pair separation을 한 optimization stage에 둔다는 뜻입니다.</p>
        </div>
        <AlignmentPipelineViz mode="orpo" />
        <ContentBoundary article="orpo" />
      </section>

      <section id="pair-contract" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>ORPO도 pair가 필요합니다</h2><p className="leading-8">Reference-free와 pair-free를 혼동하지 않습니다. ORPO의 한 example에는 같은 prompt의 chosen·rejected가 모두 들어갑니다.</p></div>
        <TermBreakdown title="한 stage에서 서로 다른 두 signal"
          items={[
            { term: "Chosen NLL", description: "Chosen response 자체를 잘 생성하도록 token loss를 줄입니다.", example: "Domain vocabulary와 답변 형식을 직접 학습합니다.", boundary: "Rejected와의 상대 separation을 혼자 만들지는 않습니다." },
            { term: "Chosen odds", description: "Chosen sequence probability를 p/(1−p) 형태의 odds로 읽습니다.", example: "Chosen odds가 커지면 preference margin이 증가합니다.", boundary: "긴 sequence의 작은 probability는 log-space에서 안정적으로 다룹니다." },
            { term: "Rejected odds", description: "같은 prompt에서 덜 선호된 response의 odds입니다.", example: "Chosen log-odds에서 rejected log-odds를 뺍니다.", boundary: "쉬운 rejected만 두면 length·style shortcut이 생깁니다." },
            { term: "λ", description: "Imitation loss와 preference separation의 상대 scale입니다.", example: "λ sweep에서 quality·margin·regression을 함께 봅니다.", boundary: "논문 default를 model 규모와 data가 달라도 그대로 쓰지 않습니다." },
          ]} />
      </section>

      <ORPOObjective />

      <section id="evaluation" className="scroll-mt-20 space-y-7">
        <div className="prose prose-neutral max-w-none dark:prose-invert"><h2>Reference forward 절약과 전체 training 비용을 구분합니다</h2><p className="leading-8">Reference model forward가 없어져도 trainable policy의 optimizer state·activation·checkpointing 비용은 남습니다. 같은 base·pair·token budget에서 peak memory, step time, chosen quality, rejected margin과 safety regression을 함께 측정합니다.</p></div>
        <div id="paper-orpo-implementation" className="scroll-mt-20"><CitationBlock source="Hong et al. · ORPO" citeKey={2} type="paper" href="https://arxiv.org/abs/2403.07691"><p><strong>문제:</strong> SFT 이후 별도 reference-based preference stage를 운영하는 복잡성을 줄입니다.</p><p><strong>핵심 기여:</strong> Chosen NLL과 odds-ratio preference term을 한 objective에 둡니다.</p><p><strong>전제:</strong> 같은 prompt의 chosen·rejected pair와 안정적인 sequence likelihood 계산이 있습니다.</p><p><strong>근거 범위:</strong> 논문의 model 규모·dataset·benchmark 범위입니다.</p><p><strong>비주장:</strong> 모든 큰 model에서 항상 더 싸거나 우월하다는 결론은 아닙니다.</p></CitationBlock></div>
      </section>
    </article>
  );
}
